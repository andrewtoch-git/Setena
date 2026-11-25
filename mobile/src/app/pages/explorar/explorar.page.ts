import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonModal,
  IonRefresher,
  IonRefresherContent,
} from '@ionic/angular';

import { ApiService } from '../../core/api.service';
import { plural } from '../../core/formato';
import type { Catalogos, FiltrosBusqueda, Tarjeta } from '../../core/modelos';
import { SesionService } from '../../core/sesion.service';
import { IconoComponent } from '../../ui/icono.component';
import { InvitacionRegistroComponent } from '../../ui/invitacion-registro.component';
import { LogoComponent } from '../../ui/logo.component';
import { TarjetaMusicoComponent } from '../../ui/tarjeta-musico.component';

type ClaveFiltro = 'roles' | 'generos' | 'zonas' | 'disponibilidad' | 'tipos';
type Filtros = Record<ClaveFiltro, string[]>;

const VACIOS = (): Filtros => ({ roles: [], generos: [], zonas: [], disponibilidad: [], tipos: [] });
const TIPOS: Record<string, string> = {
  remunerados: 'Proyectos remunerados',
  colaboraciones: 'Colaboraciones gratuitas',
};
const POR_PAGINA = 20;

@Component({
  selector: 'app-explorar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    IonHeader,
    IonContent,
    IonModal,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonRefresher,
    IonRefresherContent,
    IconoComponent,
    LogoComponent,
    TarjetaMusicoComponent,
    InvitacionRegistroComponent,
  ],
  templateUrl: './explorar.page.html',
  styleUrl: './explorar.page.scss',
})
export class ExplorarPage {
  private readonly api = inject(ApiService);
  private readonly router = inject(Router);
  protected readonly sesion = inject(SesionService);

  protected readonly catalogos = signal<Catalogos | null>(null);
  protected readonly texto = signal('');
  protected readonly filtros = signal<Filtros>(VACIOS());
  protected readonly resultados = signal<Tarjeta[]>([]);
  protected readonly total = signal(0);
  protected readonly estado = signal<'cargando' | 'listo' | 'error'>('cargando');
  private pagina = 1;
  private peticion = 0;
  private espera?: ReturnType<typeof setTimeout>;

  // Ventana de registro (Chat sin sesión)
  protected readonly invitar = signal(false);

  // Panel de filtros: se edita un borrador y se aplica con «Mostrar N músicos»
  protected readonly panelAbierto = signal(false);
  protected readonly borrador = signal<Filtros>(VACIOS());
  protected readonly totalBorrador = signal<number | null>(null);

  protected readonly chipsRapidos = computed(() => this.catalogos()?.chipsRapidos ?? []);
  protected readonly aplicados = computed(() => {
    const f = this.filtros();
    return (Object.keys(f) as ClaveFiltro[]).flatMap((clave) =>
      f[clave].map((valor) => ({ clave, valor, texto: clave === 'tipos' ? TIPOS[valor] : valor })),
    );
  });
  protected readonly nAplicados = computed(() => this.aplicados().length);
  protected readonly cuenta = computed(() => plural(this.total(), 'músico', 'músicos'));
  protected readonly hayMas = computed(() => this.resultados().length < this.total());
  protected readonly secciones = computed(() => {
    const c = this.catalogos();
    if (!c) return [];
    return [
      { clave: 'roles' as const, titulo: 'Instrumento o rol', items: c.roles.map((v) => ({ valor: v, texto: v })) },
      { clave: 'generos' as const, titulo: 'Estilo musical', items: c.generos.map((v) => ({ valor: v, texto: v })) },
      { clave: 'zonas' as const, titulo: 'Ubicación', items: c.zonas.map((v) => ({ valor: v, texto: v })) },
      {
        clave: 'disponibilidad' as const,
        titulo: 'Disponibilidad',
        items: c.disponibilidad.map((v) => ({ valor: v, texto: v })),
      },
      {
        clave: 'tipos' as const,
        titulo: 'Tipo de proyecto',
        items: Object.entries(TIPOS).map(([valor, texto]) => ({ valor, texto })),
      },
    ];
  });
  protected readonly textoAplicar = computed(() => {
    const n = this.totalBorrador();
    if (n === null) return 'Mostrar músicos';
    return n === 0 ? 'Aplicar filtros (sin resultados)' : `Mostrar ${plural(n, 'músico', 'músicos')}`;
  });

  constructor() {
    void this.api.catalogos().then(
      (c) => this.catalogos.set(c),
      () => undefined,
    );
    void this.cargar();
  }

  private consulta(f: Filtros = this.filtros()): FiltrosBusqueda {
    return { q: this.texto(), ...f };
  }

  /** Carga la primera página (o la siguiente con mas = true). Ignora respuestas que llegan tarde. */
  async cargar(mas = false): Promise<void> {
    const id = ++this.peticion;
    if (!mas) {
      this.pagina = 1;
      this.estado.set('cargando');
    }
    try {
      const r = await this.api.buscar(this.consulta(), this.pagina, POR_PAGINA);
      if (id !== this.peticion) return;
      this.total.set(r.total);
      this.resultados.set(mas ? [...this.resultados(), ...r.resultados] : r.resultados);
      this.estado.set('listo');
    } catch {
      if (id === this.peticion && !mas) this.estado.set('error');
    }
  }

  protected async masResultados(ev: Event): Promise<void> {
    this.pagina += 1;
    await this.cargar(true);
    await (ev.target as HTMLIonInfiniteScrollElement).complete();
  }

  protected async refrescar(ev: Event): Promise<void> {
    await this.cargar();
    await (ev.target as HTMLIonRefresherElement).complete();
  }

  protected escribir(valor: string): void {
    this.texto.set(valor);
    clearTimeout(this.espera);
    this.espera = setTimeout(() => void this.cargar(), 300);
  }

  /** Chips rápidos: selección única de instrumento. */
  protected chipRapido(rol: string): void {
    const roles = this.filtros().roles;
    const activo = roles.length === 1 && roles[0] === rol;
    this.filtros.update((f) => ({ ...f, roles: activo ? [] : [rol] }));
    void this.cargar();
  }

  protected chipRapidoActivo(rol: string): boolean {
    const roles = this.filtros().roles;
    return roles.length === 1 && roles[0] === rol;
  }

  protected quitar(clave: ClaveFiltro, valor: string): void {
    this.filtros.update((f) => ({ ...f, [clave]: f[clave].filter((v) => v !== valor) }));
    void this.cargar();
  }

  protected borrarTodo(): void {
    this.filtros.set(VACIOS());
    this.texto.set('');
    void this.cargar();
  }

  // ---------- panel de filtros ----------
  protected abrirPanel(): void {
    this.borrador.set(structuredClone(this.filtros()));
    this.panelAbierto.set(true);
    void this.contarBorrador();
  }

  protected alternar(clave: ClaveFiltro, valor: string): void {
    this.borrador.update((f) => ({
      ...f,
      [clave]: f[clave].includes(valor) ? f[clave].filter((v) => v !== valor) : [...f[clave], valor],
    }));
    void this.contarBorrador();
  }

  protected activoEnBorrador(clave: ClaveFiltro, valor: string): boolean {
    return this.borrador()[clave].includes(valor);
  }

  protected borrarBorrador(): void {
    this.borrador.set(VACIOS());
    void this.contarBorrador();
  }

  private async contarBorrador() {
    this.totalBorrador.set(null);
    try {
      const r = await this.api.buscar(this.consulta(this.borrador()), 1, 1);
      this.totalBorrador.set(r.total);
    } catch {
      this.totalBorrador.set(null);
    }
  }

  protected aplicarPanel(): void {
    this.filtros.set(this.borrador());
    this.panelAbierto.set(false);
    void this.cargar();
  }

  // ---------- acciones de la tarjeta ----------
  protected async chat(t: Tarjeta): Promise<void> {
    if (!this.sesion.iniciada()) {
      this.invitar.set(true);
      return;
    }
    try {
      const c = await this.api.abrirChat(t.id);
      void this.router.navigate(['/chat', c.id]);
    } catch {
      // Si no se puede abrir (bloqueo), se muestra el perfil, que explica el motivo.
      void this.router.navigate(['/perfil', t.id]);
    }
  }
}
