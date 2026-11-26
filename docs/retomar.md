# Retomar la sesión en otro ordenador (26/11/2026)

> Para Claude Code al volver: lee este archivo, `CLAUDE.md` y `docs/estado.md`. Sigue desde «Pasos para Claude al volver». No hace falta volver a planificar lo que ya está hecho.

## Dónde estamos
| | Estado |
|---|---|
| Fases 1–4 (backend, chat, seed, Render, app Ionic) | ✅ Hechas y comprobadas (`docs/estado.md`) |
| Web publicada | https://setena-app.onrender.com · API https://setena-api.onrender.com |
| APK Android (depuración) | ✅ Generada el 25/11 (solo estaba en el escritorio del Mac anterior; se puede regenerar, ver `mobile/README.md`) |
| iOS | ⏸️ **Aparcado por decisión del equipo (26/11).** El proyecto `mobile/ios` existe, pero falta Xcode. Pasos en `mobile/README.md`, sección iOS |
| Móvil del equipo | iPhone: la app se prueba con el **enlace web** en Safari («Añadir a pantalla de inicio») |
| Fase 5 (Ionic vs. nativo) | ⏳ Sin empezar; criterios en `docs/producto.md` |

Todo está en GitHub (`main`).

## En qué estábamos
La persona del equipo quiere **seguir iterando la app** (fase 4, mejoras de pantallas). La forma de trabajo acordada el 26/11:
1. Ver los cambios en local en el navegador: `http://localhost:8100` (modo dispositivo con ⌥⌘I y ⇧⌘M).
2. Para verlos en el iPhone, hacer commit + push a `main`. Render redespliega la web solo en unos minutos y se ve en https://setena-app.onrender.com.

Aún no se había pedido ningún cambio concreto para esta iteración.

## Lo que hace la persona del equipo en el ordenador nuevo
1. Instalar **Node 22 o superior** (en el Mac anterior: v26) y **git**.
2. Clonar el repositorio y abrir Claude Code en la carpeta:
   ```bash
   git clone https://github.com/andrewtoch-git/Setena.git setena
   cd setena
   ```
3. (Solo si hace falta el backend local o el seed) Crear `backend/.env` a partir de `backend/.env.example`. Los valores (`MONGODB_URI`, `SEED_DEMO_PASSWORD`, …) **no están en git**: copiarlos del `backend/.env` del ordenador anterior o del panel de Render. Para ver la app **no hace falta**, porque usa la API publicada.
4. Decir a Claude Code: **«lee docs/retomar.md y sigue»**.

## Pasos para Claude al volver
1. Instalar dependencias y arrancar la app:
   ```bash
   cd mobile && npm install && npm start      # http://localhost:8100
   ```
   (Lanzar `npm start` en segundo plano y abrir el navegador con la URL.)
2. Comprobar que la API responde: `curl -s -o /dev/null -w "%{http_code}\n" https://setena-api.onrender.com/`. Si Render está dormido, la primera petición tarda unos 40 s. Un 404 en `/` es normal.
3. Preguntar qué cambios quiere en esta iteración y, si son nuevos, proponer un plan antes de implementar (regla de `CLAUDE.md`).
4. Al terminar cada cambio, ejecutar las comprobaciones de `mobile/README.md` (`npm run test:unit`, `npm run eslint`, `npx ng build`), hacer commit + push y avisar de que en unos minutos se verá en el iPhone.

## A tener en cuenta
- **CORS:** la API solo acepta `https://setena-app.onrender.com`, `http://localhost:8100`, `https://localhost` (Android), `capacitor://localhost` (iOS) y `http://localhost` (`render.yaml`, `CORS_ORIGINS`). Si se sirve la app en otro puerto o en una IP de red local, la API la rechaza.
- **Enlace `setena://perfil/<id>`:** en el iPhone no funciona, porque solo abre la app instalada (Android o iOS nativo). Compartir funciona con el enlace público `/p/<id>`.
- **Android:** para regenerar la APK hace falta JDK 21 y el SDK de Android en el ordenador nuevo (`mobile/README.md`, sección Android).
- **Secretos:** nunca commitear `.env`. Claude no muestra ni usa contraseñas. Usuario demo: `alex.martin@example.com`, con la contraseña de `SEED_DEMO_PASSWORD`.
- **Reglas del proyecto:** textos del wireframe tal cual, solo modo oscuro, vídeos aplazados, registrar las decisiones delegadas en `docs/producto.md`.

## Pendiente después
- iOS en el simulador cuando haya Xcode (pasos en `mobile/README.md`).
- Fase 5: medir los 4 criterios de `docs/producto.md` (APK en Android y web/iOS); si fallan el scroll o Atrás/teclado → plan B nativo.
- Opcional: ID de cliente OAuth de Google para el botón de Google; vídeos cuando se pidan.
