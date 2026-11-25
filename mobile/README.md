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

## Estado (iteración 1, 25/11)
Hecho: Explorar con búsqueda libre, chips rápidos, panel de Filtros, paginación y estados de carga, error y vacío · ficha de músico (carrusel, Info/Tarifas, Favorito, Chat) · iniciar sesión · registro con validación del wireframe · Bienvenida · Favoritos con «Deshacer» · lista de Chats · conversación en tiempo real con «Enviado / No se ha enviado / Reintentar» · invitación a registrarse sin sesión · insignia de no leídos.

Pendiente: Editar perfil, subir fotos desde Mi perfil, Ajustes (contraseña, notificaciones, eliminar cuenta), Compartir, Más opciones (denunciar, bloquear), animación de Inicio, login con Google, proyecto Android (`npx cap add android`, requiere Android Studio).
