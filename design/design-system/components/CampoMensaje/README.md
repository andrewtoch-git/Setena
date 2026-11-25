# Campo de envío de mensaje
Escribir y enviar un mensaje en el chat.

**Pantallas:** todas las pantallas de Chat.
**M3 Expressive:** campo de texto relleno con forma `corner-full` + Icon button relleno. No es un componente M3 único: PROPUESTA – pendiente de validar por el equipo.

## Anatomía
1. Campo 48 dp, `surface-container-high`, `corner-full`, texto `body-large`, texto de apoyo «Escribe un mensaje».
2. Botón de icono relleno `send` «Enviar mensaje».

## Estados
- Vacío: botón de enviar desactivado.
- Con texto: botón activo (`accion-destacada`, lima).
- Persona bloqueada: el campo se sustituye por «No puedes enviar mensajes a una persona bloqueada.» y el aviso de bloqueo.
- Hovered / focused / pressed del botón: ver «Botón de icono».
