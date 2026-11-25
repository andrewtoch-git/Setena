import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { ViewDidEnter } from '@ionic/angular';
import { IonContent, IonHeader, IonModal, IonToast } from '@ionic/angular';

import { ApiService } from '../../core/api.service';
import { ubicacion } from '../../core/formato';
import type { Ficha, Media } from '../../core/modelos';
import { SesionService } from '../../core/sesion.service';
import { CarruselComponent } from '../../ui/carrusel.component';
import { CompartirPerfilComponent } from '../../ui/compartir-perfil.component';
import { DialogoComponent } from '../../ui/dialogo.component';
import { FichaDetalleComponent } from '../../ui/ficha-detalle.component';
import { IconoComponent } from '../../ui/icono.component';
import { InvitacionRegistroComponent } from '../../ui/invitacion-registro.component';
import { LogoComponent } from '../../ui/logo.component';

const TIPOS_FOTO = ['image/jpeg', 'image/png'];
const MAX_FOTO = 10 * 1024 * 1024;
const ERROR_FOTO = 'No se ha podido subir la foto. Usa un archivo JPG o PNG de menos de 10 MB.';

/** Mi perfil (wireframe: Mi-perfil, Mi-perfil-anadir, Mi-perfil-subida-error, Mi-perfil-compartir). */
@Component({
  selector: 'app-mi-perfil',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    IonHeader,
    IonContent,
    IonModal,
    IonToast,
    RouterLink,
    IconoComponent,
    LogoComponent,
    InvitacionRegistroComponent,
    CarruselComponent,
    FichaDetalleComponent,
    CompartirPerfilComponent,
    DialogoComponent,
  ],
  templateUrl: './mi-perfil.page.html',
  styleUrl: './mi-perfil.page.scss',
})
export class MiPerfilPage implements ViewDidEnter {
  protected readonly api = inject(ApiService);
  protected readonly sesion = inject(SesionService);

  protected readonly perfil = signal<Ficha | null>(null);
  protected readonly compartir = signal(false);
  protected readonly anadir = signal(false);
  protected readonly confirmar = signal<{ indice: number; media: Media } | null>(null);
  protected readonly aviso = signal<{ texto: string; reintentar?: boolean } | null>(null);
  private ultimoArchivo: File | null = null;

  protected readonly avatar = computed(() => this.api.media(this.perfil()?.avatarId));
  protected readonly linea = computed(() => {
    const p = this.perfil();
    return p ? `${p.roles.join(', ')} · ${p.generos.join(', ')}` : '';
  });
  protected readonly ubic = computed(() => {
    const p = this.perfil();
    return p ? ubicacion(p.zona, p.lugar) : '';
  });

  constructor() {
    effect(() => {
      if (this.sesion.iniciada()) void this.cargar();
      else this.perfil.set(null);
    });
  }

  ionViewDidEnter(): void {
    if (this.sesion.iniciada()) void this.cargar();
  }

  private async cargar(): Promise<void> {
    try {
      this.perfil.set((await this.api.yo()).perfil);
    } catch {
      // sin conexión: se mantiene lo último cargado
    }
  }

  // ---------- fotos ----------
  protected async elegirFoto(ev: Event): Promise<void> {
    const input = ev.target as HTMLInputElement;
    const archivo = input.files?.[0];
    input.value = '';
    this.anadir.set(false);
    if (!archivo) return;
    if (!TIPOS_FOTO.includes(archivo.type) || archivo.size > MAX_FOTO) {
      this.aviso.set({ texto: ERROR_FOTO });
      return;
    }
    this.ultimoArchivo = archivo;
    await this.subir(archivo);
  }

  private async subir(archivo: File): Promise<void> {
    this.aviso.set({ texto: 'Subiendo foto…' });
    const n = (this.perfil()?.media.filter((m) => m.tipo === 'foto').length ?? 0) + 1;
    try {
      this.perfil.set(await this.api.subirFoto(archivo, `Foto nueva ${n}`));
      this.aviso.set({ texto: 'Foto subida.' });
    } catch {
      this.aviso.set({ texto: ERROR_FOTO, reintentar: true });
    }
  }

  protected async alCerrarAviso(ev: CustomEvent<{ role?: string }>): Promise<void> {
    this.aviso.set(null);
    if (ev.detail.role === 'reintentar' && this.ultimoArchivo) await this.subir(this.ultimoArchivo);
  }

  protected pedirEliminar(indice: number): void {
    const media = this.perfil()?.media[indice];
    if (media) this.confirmar.set({ indice, media });
  }

  protected async eliminar(): Promise<void> {
    const c = this.confirmar();
    this.confirmar.set(null);
    if (!c) return;
    try {
      this.perfil.set(await this.api.eliminarMedia(c.indice));
      this.aviso.set({ texto: c.media.tipo === 'video' ? 'Vídeo eliminado.' : 'Foto eliminada.' });
    } catch {
      this.aviso.set({ texto: 'No se ha podido completar la acción. Revisa tu conexión e inténtalo de nuevo.' });
    }
  }

  protected async marcarPrincipal(indice: number): Promise<void> {
    try {
      const p = await this.api.marcarPrincipal(indice);
      this.perfil.set(p);
      if (p.media[indice]?.tipo === 'video') this.aviso.set({ texto: 'Vídeo principal actualizado.' });
    } catch {
      this.aviso.set({ texto: 'No se ha podido completar la acción. Revisa tu conexión e inténtalo de nuevo.' });
    }
  }

  protected tituloConfirmar(): string {
    return this.confirmar()?.media.tipo === 'video' ? '¿Eliminar este vídeo?' : '¿Eliminar esta foto?';
  }
}
