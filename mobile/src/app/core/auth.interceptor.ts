import type { HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, from, switchMap, throwError } from 'rxjs';

import { environment } from '../../environments/environment';

import { SesionService } from './sesion.service';

const conToken = (req: HttpRequest<unknown>, token: string | null) =>
  token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;

/**
 * Añade el token a las peticiones a la API. Si responde 401 y hay sesión, renueva el token
 * una vez y repite la petición. Si no se puede renovar, la sesión se cierra (la app vuelve
 * al estado sin registro).
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.url.startsWith(environment.apiUrl)) return next(req);
  const sesion = inject(SesionService);

  return next(conToken(req, sesion.accessToken)).pipe(
    catchError((err: unknown) => {
      if (!(err instanceof HttpErrorResponse) || err.status !== 401 || !sesion.iniciada()) {
        return throwError(() => err);
      }
      return from(sesion.refrescar()).pipe(
        switchMap((nuevo) => (nuevo ? next(conToken(req, nuevo)) : throwError(() => err))),
      );
    }),
  );
};
