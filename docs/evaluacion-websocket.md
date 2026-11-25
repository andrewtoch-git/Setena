# Evaluación: chat en tiempo real con WebSocket

> Decisión del equipo (25/11): el chat será en tiempo real. Esta nota evalúa el coste y fija el alcance.
> Las horas son una **estimación** para una persona trabajando con Claude Code, no una medida.

## Veredicto
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
