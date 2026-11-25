# Burbuja de mensaje
Mensajes de la conversación, con estado «Enviado» y error de envío.

**Pantallas:** Chat — Jordi Puig, Laia Serra, Pau Vidal, Núria Font, Marc Soler; Chat — Marta Ruiz, mensaje enviado; Chat — mensaje no enviado.
**M3 Expressive:** no hay componente de burbuja en M3. PROPUESTA – pendiente de validar por el equipo.

## Anatomía
1. Burbuja recibida: `surface-container-high` + `on-surface`, alineada a la izquierda.
2. Burbuja enviada: `surface-container-highest` + `on-surface`, alineada a la derecha (la recibida va en `surface-container-high`).
3. Texto `body-large`.
4. Forma `corner-large` con la esquina de la cola en `corner-extra-small`.
5. Estado bajo el **último** mensaje enviado: «Enviado» (`body-small`).
6. Error: icono `error` + «No se ha enviado» (`error`) + botón de texto «Reintentar».

## Variantes
Recibida · enviada · enviada con error. Conversación vacía (Chat — Marta Ruiz, sin mensajes).

## Estados
Las burbujas no son pulsables en el prototipo. «Reintentar» sigue los estados de «Botón».
