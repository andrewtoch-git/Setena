# Despliegue: MongoDB Atlas + Render

> Los pasos con cuentas y contraseñas los hace una persona del equipo. Claude no crea cuentas ni introduce credenciales.

## 1. MongoDB Atlas (base de datos)
1. Entra en https://cloud.mongodb.com y crea un proyecto `setena`.
2. **Create cluster → M0 (gratis)**, proveedor AWS, región **Frankfurt (eu-central-1)**, la misma zona que Render.
3. **Database Access → Add new database user**: usuario `setena-api`, contraseña generada, rol *Read and write to any database*.
4. **Network Access → Add IP address → `0.0.0.0/0`**. El plan gratuito de Render no tiene IP fija. Solo para el prototipo; en producción conviene usar IPs fijas o un peering.
5. **Connect → Drivers** y copia la cadena. Añade el nombre de la base de datos antes del `?`:
   `mongodb+srv://setena-api:<contraseña>@<cluster>.mongodb.net/setena?retryWrites=true&w=majority`

Espacio: M0 tiene 512 MB. Con fotos de hasta 10 MB y 10 por perfil hay margen para el prototipo. Los vídeos están aplazados.

## 2. Render (API)
1. Entra en https://render.com con la cuenta de GitHub que tiene acceso a `Setena`.
2. **New → Blueprint** y elige el repositorio. Render lee `render.yaml` y crea el servicio `setena-api`.
3. Rellena las variables marcadas como manuales:
   - `MONGODB_URI`: la cadena de Atlas del paso 1.5.
   - `GOOGLE_CLIENT_IDS`: déjalo vacío hasta configurar Google (paso 4).
   - `SEED_DEMO_PASSWORD`: solo si vas a cargar los datos de prueba.
   - Los secretos JWT se generan solos.
4. **Apply**. Cuando termine, comprueba:
   - `https://setena-api.onrender.com/health` → `{"status":"ok","db":"up"}`
   - `https://setena-api.onrender.com/docs` → documentación de la API

**Plan gratuito:** el servicio se duerme tras unos 15 minutos sin tráfico y tarda en despertar. Antes de una demo, abre `/health` y espera a que responda.

## 3. Datos de prueba
Desde tu ordenador, con `backend/.env` apuntando a Atlas (`MONGODB_URI` y `SEED_DEMO_PASSWORD`):
```bash
cd backend
npm run seed
```
Usuario demo: `alex.martin@example.com` con la contraseña de `SEED_DEMO_PASSWORD`. Para quitar los datos de prueba: `npm run seed:limpiar`.

## 4. Login con Google (cuando se haga la app)
1. https://console.cloud.google.com → proyecto `setena` → *APIs & Services → OAuth consent screen* (tipo External, modo Testing, añade los correos del equipo como testers).
2. *Credentials → Create OAuth client ID*:
   - **Web application**: el ID que usa la app para pedir el token.
   - **Android**: paquete `cat.setena.app` y huella SHA-1 del keystore de depuración (`./gradlew signingReport` en `mobile/android`).
3. Pon los dos IDs, separados por coma, en `GOOGLE_CLIENT_IDS` en Render.

## 5. Cuando la app esté en un dominio
Añade su origen a `CORS_ORIGINS` en Render (por ejemplo, `https://setena.app`). Los orígenes de Capacitor (`capacitor://localhost`, `http://localhost`) ya están incluidos.
