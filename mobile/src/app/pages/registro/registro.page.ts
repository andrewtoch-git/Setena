import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import type { WritableSignal } from '@angular/core';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonContent, IonHeader, IonModal, NavController } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';

import { environment } from '../../../environments/environment';
import { ApiService } from '../../core/api.service';
import type { Catalogos, RespuestaAuth } from '../../core/modelos';
import { SesionService } from '../../core/sesion.service';
import { IconoComponent } from '../../ui/icono.component';

const CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
type CampoRegistro =
  'nombre' | 'correo' | 'pass' | 'pass2' | 'roles' | 'generos' | 'tipo' | 'ubic' | 'disp' | 'terminos';

const TIPOS = [
  { clave: 'remunerados', texto: 'Proyectos remunerados' },
  { clave: 'colaboraciones', texto: 'Colaboraciones gratuitas' },
] as const;

/**
 * Crear cuenta (wireframe: Registro, Registro-error, Registro-correo-existe).
 * El vídeo está aplazado (decisión del 25/11): el formulario no lo pide.
 */
@Component({
  selector: 'app-registro',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IonHeader, IonContent, IonModal, RouterLink, IconoComponent],
  templateUrl: './registro.page.html',
  styleUrls: ['../formularios.scss', './registro.page.scss'],
})
export class RegistroPage {
  private readonly api = inject(ApiService);
  private readonly http = inject(HttpClient);
  private readonly sesion = inject(SesionService);
  private readonly nav = inject(NavController);

  protected readonly catalogos = signal<Catalogos | null>(null);
  protected readonly tipos = TIPOS;

  protected readonly foto = signal<File | null>(null);
  protected readonly nombre = signal('');
  protected readonly correo = signal('');
  protected readonly pass = signal('');
  protected readonly pass2 = signal('');
  protected readonly roles = signal<string[]>([]);
  protected readonly generos = signal<string[]>([]);
  protected readonly tipo = signal<string[]>([]);
  protected readonly zona = signal('Barcelona ciudad');
  protected readonly lugar = signal('');
  protected readonly disponibilidad = signal<string[]>([]);
  protected readonly terminos = signal(false);

  protected readonly enviado = signal(false);
  protected readonly enviando = signal(false);
  protected readonly correoOcupado = signal(false);
  protected readonly errorServidor = signal<string | null>(null);

  /** Ventana de selección múltiple (Instrumento o rol / Géneros musicales). */
  protected readonly selector = signal<'roles' | 'generos' | null>(null);
  protected readonly borrador = signal<string[]>([]);

  protected readonly lugares = computed(() => this.catalogos()?.lugares[this.zona()] ?? []);

  protected readonly errores = computed((): Record<CampoRegistro, string | null> => {
    const correo = this.correo().trim();
    return {
      nombre: !this.nombre().trim() ? 'Este campo es obligatorio' : null,
      correo: !correo
        ? 'Este campo es obligatorio'
        : this.correoOcupado()
          ? 'Ya existe una cuenta con este correo.'
          : CORREO.test(correo)
            ? null
            : 'Introduce un correo válido (nombre@correo.com)',
      pass: !this.pass() ? 'Este campo es obligatorio' : this.pass().length < 8 ? 'Mínimo 8 caracteres' : null,
      pass2: !this.pass2()
        ? 'Repite la contraseña'
        : this.pass2() !== this.pass()
          ? 'Las contraseñas no coinciden'
          : null,
      roles: this.roles().length ? null : 'Este campo es obligatorio',
      generos: this.generos().length ? null : 'Este campo es obligatorio',
      tipo: this.tipo().length ? null : 'Este campo es obligatorio',
      ubic: this.lugar() ? null : 'Elige tu distrito o municipio',
      disp: this.disponibilidad().length ? null : 'Elige al menos una opción',
      terminos: this.terminos() ? null : 'Debes aceptar las condiciones para crear tu cuenta',
    };
  });
  protected readonly valido = computed(() => Object.values(this.errores()).every((e) => e === null));
  /** Un error solo se muestra después de intentar enviar. */
  protected err(campo: CampoRegistro): string | null {
    return this.enviado() ? this.errores()[campo] : null;
  }

  protected readonly banner = computed(() => {
    if (this.errorServidor()) return this.errorServidor();
    if (!this.enviado() || this.valido()) return null;
    const soloCorreo = Object.entries(this.errores()).every(([k, v]) => k === 'correo' || v === null);
    return this.correoOcupado() && soloCorreo
      ? 'Ya existe una cuenta con este correo. Inicia sesión o usa otro correo.'
      : 'Faltan campos obligatorios. Revisa los campos marcados.';
  });

  constructor() {
    void this.api.catalogos().then(
      (c) => this.catalogos.set(c),
      () => undefined,
    );
  }

  protected volver(): void {
    this.nav.back();
  }

  protected alternar(lista: WritableSignal<string[]>, valor: string): void {
    lista.update((l) => (l.includes(valor) ? l.filter((v) => v !== valor) : [...l, valor]));
  }

  protected elegirZona(z: string): void {
    if (z === this.zona()) return;
    this.zona.set(z);
    this.lugar.set('');
  }

  protected elegirFoto(ev: Event): void {
    const f = (ev.target as HTMLInputElement).files?.[0] ?? null;
    this.foto.set(f && ['image/jpeg', 'image/png'].includes(f.type) && f.size <= 10 * 1024 * 1024 ? f : null);
  }

  // ---------- selector en ventana ----------
  protected abrirSelector(cual: 'roles' | 'generos'): void {
    this.borrador.set([...(cual === 'roles' ? this.roles() : this.generos())]);
    this.selector.set(cual);
  }

  protected alternarBorrador(valor: string): void {
    this.borrador.update((l) => (l.includes(valor) ? l.filter((v) => v !== valor) : [...l, valor]));
  }

  protected guardarSelector(): void {
    if (this.selector() === 'roles') this.roles.set(this.borrador());
    if (this.selector() === 'generos') this.generos.set(this.borrador());
    this.selector.set(null);
  }

  protected readonly opcionesSelector = computed(() => {
    const c = this.catalogos();
    if (!c) return [];
    return this.selector() === 'roles' ? c.roles : this.selector() === 'generos' ? c.generos : [];
  });

  // ---------- envío ----------
  protected async registrarme(): Promise<void> {
    this.enviado.set(true);
    this.errorServidor.set(null);
    if (!this.valido()) return;
    this.enviando.set(true);
    try {
      const r = await firstValueFrom(
        this.http.post<RespuestaAuth>(`${environment.apiUrl}/auth/registro`, {
          email: this.correo().trim(),
          password: this.pass(),
          nombre: this.nombre().trim(),
          roles: this.roles(),
          generos: this.generos(),
          remunerados: this.tipo().includes('remunerados'),
          colaboraciones: this.tipo().includes('colaboraciones'),
          zona: this.zona(),
          lugar: this.lugar(),
          disponibilidad: this.disponibilidad(),
          aceptaTerminos: true,
        }),
      );
      await this.sesion.guardar(r);
      await this.subirFoto();
      void this.nav.navigateRoot(['/bienvenida'], { queryParams: { nombre: this.nombre().trim() } });
    } catch (e) {
      if (e instanceof HttpErrorResponse && e.status === 409) {
        this.correoOcupado.set(true);
      } else {
        this.errorServidor.set('No se ha podido crear la cuenta. Revisa tu conexión e inténtalo de nuevo.');
      }
    } finally {
      this.enviando.set(false);
    }
  }

  /** La foto es opcional: si falla la subida, la cuenta ya está creada y se puede añadir luego. */
  private async subirFoto() {
    const f = this.foto();
    if (!f) return;
    const datos = new FormData();
    datos.append('archivo', f);
    try {
      await firstValueFrom(this.http.post(`${environment.apiUrl}/me/avatar`, datos));
    } catch {
      // se ignora: Mi perfil permite cambiarla
    }
  }

  protected iniciarConEsteCorreo(): void {
    void this.nav.navigateForward('/iniciar-sesion');
  }
}
