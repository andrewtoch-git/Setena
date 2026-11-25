# setena

App móvil (Android primero) para que músicos del área de Barcelona encuentren y validen a otros músicos (vídeo, géneros, tarifas) antes de contactar por chat. Proyecto académico de UX/UI.

## Fuentes de verdad (leer antes de cada fase)
- **Producto:** `docs/producto.md`. Si algo no está ahí, **PREGUNTAR** antes de implementarlo. No inventar pantallas, campos ni textos.
- **Diseño (pantallas):** `design/handoff/*.dc.html` (wireframe de fidelidad media, 25/11). Índice y notas del equipo en `design/handoff/canvas.json`. Las hojas `Componentes` y `Guia-visual` y las `Ref-*` son material de referencia, no pantallas de la app.
- **Diseño (sistema):** `design/design-system/` (README, 01–07 y `components/*/README.md`). Pendientes y conflictos en `07-Pendientes.md`.
- **Tokens de color:** `design/handoff/ds/appmusic/tokens.css` y `tokens.json`. ⚠️ No usar `design/design-system/tokens.css`: está desfasado (paleta gris antigua).
- **Datos:** `docs/datos-mock.md` y `mock-data/`.
- **Chat en tiempo real:** `docs/evaluacion-websocket.md`.

## Stack
- `backend/`: NestJS + Mongoose + MongoDB Atlas. Archivos en GridFS. socket.io para el chat. Despliegue en Render.
- `mobile/`: Ionic + **Angular** (componentes standalone) + Capacitor, modo `md`. Android primero.
- Login: correo + contraseña y Google (verificación del ID token en el backend). JWT de acceso corto + refresh token rotativo.

## Reglas
- Textos de la interfaz en español, tal cual aparecen en el wireframe, con la nomenclatura de `docs/producto.md` («Favoritos», roles por instrumento).
- **Solo modo oscuro.** Colores siempre por token/rol, nunca hex sueltos. Lima solo para el botón principal y los indicadores de activo.
- Secretos solo en variables de entorno; nunca commitear `.env`. Mantener `.env.example` al día.
- Antes de cada fase: proponer un plan y esperar aprobación.
- Cada fase termina con tests que pasan y un commit.
- Datos de prueba solo mediante el script de seed, a partir de `mock-data/`, marcados como ficticios.
- Distinguir en los mensajes lo que es decisión del equipo de lo que es propuesta propia.

- **Vídeos aplazados:** no implementar subida ni reproducción de vídeo hasta que se pida. Límite futuro: 30 s. El registro no exige vídeo por ahora.
- Conflictos de diseño: **manda el wireframe** (`design/handoff/`).

- **Decisiones delegadas (25/11):** el equipo permite a Claude decidir para avanzar. Registrar cada decisión, con su motivo, en `docs/producto.md` («Decisiones delegadas»).

## Estado
- Fase 1 (backend REST + auth) y 1b (chat en tiempo real, socket.io `/chat`) hechas y con tests. Contrato del socket en `docs/evaluacion-websocket.md`.
- Fase 2 hecha: `npm run seed` (desde `mock-data/`) y fotos en GridFS (`/media/:id`, `/me/avatar`, `/me/fotos`).
- Siguiente: fase 3 (despliegue: MongoDB Atlas + Render) y fase 4 (app Ionic + Angular).
