# setena — backend

API del prototipo setena: NestJS 11 + Mongoose 8 + MongoDB Atlas.

## Puesta en marcha
```bash
cd backend
npm install
cp .env.example .env      # rellena MONGODB_URI y los dos secretos JWT
npm run start:dev         # http://localhost:3000 · documentación en /docs
```

## Tests
```bash
npm test            # unitarios (catálogos y búsqueda libre)
npm run test:e2e    # extremo a extremo contra un MongoDB en memoria (la primera vez descarga el binario)
npm run lint
```

## Endpoints
| Área | Rutas | Acceso |
|---|---|---|
| General | `GET /health`, `GET /catalogos` | Público |
| Auth | `POST /auth/registro`, `/auth/login`, `/auth/google`, `/auth/refresh`, `/auth/logout` | Público (con límite de peticiones) |
| Perfiles | `GET /perfiles` (búsqueda libre `q` + filtros + paginación), `GET /perfiles/:id` | Público |
| Mi cuenta | `GET /me`, `PATCH /me/ajustes`, `PATCH /me/password`, `DELETE /me`, `POST /me/perfil`, `PATCH /me/perfil` | Con sesión |
| Favoritos | `GET /favoritos`, `POST /favoritos/:perfilId`, `DELETE /favoritos/:perfilId` | Con sesión |
| Chats | `GET /conversaciones`, `GET /conversaciones/no-leidos`, `POST /conversaciones`, `GET/POST /conversaciones/:id/mensajes`, `POST /conversaciones/:id/leido` | Con sesión |
| Moderación | `POST/DELETE /bloqueos/:perfilId`, `POST /denuncias` | Con sesión |

## Decisiones técnicas
- **Sesión:** JWT de acceso (15 min) + refresh token rotativo por sesión. Reutilizar un refresh token antiguo cierra esa sesión.
- **Contraseñas:** argon2id (`@node-rs/argon2`).
- **Google:** el backend verifica el ID token (`GOOGLE_CLIENT_IDS`). Si el correo ya existe y Google lo da por verificado, se vincula la cuenta.
- **Bloqueos:** en ambos sentidos se oculta el perfil en Explorar, Favoritos y Chats, y no se puede escribir.
- **Vídeos:** aplazados (ver `docs/producto.md`). El registro no exige vídeo.

## Propuestas pendientes de validar por el equipo
- Sinónimos de rol en la búsqueda libre («pianista» → Piano, «guitarrista» → Guitarra…): `src/profiles/busqueda.ts`.
- Al bloquear a alguien, se quita de tus Favoritos (y no vuelve al desbloquear).
