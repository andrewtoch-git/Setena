import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, effect, inject, input, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NavController, IonContent, IonFooter, IonHeader, IonModal, IonToast } from '@ionic/angular';

import { ApiService } from '../../core/api.service';
import { haceCuanto, precio, ubicacion } from '../../core/formato';
import type { Ficha } from '../../core/modelos';
import { SesionService } from '../../core/sesion.service';
import { IconoComponent } from '../../ui/icono.component';
import { InvitacionRegistroComponent } from '../../ui/invitacion-registro.component';

const REDES = [
  { clave: 'instagram', nombre: 'Instagram', letra: 'I' },
  { clave: 'youtube', nombre: 'YouTube', letra: 'Y' },
  { clave: 'spotify', nombre: 'Spotify', letra: 'S' },
  { clave: 'tiktok', nombre: 'TikTok', letra: 'T' },
  { clave: 'soundcloud', nombre: 'SoundCloud', letra: 'SC' },
] as const;

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
  protected readonly pestana = signal<'info' | 'tarifas'>('info');
  protected readonly diapositiva = signal(0);
  protected readonly invitar = signal(false);
  protected readonly aviso = signal<string | null>(null);

  protected readonly media = computed(() =>
    (this.ficha()?.media ?? []).map((m) => ({ ...m, img: this.api.media(m.miniaturaId ?? m.archivoId) })),
  );
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
  protected readonly redes = computed(() => {
    const r = this.ficha()?.redes;
    return r ? REDES.filter((x) => r[x.clave]).map((x) => ({ ...x, url: r[x.clave] as string })) : [];
  });
  protected readonly precio = precio;

  constructor() {
    effect(() => void this.cargar(this.id()));
  }

  private async cargar(id: string) {
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

  protected alDeslizar(ev: Event): void {
    const el = ev.target as HTMLElement;
    this.diapositiva.set(Math.round(el.scrollLeft / el.clientWidth));
  }

  protected irA(carrusel: HTMLElement, i: number): void {
    carrusel.scrollTo({ left: i * carrusel.clientWidth, behavior: 'smooth' });
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
