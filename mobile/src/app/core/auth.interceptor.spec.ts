import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';

import { environment } from '../../environments/environment';

import { authInterceptor } from './auth.interceptor';
import { SesionService } from './sesion.service';

const API = environment.apiUrl;
const usuario = { id: 'u1', email: 'a@example.com', proveedores: ['email'] };

describe('authInterceptor', () => {
  let http: HttpClient;
  let ctrl: HttpTestingController;
  let sesion: SesionService;

  beforeEach(async () => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideHttpClient(withInterceptors([authInterceptor])), provideHttpClientTesting()],
    });
    http = TestBed.inject(HttpClient);
    ctrl = TestBed.inject(HttpTestingController);
    sesion = TestBed.inject(SesionService);
    await sesion.guardar({ accessToken: 'viejo', refreshToken: 'r1', usuario });
  });

  afterEach(() => ctrl.verify());

  /** Deja que se resuelvan las promesas internas (Preferences, refresco). */
  const tick = () => new Promise((r) => setTimeout(r, 0));

  it('añade el token a las peticiones a la API y no a otras', async () => {
    const b = firstValueFrom(http.get(`${API}/favoritos`));
    const req = ctrl.expectOne(`${API}/favoritos`);
    expect(req.request.headers.get('Authorization')).toBe('Bearer viejo');
    req.flush([]);
    await b;

    const c = firstValueFrom(http.get('https://otro.example.com/x'));
    const fuera = ctrl.expectOne('https://otro.example.com/x');
    expect(fuera.request.headers.has('Authorization')).toBe(false);
    fuera.flush({});
    await c;
  });

  it('con un 401 renueva el token una vez y repite la petición', async () => {
    const resp = firstValueFrom(http.get<string[]>(`${API}/favoritos`));
    ctrl.expectOne(`${API}/favoritos`).flush(null, { status: 401, statusText: 'Unauthorized' });
    await tick();

    const refresco = ctrl.expectOne(`${API}/auth/refresh`);
    expect(refresco.request.body).toEqual({ refreshToken: 'r1' });
    // El refresco va sin interceptor (no lleva el token viejo)
    expect(refresco.request.headers.has('Authorization')).toBe(false);
    refresco.flush({ accessToken: 'nuevo', refreshToken: 'r2', usuario });
    await tick();

    const repetida = ctrl.expectOne(`${API}/favoritos`);
    expect(repetida.request.headers.get('Authorization')).toBe('Bearer nuevo');
    repetida.flush(['ok']);
    expect(await resp).toEqual(['ok']);
    expect(sesion.accessToken).toBe('nuevo');
  });

  it('varias peticiones con 401 comparten un único refresco', async () => {
    const a = firstValueFrom(http.get(`${API}/favoritos`));
    const b = firstValueFrom(http.get(`${API}/conversaciones`));
    ctrl.expectOne(`${API}/favoritos`).flush(null, { status: 401, statusText: 'Unauthorized' });
    ctrl.expectOne(`${API}/conversaciones`).flush(null, { status: 401, statusText: 'Unauthorized' });
    await tick();

    ctrl.expectOne(`${API}/auth/refresh`).flush({ accessToken: 'nuevo', refreshToken: 'r2', usuario });
    await tick();

    ctrl.expectOne(`${API}/favoritos`).flush([]);
    ctrl.expectOne(`${API}/conversaciones`).flush([]);
    await Promise.all([a, b]);
  });

  it('si no se puede renovar, cierra la sesión y propaga el 401', async () => {
    const resp = firstValueFrom(http.get(`${API}/favoritos`));
    ctrl.expectOne(`${API}/favoritos`).flush(null, { status: 401, statusText: 'Unauthorized' });
    await tick();
    ctrl.expectOne(`${API}/auth/refresh`).flush(null, { status: 401, statusText: 'Unauthorized' });

    await expect(resp).rejects.toMatchObject({ status: 401 });
    expect(sesion.iniciada()).toBe(false);
  });

  it('sin sesión, un 401 no intenta renovar', async () => {
    await sesion.logout();
    ctrl.match(`${API}/auth/logout`).forEach((r) => r.flush(null));
    const resp = firstValueFrom(http.get(`${API}/favoritos`));
    ctrl.expectOne(`${API}/favoritos`).flush(null, { status: 401, statusText: 'Unauthorized' });
    await expect(resp).rejects.toMatchObject({ status: 401 });
  });
});
