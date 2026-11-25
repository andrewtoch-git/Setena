# Modelo de datos y datos de prueba

> El modelo es una **PROPUESTA** derivada del wireframe (25/11); el equipo validó crear los datos de prueba con él.
> Los datos de `mock-data/` son **ficticios**: no son datos de la investigación.

## Colecciones (MongoDB)
| Colección | Campos |
|---|---|
| **users** | `email` (único), `passwordHash` (null si solo usa Google), `googleId` (único, opcional), `proveedores[]` (`email`, `google`), `ajustes` { `notifMensajes`, `notifNovedades` }, `refreshTokenHash`, `createdAt`, `lastActivityAt` |
| **profiles** | `userId`, `nombre` (no editable), `roles[]`, `generos[]`, `zona` (Barcelona ciudad / Alrededores), `lugar`, `disponibilidad[]`, `remunerados` (bool), `colaboraciones` (bool), `sobreMi`, `tarifas[]` { `servicio` (bolo, grabacion, composicion, otros), `precio` (número o null), `unidad`, `texto` }, `redes` { instagram, youtube, spotify, tiktok, soundcloud }, `media[]` { `tipo` (video/foto), `titulo`, `archivoId`, `miniaturaId`, `principal` }, `avatarId`, `completo` (bool) |
| **favorites** | `userId`, `profileId`, `createdAt` (único por par) |
| **conversations** | `participantes[2]`, `ultimoMensajeAt`, `noLeidos` { userId: número } |
| **messages** | `conversationId`, `de`, `texto`, `createdAt`, `leidoAt` |
| **blocks** | `userId`, `bloqueadoId`, `createdAt` |
| **reports** | `denuncianteId`, `profileId`, `motivo` (lista cerrada), `createdAt` |
| **media.files / media.chunks** | GridFS: fotos, vídeos y miniaturas |

Índices: texto en `profiles` (nombre, roles, géneros, lugar, sobreMi) para la búsqueda libre; índices simples en `roles`, `generos`, `zona`, `disponibilidad`.

## Login con Google
- El backend verifica el **ID token de Google** (`google-auth-library`) y emite sus propios JWT, igual que con correo.
- Si el correo de Google ya existe con contraseña, se vincula la cuenta (correo verificado por Google).
- Tras el primer login con Google, el usuario **completa el registro** (roles, géneros, vídeo obligatorio…) antes de usar Favoritos y Chats.
- Necesita un proyecto en Google Cloud con IDs de cliente OAuth web y Android (huella SHA-1 del keystore). En Android se usa un plugin de Capacitor para Google Sign-In (se elige en la fase 4).

## Archivos en MongoDB (GridFS): límites
- Se guardan con `GridFSBucket`. El endpoint de vídeo debe soportar **peticiones Range** (HTTP 206) para que el reproductor pueda avanzar y retroceder.
- ⚠️ **El clúster gratuito M0 de Atlas tiene 512 MB de almacenamiento en total.** Con vídeos de hasta 100 MB (límite del wireframe) caben muy pocos. Opciones para el prototipo:
  1. Limitar los vídeos a clips cortos (por ejemplo ≤ 20–30 MB) y comprimir al subir. **PROPUESTA**.
  2. Pasar a un clúster de pago.
  3. Más adelante, mover los archivos a almacenamiento de objetos y guardar en Mongo solo la referencia.

  **Decidido el 25/11:** de momento no se suben vídeos; cuando se haga, máximo **30 s** por vídeo (con eso el tamaño queda en pocos MB y caben en M0). GridFS se usa ya para las fotos.

## Datos de prueba (`mock-data/`)
| Archivo | Contenido |
|---|---|
| `catalogos.json` | Listas cerradas: roles, géneros, disponibilidad, zonas, tipos de proyecto, servicios de tarifa, motivos de denuncia, chips rápidos y redes |
| `usuarios.json` | 32 usuarios con correo `@example.com`. `alex` es el **usuario demo** (`demo: true`). Sin contraseñas: el seed las genera (la del demo sale de `SEED_DEMO_PASSWORD`) |
| `perfiles.json` | 32 perfiles. Los 7 del wireframe (`origen: "wireframe"`, contenido literal de las pantallas) + 25 generados (`origen: "generado"`) para probar búsqueda y filtros. Todos tienen `ficticio: true` |
| `favoritos.json` | Favoritos de Alex: Laia, Marc y Marta (como en el wireframe) |
| `conversaciones.json` | Chats de Alex con Jordi, Núria (sin leer), Laia, Marc y Pau, con los mensajes del wireframe y su antigüedad en minutos (`haceMin`) |
| `media/` | 15 fotos de ejemplo del equipo (avatar y miniatura de los 7 perfiles del wireframe) |
| `generar.py` | Script que vuelve a generar los JSON (`python3 generar.py .`) |

Notas:
- Los enlaces a redes son de `example.com`: no apuntan a cuentas reales.
- **No hay vídeos** (aplazados). El seed guarda las entradas `tipo: "video"` solo con título y miniatura (sin `archivoId`); la app muestra la miniatura como marcador.
- Los perfiles generados no tienen foto: la app debe mostrar el marcador de avatar.
- El seed debe ser **idempotente**: borrar y volver a crear solo los documentos con `ficticio: true` y los usuarios `@example.com`.
