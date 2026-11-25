# Evaluación: chat en tiempo real con WebSocket

> Decisión del equipo (25/11): el chat será en tiempo real. Esta nota evalúa el coste y fija el alcance.
> Las horas son una **estimación** para una persona trabajando con Claude Code, no una medida.

## Resultado (25/11)
**Implementado y probado.** Sobre el chat REST ya existente, el tiempo real ha supuesto un gateway de ~150 líneas, un emisor de eventos y 5 tests e2e con clientes socket.io reales. Coste real: bajo. Ver «Contrato para la app» abajo.

## Veredicto previo (estimación)
**Coste moderado: unos 2–3 días** sobre un chat que ya funcione por REST. Merece la pena para el prototipo si se limita el alcance a lo que muestra el wireframe. La alternativa (refrescar cada pocos segundos) costaría medio día, pero no da sensación de tiempo real.

## Piezas y estimación
| Pieza | Qué incluye | Estimación |
|---|---|---|
| Gateway en NestJS | `@nestjs/websockets` + `@nestjs/platform-socket.io`; autenticación con el JWT de acceso en el handshake; una sala por usuario | ½ día |
| Eventos | `mensaje:nuevo`, `mensaje:leido`; el mensaje se guarda en MongoDB **antes** de emitirse; respeta bloqueos | ½ día |
| Cliente Angular | Servicio con `socket.io-client`, reconexión automática, estado «Enviado» / «No se ha enviado» con reintento (ya diseñado en `Chat-jordi-error`) | 1 día |
| Pruebas | Tests e2e del gateway y prueba manual en dos dispositivos | ½ día |

## Diseño propuesto
- **REST sigue siendo la fuente de verdad:** el historial se carga con `GET /conversaciones/:id/mensajes`; el socket solo avisa de lo nuevo. Si el socket se cae, al reconectar se vuelve a pedir el historial.
- Enviar: por socket con confirmación (ack). Si no llega el ack, el mensaje queda en «No se ha enviado» con reintento.
- Insignia de no leídos en la barra inferior y en la lista de Chats: se actualiza con los mismos eventos.

## Riesgos y limitaciones
- **Render (plan gratuito):** admite WebSockets, pero el servicio se duerme tras unos 15 minutos sin tráfico. La primera conexión tras dormir tarda (arranque en frío) y las conexiones abiertas se cortan. Para demos, despertar el servicio antes.
- **Una sola instancia:** sin adaptador Redis. Si algún día hay varias instancias, hará falta.
- **Android en segundo plano:** el socket se cierra cuando la app no está en primer plano. Sin notificaciones push (fuera del prototipo), el usuario ve los mensajes al volver a abrir la app.
- **Seguridad:** validar el JWT en cada conexión, comprobar que el usuario participa en la conversación y que no hay bloqueo antes de emitir.

## Fuera de alcance
Indicador «escribiendo…», estado «en línea», adjuntos en el chat, notificaciones push, chats de grupo.

## Contrato para la app (implementado)
Conexión: `io(API_URL + '/chat', { auth: { token: accessToken } })`.

| Dirección | Evento | Datos | Respuesta (ack) |
|---|---|---|---|
| app → servidor | `mensaje:enviar` | `{ conversacionId, texto }` | `{ ok: true, datos: mensaje }` o `{ ok: false, error, status }` |
| app → servidor | `conversacion:leer` | `{ conversacionId }` | `{ ok: true }` o error |
| servidor → app | `mensaje:nuevo` | `{ conversacionId, mensaje: { id, texto, mio, enviadoAt, leidoAt } }` | — |
| servidor → app | `conversacion:leida` | `{ conversacionId, lector, leidoAt }` | — |
| servidor → app | `error:auth` / `sesion:caducada` | — | La app renueva el token y reconecta |

- Los mensajes enviados por REST (`POST /conversaciones/:id/mensajes`) también se emiten por el socket.
- Sin ack en 5 s → la app marca el mensaje como «No se ha enviado» con reintento (pantalla `Chat-jordi-error`).
- Al reconectar, la app vuelve a pedir el historial por REST.
