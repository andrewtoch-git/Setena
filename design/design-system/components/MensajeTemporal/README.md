# Mensaje temporal
Aviso breve en la parte inferior tras una acción, con acción opcional.

**Pantallas:** Perfil («Añadido a Favoritos» / «Quitado de Favoritos»), Favoritos («Has quitado a Laia Serra de Favoritos» + «Deshacer»), Mi perfil («Subiendo vídeo…», «Vídeo subido. Puedes marcarlo como principal.», «Foto subida.», error de subida + «Reintentar»).
**M3 Expressive:** Snackbar. Estándar; la variante con indicador de progreso es PROPUESTA – pendiente de validar por el equipo.

## Anatomía
1. Contenedor `inverse-surface`, `corner-extra-small`, nivel 3, sobre la barra inferior.
2. Texto `body-medium` `inverse-on-surface` (hasta dos líneas).
3. Acción opcional: botón de texto `inverse-on-surface` subrayado («Deshacer», «Reintentar»).
4. Progreso opcional: indicador circular a la izquierda.

## Variantes
Confirmación (2,5–3,5 s) · con Deshacer · progreso (sin cierre automático) · error con Reintentar (`role="alert"`; el resto `role="status"`).

## Movimiento
Entra y sale con `spring-spatial-default`.
