# setena — app móvil

Ionic 9 + Angular 22 (componentes standalone, signals, sin zone.js) + Capacitor 8. Solo modo oscuro.

## Puesta en marcha
```bash
cd mobile
npm install
npm start            # http://localhost:8100 (el puerto está permitido en el CORS de la API)
```
Por defecto usa la API publicada (`src/environments/environment.ts` → `https://setena-api.onrender.com`). Para usar el backend local, cambia `apiUrl` a `http://localhost:3000`.

Usuario demo: `alex.martin@example.com`, con la contraseña de `SEED_DEMO_PASSWORD` en `backend/.env`.

## Comprobaciones
```bash
npm run test:unit    # Vitest: formato y renovación del token
npm run eslint       # lint estricto de Ionic
npx ng build         # compilación de producción
npm run test:e2e     # Playwright (pruebas de humo; la primera vez: npx playwright install chromium)
```

## Estructura
| Carpeta | Contenido |
|---|---|
| `src/theme/tokens.css` | Copia de `design/handoff/ds/appmusic/tokens.css` (fuente de verdad del color). `variables.scss` la traduce a variables de Ionic |
| `src/global.scss` | Piezas comunes del design system: botones, chips, etiquetas, estados vacíos |
| `src/app/core/` | API, sesión (Capacitor Preferences), interceptor con renovación del token, chat en tiempo real (socket.io) |
| `src/app/ui/` | Iconos del wireframe, logotipo, tarjeta de músico, ventana de registro |
| `src/app/pages/` | Explorar (+ Filtros), Perfil, Iniciar sesión, Registro, Bienvenida, Favoritos, Chats, Chat, Mi perfil |

## Estado (fase 4 completa salvo el APK, 25/11)
| Pantalla | Wireframe |
|---|---|
| Inicio con animación de 1 s (una vez por sesión; respeta «reducir movimiento») | Inicio |
| Explorar: búsqueda libre, chips rápidos, Filtros, paginación, estados | Explorar*, Filtros |
| Perfil: carrusel, Favorito, Info/Tarifas, Chat, Compartir, Más opciones (denunciar, bloquear, desbloquear) | Perfil-musico* |
| Iniciar sesión, Registro, Bienvenida | Iniciar-sesion*, Registro*, Bienvenida |
| Favoritos con «Deshacer» | Favoritos* |
| Chats y conversación en tiempo real; «Perfil compartido»; bloqueo | Chats*, Chat-* |
| Mi perfil: carrusel editable (subir, eliminar, principal), Compartir, Editar perfil | Mi-perfil* |
| Editar perfil: «Cambios guardados», error con «Reintentar», «¿Salir sin guardar?» | Mi-perfil-editar* |
| Ajustes: notificaciones, cambiar contraseña, cerrar sesión, eliminar cuenta | Ajustes* |

Compartir fuera de la app usa el enlace público `https://setena-api.onrender.com/p/<id>`; su botón abre la app con `setena://perfil/<id>` (hay que registrar el esquema al crear el proyecto Android).

Pendiente: proyecto Android y APK (`npx cap add android`, requiere Android Studio); login con Google (falta el ID de cliente OAuth); subida de vídeos (aplazada).
