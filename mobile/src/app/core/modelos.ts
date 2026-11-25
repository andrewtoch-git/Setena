// Tipos de la API (backend/README.md). Fechas como string ISO.

export interface MediaPrincipal {
  tipo: 'video' | 'foto';
  titulo: string;
  miniaturaId: string | null;
}

export interface Tarjeta {
  id: string;
  nombre: string;
  roles: string[];
  generos: string[];
  zona: string;
  lugar: string;
  disponibilidad: string[];
  remunerados: boolean;
  colaboraciones: boolean;
  ultimaActividadAt: string;
  avatarId: string | null;
  principal: MediaPrincipal | null;
  esFavorito: boolean;
}

export interface Tarifa {
  servicio: string;
  nombre: string;
  descripcion: string;
  unidad: string | null;
  precio: number | null;
  texto: string | null;
}

export interface Media {
  tipo: 'video' | 'foto';
  titulo: string;
  archivoId: string | null;
  miniaturaId: string | null;
  principal: boolean;
}

export type Redes = Record<'instagram' | 'youtube' | 'spotify' | 'tiktok' | 'soundcloud', string | null>;

export interface Ficha extends Omit<Tarjeta, 'principal'> {
  userId: string;
  sobreMi: string | null;
  tarifas: Tarifa[];
  redes: Redes;
  media: Media[];
  esPropio: boolean;
  bloqueadoPorMi: boolean;
}

export interface Busqueda {
  total: number;
  pagina: number;
  porPagina: number;
  resultados: Tarjeta[];
}

export interface FiltrosBusqueda {
  q?: string;
  roles?: string[];
  generos?: string[];
  zonas?: string[];
  disponibilidad?: string[];
  tipos?: string[];
}

export interface Catalogos {
  roles: string[];
  generos: string[];
  disponibilidad: string[];
  zonas: string[];
  lugares: Record<string, string[]>;
  chipsRapidos: string[];
  motivosDenuncia: string[];
}

export interface RespuestaAuth {
  accessToken: string;
  refreshToken: string;
  expiraEn: number;
  usuario: { id: string; email: string; proveedores: string[] };
  perfilCompleto: boolean;
}

export interface ResumenChat {
  id: string;
  con: { perfilId: string; nombre: string; avatarId: string | null; roles: string[] } | null;
  ultimoMensaje: string | null;
  ultimoMensajeAt: string | null;
  noLeidos: number;
}

export interface Ajustes {
  notifMensajes: boolean;
  notifNovedades: boolean;
}

export interface Yo {
  id: string;
  email: string;
  proveedores: string[];
  tienePassword: boolean;
  ajustes: Ajustes;
  perfil: Ficha | null;
}

export interface TarifaEntrada {
  servicio: string;
  precio?: number | null;
  texto?: string | null;
}

export interface CambiosPerfil {
  roles?: string[];
  generos?: string[];
  remunerados?: boolean;
  colaboraciones?: boolean;
  zona?: string;
  lugar?: string;
  disponibilidad?: string[];
  sobreMi?: string | null;
  tarifas?: TarifaEntrada[];
  redes?: Partial<Redes>;
}

export interface PerfilCompartido {
  id: string;
  nombre: string;
  roles: string[];
  generos: string[];
  zona: string;
  lugar: string;
  avatarId: string | null;
}
