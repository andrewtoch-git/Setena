import { HttpBackend, HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { firstValueFrom } from 'rxjs';

import { environment } from '../../environments/environment';

import type { RespuestaAuth } from './modelos';

const CLAVE = 'setena.sesion';

interface Sesion {
  accessToken: string;
  refreshToken: string;
  usuario: RespuestaAuth['usuario'];
}

/**
 * Sesión del usuario: tokens guardados con Capacitor Preferences y renovación del token de acceso.
 * Usa un HttpClient sin interceptores (HttpBackend) para no entrar en bucle al refrescar.
 */
@Injectable({ providedIn: 'root' })
export class SesionService {
  private readonly http = new HttpClient(inject(HttpBackend));
  private readonly sesion = signal<Sesion | null>(null);
  private refrescando: Promise<string | null> | null = null;

  readonly iniciada = computed(() => this.sesion() !== null);
  readonly usuario = computed(() => this.sesion()?.usuario ?? null);
  readonly cargada = signal(false);

  get accessToken(): string | null {
    return this.sesion()?.accessToken ?? null;
  }

  async cargar(): Promise<void> {
    try {
      const { value } = await Preferences.get({ key: CLAVE });
      if (value) this.sesion.set(JSON.parse(value) as Sesion);
    } catch {
      this.sesion.set(null);
    } finally {
      this.cargada.set(true);
    }
  }

  async login(email: string, password: string): Promise<RespuestaAuth> {
    const r = await firstValueFrom(
      this.http.post<RespuestaAuth>(`${environment.apiUrl}/auth/login`, { email, password }),
    );
    await this.guardar(r);
    return r;
  }

  async guardar(r: Pick<RespuestaAuth, 'accessToken' | 'refreshToken' | 'usuario'>): Promise<void> {
    const s: Sesion = { accessToken: r.accessToken, refreshToken: r.refreshToken, usuario: r.usuario };
    this.sesion.set(s);
    await Preferences.set({ key: CLAVE, value: JSON.stringify(s) });
  }

  /**
   * Pide un token de acceso nuevo con el refresh token. Si hay varias peticiones a la vez,
   * todas esperan al mismo refresco (el refresh token es de un solo uso).
   */
  refrescar(): Promise<string | null> {
    if (!this.refrescando) {
      this.refrescando = this.hacerRefresco().finally(() => (this.refrescando = null));
    }
    return this.refrescando;
  }

  private async hacerRefresco(): Promise<string | null> {
    const actual = this.sesion();
    if (!actual) return null;
    try {
      const r = await firstValueFrom(
        this.http.post<RespuestaAuth>(`${environment.apiUrl}/auth/refresh`, {
          refreshToken: actual.refreshToken,
        }),
      );
      await this.guardar({ ...r, usuario: actual.usuario });
      return r.accessToken;
    } catch {
      await this.cerrarLocal();
      return null;
    }
  }

  async logout(): Promise<void> {
    const actual = this.sesion();
    await this.cerrarLocal();
    if (actual) {
      // Si falla (sin conexión), la sesión del servidor caduca sola.
      this.http.post(`${environment.apiUrl}/auth/logout`, { refreshToken: actual.refreshToken }).subscribe({
        error: () => undefined,
      });
    }
  }

  private async cerrarLocal(): Promise<void> {
    this.sesion.set(null);
    await Preferences.remove({ key: CLAVE });
  }
}
