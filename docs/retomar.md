# Retomar la sesión: ver la app en el simulador de iOS (25/11/2026)

> Para Claude Code al volver: lee este archivo, `CLAUDE.md` y `docs/estado.md`, y sigue desde «Pasos para Claude al volver». No hace falta volver a planificar: la vinculación con iOS ya está aprobada y hecha; solo falta compilar y abrir en el simulador.

## Dónde estamos
| | Estado |
|---|---|
| Fases 1–4 (backend, chat, seed, Render, app Ionic) | ✅ Hechas y comprobadas (`docs/estado.md`) |
| Web publicada | https://setena-app.onrender.com · API https://setena-api.onrender.com |
| APK Android (depuración) | ✅ Generada desde la terminal con JDK 21 + SDK de Android, copia en `~/Desktop/setena.apk` |
| iOS | 🟡 Proyecto `mobile/ios` creado y subido (commit `94dcff1`): Capacitor 8, Swift Package Manager (sin CocoaPods), iOS 15+, `cat.setena.app`, esquema `setena://` en `Info.plist`. **Falta Xcode** en el Mac |
| Fase 5 (Ionic vs. nativo) | ⏳ Sin empezar; criterios en `docs/producto.md` |

Todo está en GitHub (`main`), sin cambios locales pendientes.

## Lo que hace la persona del equipo (antes de volver)
1. Instalar **Xcode** desde la App Store (≈15 GB) y abrirlo una vez para que instale sus componentes.
2. En la terminal (piden la contraseña del Mac):
   ```bash
   sudo xcode-select -s /Applications/Xcode.app/Contents/Developer
   sudo xcodebuild -license accept
   xcodebuild -downloadPlatform iOS
   ```
   La última línea descarga el simulador de iOS (≈8 GB).
3. Abrir Claude Code en la carpeta del proyecto y decir: **«lee docs/retomar.md y sigue»**.

No hace falta cuenta de desarrollador de Apple de pago para el simulador.

## Pasos para Claude al volver
1. Comprobar Xcode y el simulador:
   ```bash
   xcodebuild -version
   xcrun simctl list runtimes | grep -i ios
   xcrun simctl list devices available | grep -i iphone | head
   ```
   Si falta algo, decir exactamente qué paso de la sección anterior falta y parar.
2. Compilar y abrir en el simulador:
   ```bash
   cd mobile
   npx ng build && npx cap sync ios
   npx cap run ios --list                # elegir un iPhone disponible
   npx cap run ios --target <id>
   ```
   Alternativa si `cap run` falla: `xcodebuild -project ios/App/App.xcodeproj -scheme App -sdk iphonesimulator -destination 'platform=iOS Simulator,name=<iPhone>' -derivedDataPath ios/DerivedData build`, luego `xcrun simctl boot`, `xcrun simctl install booted ios/DerivedData/Build/Products/Debug-iphonesimulator/App.app` y `xcrun simctl launch booted cat.setena.app`.
3. Verificar (capturas con `xcrun simctl io booted screenshot <ruta en el scratchpad>`):
   - Inicio con la animación, X → Explorar carga los 32+ músicos de la API publicada (la primera petición puede tardar ~1 min si Render está dormido).
   - Abrir una ficha y la hoja Compartir.
   - Enlace: `xcrun simctl openurl booted setena://perfil/6b06bfc12a0d450b87e29105` abre la ficha de Alex Martín.
4. Si algo falla, corregir, volver a probar, y hacer commit + push (con el trailer `Co-Authored-By` de siempre).
5. Actualizar `docs/estado.md` (fila «4b · iOS» → ✅), `CLAUDE.md` (Estado) y borrar o archivar este archivo.

## A tener en cuenta
- **CORS:** el origen de la app en iOS es `capacitor://localhost` y ya está permitido en la API (`render.yaml`, `CORS_ORIGINS`). En Android es `https://localhost` (añadido el 25/11).
- **Android:** para regenerar la APK, `export JAVA_HOME=~/Library/Java/jdk-21/Contents/Home` y seguir `mobile/README.md` (sección Android). SDK en `~/Library/Android/sdk`.
- **Secretos:** `backend/.env` (no está en git) guarda `MONGODB_URI` y `SEED_DEMO_PASSWORD`. Claude no muestra ni usa contraseñas; la persona del equipo inicia sesión con el usuario demo si hace falta.
- **Reglas del proyecto:** textos del wireframe tal cual, solo modo oscuro, vídeos aplazados, registrar decisiones delegadas en `docs/producto.md`.

## Después de iOS
- Fase 5: instalar la APK (y probar en el simulador iOS) y medir los 4 criterios de `docs/producto.md`; si fallan el scroll o Atrás/teclado → plan B nativo.
- Opcional: ID de cliente OAuth de Google para el botón de Google; vídeos cuando se pidan.
