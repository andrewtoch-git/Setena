import type { WritableSignal } from '@angular/core';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { IonContent, IonFooter, IonHeader, IonModal, NavController } from '@ionic/angular';

import { ApiService } from '../../core/api.service';
import type { Catalogos, CambiosPerfil, Ficha, Redes, TarifaEntrada } from '../../core/modelos';
import { DialogoComponent } from '../../ui/dialogo.component';
import { IconoComponent } from '../../ui/icono.component';
import { SelectorMultipleComponent } from '../../ui/selector-multiple.component';

type ClaveRed = keyof Redes;
const REDES: { clave: ClaveRed; nombre: string; letra: string }[] = [
  { clave: 'instagram', nombre: 'Instagram', letra: 'I' },
  { clave: 'youtube', nombre: 'YouTube', letra: 'Y' },
  { clave: 'spotify', nombre: 'Spotify', letra: 'S' },
  { clave: 'tiktok', nombre: 'TikTok', letra: 'T' },
  { clave: 'soundcloud', nombre: 'SoundCloud', letra: 'SC' },
];
const SERVICIOS = [
  { clave: 'bolo', nombre: 'Bolo / Directo', descripcion: 'Conciertos y eventos', unidad: 'por actuación' },
  { clave: 'grabacion', nombre: 'Grabación', descripcion: 'Instrumentos y voces', unidad: 'por hora' },
  { clave: 'composicion', nombre: 'Composición', descripcion: 'Canciones y melodías', unidad: 'por proyecto' },
] as const;

/** «150», «150 €» → 150; cualquier otro texto («A convenir») se guarda como texto. */
export function leerPrecio(valor: string): { precio: number | null; texto: string | null } | null {
  const v = valor.trim();
  if (!v) return null;
  const n = Number(v.replace(/€/g, '').replace(',', '.').trim());
  return Number.isFinite(n) && n >= 0 ? { precio: n, texto: null } : { precio: null, texto: v.slice(0, 120) };
}

/** Acepta «instagram.com/usuario» y le añade https:// para que el enlace funcione. */
export function normalizarUrl(valor: string): string | null {
  const v = valor.trim();
  if (!v) return null;
  return /^https?:\/\//i.test(v) ? v : `https://${v}`;
}

/** Editar perfil (wireframe: Mi-perfil-editar y variantes). El nombre no se puede cambiar. */
@Component({
  selector: 'app-editar-perfil',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IonHeader, IonContent, IonFooter, IonModal, IconoComponent, DialogoComponent, SelectorMultipleComponent],
  templateUrl: './editar-perfil.page.html',
  styleUrls: ['../formularios.scss', './editar-perfil.page.scss'],
})
export class EditarPerfilPage {
  private readonly api = inject(ApiService);
  private readonly nav = inject(NavController);

  protected readonly catalogos = signal<Catalogos | null>(null);
  protected readonly original = signal<Ficha | null>(null);
  protected readonly redesLista = REDES;
  protected readonly servicios = SERVICIOS;

  protected readonly roles = signal<string[]>([]);
  protected readonly generos = signal<string[]>([]);
  protected readonly remunerados = signal(false);
  protected readonly colaboraciones = signal(false);
  protected readonly zona = signal('Barcelona ciudad');
  protected readonly lugar = signal('');
  protected readonly disponibilidad = signal<string[]>([]);
  protected readonly sobreMi = signal('');
  protected readonly precios = signal<Record<string, string>>({});
  protected readonly otros = signal('');
  protected readonly redes = signal<Record<ClaveRed, string>>({
    instagram: '',
    youtube: '',
    spotify: '',
    tiktok: '',
    soundcloud: '',
  });
  protected readonly fotoNueva = signal<File | null>(null);

  protected readonly enviado = signal(false);
  protected readonly guardando = signal(false);
  protected readonly errorGuardar = signal(false);
  protected readonly guardado = signal(false);
  protected readonly salir = signal(false);
  protected readonly selector = signal<'roles' | 'generos' | null>(null);
  private sucio = false;

  protected readonly lugares = computed(() => this.catalogos()?.lugares[this.zona()] ?? []);
  protected readonly errores = computed(() => ({
    roles: this.roles().length ? null : 'Este campo es obligatorio',
    generos: this.generos().length ? null : 'Este campo es obligatorio',
    tipo: this.remunerados() || this.colaboraciones() ? null : 'Elige al menos un tipo de proyecto',
    ubic: this.lugar() ? null : 'Elige tu distrito o municipio',
    disp: this.disponibilidad().length ? null : 'Elige al menos una opción',
  }));
  protected readonly valido = computed(() => Object.values(this.errores()).every((e) => e === null));

  constructor() {
    void this.api.catalogos().then(
      (c) => this.catalogos.set(c),
      () => undefined,
    );
    void this.cargar();
  }

  private async cargar(): Promise<void> {
    const yo = await this.api.yo();
    const p = yo.perfil;
    if (!p) return;
    this.original.set(p);
    this.roles.set([...p.roles]);
    this.generos.set([...p.generos]);
    this.remunerados.set(p.remunerados);
    this.colaboraciones.set(p.colaboraciones);
    this.zona.set(p.zona);
    this.lugar.set(p.lugar);
    this.disponibilidad.set([...p.disponibilidad]);
    this.sobreMi.set(p.sobreMi ?? '');
    const precios: Record<string, string> = {};
    for (const t of p.tarifas) {
      if (t.servicio === 'otros') this.otros.set(t.texto ?? '');
      else precios[t.servicio] = t.precio !== null ? String(t.precio) : (t.texto ?? '');
    }
    this.precios.set(precios);
    this.redes.set({
      instagram: p.redes.instagram ?? '',
      youtube: p.redes.youtube ?? '',
      spotify: p.redes.spotify ?? '',
      tiktok: p.redes.tiktok ?? '',
      soundcloud: p.redes.soundcloud ?? '',
    });
  }

  protected err(campo: 'roles' | 'generos' | 'tipo' | 'ubic' | 'disp'): string | null {
    return this.enviado() ? this.errores()[campo] : null;
  }

  protected cambio(): void {
    this.sucio = true;
  }

  protected alternar(lista: WritableSignal<string[]>, valor: string): void {
    lista.update((l) => (l.includes(valor) ? l.filter((v) => v !== valor) : [...l, valor]));
    this.cambio();
  }

  protected elegirZona(z: string): void {
    if (z === this.zona()) return;
    this.zona.set(z);
    this.lugar.set('');
    this.cambio();
  }

  protected ponerPrecio(servicio: string, valor: string): void {
    this.precios.update((p) => ({ ...p, [servicio]: valor }));
    this.cambio();
  }

  protected ponerRed(clave: ClaveRed, valor: string): void {
    this.redes.update((r) => ({ ...r, [clave]: valor }));
    this.cambio();
  }

  protected elegirFoto(ev: Event): void {
    const f = (ev.target as HTMLInputElement).files?.[0] ?? null;
    if (f && ['image/jpeg', 'image/png'].includes(f.type) && f.size <= 10 * 1024 * 1024) {
      this.fotoNueva.set(f);
      this.cambio();
    }
  }

  protected guardarSelector(valores: string[]): void {
    if (this.selector() === 'roles') this.roles.set(valores);
    if (this.selector() === 'generos') this.generos.set(valores);
    this.selector.set(null);
    this.cambio();
  }

  protected opcionesSelector(): string[] {
    const c = this.catalogos();
    if (!c) return [];
    return this.selector() === 'roles' ? c.roles : c.generos;
  }

  private cambios(): CambiosPerfil {
    const tarifas: TarifaEntrada[] = [];
    for (const s of SERVICIOS) {
      const p = leerPrecio(this.precios()[s.clave] ?? '');
      if (p) tarifas.push({ servicio: s.clave, ...p });
    }
    if (this.otros().trim()) tarifas.push({ servicio: 'otros', texto: this.otros().trim().slice(0, 120) });
    const r = this.redes();
    return {
      roles: this.roles(),
      generos: this.generos(),
      remunerados: this.remunerados(),
      colaboraciones: this.colaboraciones(),
      zona: this.zona(),
      lugar: this.lugar(),
      disponibilidad: this.disponibilidad(),
      sobreMi: this.sobreMi().trim() || null,
      tarifas,
      redes: {
        instagram: normalizarUrl(r.instagram),
        youtube: normalizarUrl(r.youtube),
        spotify: normalizarUrl(r.spotify),
        tiktok: normalizarUrl(r.tiktok),
        soundcloud: normalizarUrl(r.soundcloud),
      },
    };
  }

  protected async guardar(): Promise<void> {
    this.enviado.set(true);
    this.errorGuardar.set(false);
    if (!this.valido()) return;
    this.guardando.set(true);
    try {
      await this.api.actualizarPerfil(this.cambios());
      const foto = this.fotoNueva();
      if (foto) {
        await this.api.subirAvatar(foto);
        this.fotoNueva.set(null);
      }
      this.sucio = false;
      this.guardado.set(true);
    } catch {
      this.errorGuardar.set(true);
    } finally {
      this.guardando.set(false);
    }
  }

  protected volver(): void {
    if (this.sucio) this.salir.set(true);
    else this.nav.back();
  }

  protected salirSinGuardar(): void {
    this.salir.set(false);
    this.sucio = false;
    this.nav.back();
  }

  protected verMiPerfil(): void {
    this.guardado.set(false);
    void this.nav.navigateBack('/tabs/mi-perfil');
  }
}
