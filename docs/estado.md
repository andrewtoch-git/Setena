# Estado del proyecto (25/11/2026)

Fases según `Guia_Chat_a_Claude_Code_App_Music.md` (sección 7). Cada «Comprobado» se ha verificado el 25/11 ejecutando tests o llamando a lo desplegado.

| Fase | Estado | Comprobado |
|---|---|---|
| 1 · Backend NestJS + auth | ✅ Hecha | 49 tests e2e y 6 unitarios en verde; build y lint limpios. Módulos auth, users, profiles, favorites, chats (+ media, moderación, compartir). Swagger en `/docs`, `/health`, CORS por entorno. Perfiles y búsqueda públicos; Favoritos sin sesión → 401 |
| 1b · Chat en tiempo real (WebSocket) | ✅ Hecha | socket.io `/chat`, tests con clientes reales. Contrato en `docs/evaluacion-websocket.md` |
| 2 · Datos mock | ✅ Hecha | `npm run seed` idempotente desde `mock-data/` (32 músicos ficticios + fotos en GridFS). Usuario demo `alex.martin@example.com`; su contraseña va en `SEED_DEMO_PASSWORD` (`.env.example`) |
| 3 · MongoDB Atlas + Render | ✅ Hecha | API https://setena-api.onrender.com (`/health` → db up). App web https://setena-app.onrender.com. Pasos en `docs/deploy.md` |
| 4 · Ionic + Capacitor | ✅ Hecha | Todas las pantallas del wireframe (ver `mobile/README.md`); 11 tests unitarios, lint y build de producción limpios. APK de depuración generada desde la terminal (JDK 21 + SDK de Android, sin Android Studio): `cat.setena.app`, Android 7.0+ (SDK 24), destino SDK 36, esquema `setena://perfil/<id>`. La API acepta su origen (`https://localhost`) |
| 5 · Evaluar Ionic vs. nativo | ⏳ Sin empezar | Criterios ya fijados en `docs/producto.md` (60 fps en Explorar, ficha < 300 ms, Atrás y teclado nativos, fidelidad al design system). Necesita la APK en un Android de gama media |

## Diferencias con la guía (decididas)
- **Solo modo oscuro** (la guía decía claro y oscuro): decisión del equipo recogida en `CLAUDE.md`.
- Tokens de `design/handoff/ds/appmusic/tokens.css` en lugar de `design/material-theme.json`: es la fuente de verdad vigente según `CLAUDE.md`.
- Vídeos aplazados: ni subida ni reproducción hasta que se pida (límite futuro 30 s). En la fase 5 no se podrá medir la fluidez del vídeo.

## Decisiones pendientes de la guía (sección 9): cómo quedaron
| Pregunta | Resultado |
|---|---|
| ¿Angular, React o Vue? | Angular (equipo) |
| ¿Chat en tiempo real? | Sí, WebSocket; factible y de bajo coste (`docs/evaluacion-websocket.md`) |
| ¿Dónde se guardan vídeo y fotos? | Fotos en MongoDB GridFS; vídeo aplazado |
| ¿Login con email o también Google/Apple? | Email + Google (equipo). Google funciona en el backend; falta el ID de cliente OAuth para activarlo en la app |
| Modelo de datos mock | Validado y cargado (`docs/datos-mock.md`) |
| Criterios Ionic vs. nativo | Fijados (`docs/producto.md`, decisiones delegadas) |
| Nombre de la marca | «setena»; `applicationId` `cat.setena.app` |

## Siguientes pasos
1. **Fase 5**: instalar la APK en un Android de gama media y medir los 4 criterios; si fallan el scroll o Atrás/teclado → plan B Kotlin + Compose (el backend no cambia).
2. Opcional: ID de cliente OAuth de Google (web y Android) para el botón de Google; vídeos cuando se pidan.

## Nota sobre los datos publicados
La API publicada tiene 33 perfiles: los 32 del seed más 1 creado desde la app (registro de prueba o de alguien del equipo).
