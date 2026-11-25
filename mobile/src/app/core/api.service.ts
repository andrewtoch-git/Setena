import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom, shareReplay } from 'rxjs';

import { environment } from '../../environments/environment';

import type {
  Ajustes,
  Busqueda,
  CambiosPerfil,
  Catalogos,
  Ficha,
  FiltrosBusqueda,
  ResumenChat,
  Tarjeta,
  Yo,
} from './modelos';

/** Acceso a la API de setena. Las rutas y respuestas están documentadas en /docs. */
@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly base = environment.apiUrl;
  private readonly catalogos$ = this.http.get<Catalogos>(`${this.base}/catalogos`).pipe(shareReplay(1));

  /** URL pública de una foto guardada en GridFS. */
  media(id: string | null | undefined): string | null {
    return id ? `${this.base}/media/${id}` : null;
  }

  catalogos(): Promise<Catalogos> {
    return firstValueFrom(this.catalogos$);
  }

  buscar(f: FiltrosBusqueda, pagina = 1, porPagina = 20): Promise<Busqueda> {
    let params = new HttpParams().set('pagina', pagina).set('porPagina', porPagina);
    if (f.q?.trim()) params = params.set('q', f.q.trim());
    for (const clave of ['roles', 'generos', 'zonas', 'disponibilidad', 'tipos'] as const) {
      for (const v of f[clave] ?? []) params = params.append(clave, v);
    }
    return firstValueFrom(this.http.get<Busqueda>(`${this.base}/perfiles`, { params }));
  }

  perfil(id: string): Promise<Ficha> {
    return firstValueFrom(this.http.get<Ficha>(`${this.base}/perfiles/${id}`));
  }

  favoritos(): Promise<Tarjeta[]> {
    return firstValueFrom(this.http.get<Tarjeta[]>(`${this.base}/favoritos`));
  }

  anadirFavorito(perfilId: string): Promise<unknown> {
    return firstValueFrom(this.http.post(`${this.base}/favoritos/${perfilId}`, null));
  }

  quitarFavorito(perfilId: string): Promise<unknown> {
    return firstValueFrom(this.http.delete(`${this.base}/favoritos/${perfilId}`));
  }

  chats(): Promise<ResumenChat[]> {
    return firstValueFrom(this.http.get<ResumenChat[]>(`${this.base}/conversaciones`));
  }

  noLeidos(): Promise<{ total: number }> {
    return firstValueFrom(this.http.get<{ total: number }>(`${this.base}/conversaciones/no-leidos`));
  }

  abrirChat(perfilId: string): Promise<ResumenChat> {
    return firstValueFrom(this.http.post<ResumenChat>(`${this.base}/conversaciones`, { perfilId }));
  }

  yo(): Promise<Yo> {
    return firstValueFrom(this.http.get<Yo>(`${this.base}/me`));
  }

  // ---------- mi perfil ----------
  actualizarPerfil(cambios: CambiosPerfil): Promise<Ficha> {
    return firstValueFrom(this.http.patch<Ficha>(`${this.base}/me/perfil`, cambios));
  }

  subirAvatar(archivo: File): Promise<Ficha> {
    return firstValueFrom(this.http.post<Ficha>(`${this.base}/me/avatar`, this.formulario(archivo)));
  }

  subirFoto(archivo: File, titulo: string): Promise<Ficha> {
    return firstValueFrom(this.http.post<Ficha>(`${this.base}/me/fotos`, this.formulario(archivo, titulo)));
  }

  eliminarMedia(indice: number): Promise<Ficha> {
    return firstValueFrom(this.http.delete<Ficha>(`${this.base}/me/media/${indice}`));
  }

  marcarPrincipal(indice: number): Promise<Ficha> {
    return firstValueFrom(this.http.post<Ficha>(`${this.base}/me/media/${indice}/principal`, null));
  }

  private formulario(archivo: File, titulo?: string): FormData {
    const f = new FormData();
    f.append('archivo', archivo);
    if (titulo) f.append('titulo', titulo);
    return f;
  }

  // ---------- cuenta ----------
  guardarAjustes(ajustes: Partial<Ajustes>): Promise<Ajustes> {
    return firstValueFrom(this.http.patch<Ajustes>(`${this.base}/me/ajustes`, ajustes));
  }

  cambiarPassword(actual: string, nueva: string): Promise<unknown> {
    return firstValueFrom(this.http.patch(`${this.base}/me/password`, { actual, nueva }));
  }

  eliminarCuenta(): Promise<unknown> {
    return firstValueFrom(this.http.delete(`${this.base}/me`));
  }

  // ---------- moderación y compartir ----------
  bloquear(perfilId: string): Promise<unknown> {
    return firstValueFrom(this.http.post(`${this.base}/bloqueos/${perfilId}`, null));
  }

  desbloquear(perfilId: string): Promise<unknown> {
    return firstValueFrom(this.http.delete(`${this.base}/bloqueos/${perfilId}`));
  }

  denunciar(perfilId: string, motivo: string): Promise<unknown> {
    return firstValueFrom(this.http.post(`${this.base}/denuncias`, { perfilId, motivo }));
  }

  compartirEnChat(conversacionId: string, perfilId: string): Promise<unknown> {
    return firstValueFrom(this.http.post(`${this.base}/conversaciones/${conversacionId}/compartir`, { perfilId }));
  }

  /** Enlace público para compartir fuera de la app (página /p/:id del backend). */
  enlacePerfil(perfilId: string): string {
    return `${this.base}/p/${perfilId}`;
  }
}
