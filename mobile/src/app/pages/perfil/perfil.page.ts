import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, effect, inject, input, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { IonContent, IonFooter, IonHeader, IonModal, IonToast, NavController } from '@ionic/angular';

import { ApiService } from '../../core/api.service';
import { haceCuanto, ubicacion } from '../../core/formato';
import type { Ficha } from '../../core/modelos';
import { SesionService } from '../../core/sesion.service';
import { CarruselComponent } from '../../ui/carrusel.component';
import { CompartirPerfilComponent } from '../../ui/compartir-perfil.component';
import { FichaDetalleComponent } from '../../ui/ficha-detalle.component';
import { IconoComponent } from '../../ui/icono.component';
import { InvitacionRegistroComponent } from '../../ui/invitacion-registro.component';
import { OpcionesPerfilComponent } from '../../ui/opciones-perfil.component';

/** Perfil de músico (wireframe: Perfil-musico y variantes). */
@Component({
  selector: 'app-perfil',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    IonHeader,
    IonContent,
    IonFooter,
    IonModal,
    IonToast,
    RouterLink,
    IconoComponent,
    InvitacionRegistroComponent,
    CarruselComponent,
    FichaDetalleComponent,
    CompartirPerfilComponent,
    OpcionesPerfilComponent,
  ],
  templateUrl: './perfil.page.html',
  styleUrl: './perfil.page.scss',
})
export class PerfilPage {
  private readonly api = inject(ApiService);
  private readonly router = inject(Router);
  private readonly nav = inject(NavController);
  protected readonly sesion = inject(SesionService);

  /** :id de la ruta (withComponentInputBinding). */
  readonly id = input.required<string>();

  protected readonly ficha = signal<Ficha | null>(null);
  protected readonly estado = signal<'cargando' | 'listo' | 'no-disponible' | 'error'>('cargando');
  protected readonly invitar = signal(false);
  protected readonly compartir = signal(false);
  protected readonly opciones = signal(false);
  protected readonly aviso = signal<string | null>(null);

  protected readonly avatar = computed(() => this.api.media(this.ficha()?.avatarId));
  protected readonly linea = computed(() => {
    const f = this.ficha();
    return f ? `${f.roles.join(', ')} · ${f.generos.join(', ')}` : '';
  });
  protected readonly ubic = computed(() => {
    const f = this.ficha();
    return f ? ubicacion(f.zona, f.lugar) : '';
  });
  protected readonly actividad = computed(() => haceCuanto(this.ficha()?.ultimaActividadAt));

  constructor() {
    effect(() => void this.cargar(this.id()));
  }

  private async cargar(id: string): Promise<void> {
    this.estado.set('cargando');
    try {
      this.ficha.set(await this.api.perfil(id));
      this.estado.set('listo');
    } catch (e) {
      this.estado.set(e instanceof HttpErrorResponse && e.status === 404 ? 'no-disponible' : 'error');
    }
  }

  protected reintentar(): void {
    void this.cargar(this.id());
  }

  protected volver(): void {
    this.nav.back();
  }

  protected abrirOpciones(): void {
    if (!this.sesion.iniciada()) this.invitar.set(true);
    else this.opciones.set(true);
  }

  protected bloqueoCambiado(bloqueado: boolean): void {
    const f = this.ficha();
    if (f) this.ficha.set({ ...f, bloqueadoPorMi: bloqueado, esFavorito: bloqueado ? false : f.esFavorito });
  }

  protected async desbloquear(): Promise<void> {
    const f = this.ficha();
    if (!f) return;
    try {
      await this.api.desbloquear(f.id);
      this.bloqueoCambiado(false);
    } catch {
      this.aviso.set('No se ha podido completar la acción. Revisa tu conexión e inténtalo de nuevo.');
    }
  }

  protected async alternarFavorito(): Promise<void> {
    const f = this.ficha();
    if (!f) return;
    if (!this.sesion.iniciada()) {
      this.invitar.set(true);
      return;
    }
    const nuevo = !f.esFavorito;
    this.ficha.set({ ...f, esFavorito: nuevo }); // optimista
    try {
      if (nuevo) await this.api.anadirFavorito(f.id);
      else await this.api.quitarFavorito(f.id);
      this.aviso.set(nuevo ? 'Añadido a Favoritos' : `Has quitado a ${f.nombre} de Favoritos`);
    } catch {
      this.ficha.set({ ...f, esFavorito: !nuevo });
    }
  }

  protected async chat(): Promise<void> {
    const f = this.ficha();
    if (!f) return;
    if (!this.sesion.iniciada()) {
      this.invitar.set(true);
      return;
    }
    try {
      const c = await this.api.abrirChat(f.id);
      void this.router.navigate(['/chat', c.id]);
    } catch {
      this.aviso.set('No puedes enviar mensajes a este usuario');
    }
  }
}
