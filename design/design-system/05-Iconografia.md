# Iconografía
Material Symbols **Rounded**, peso 400, grado 0, tamaño óptico 24; relleno 0 en reposo y 1 en estado seleccionado.

**Pantallas:** todas.

## Por qué Rounded (PROPUESTA – pendiente de validar por el equipo)
- Acompaña la forma de M3 Expressive: botones redondos, chips y ventanas con esquinas grandes.
- Los terminales redondeados encajan con el tono cercano de la app («¡La música se disfruta más en comunidad!») mejor que Outlined, más técnico.
- El wireframe ya dibuja los iconos con trazo de extremos redondos.
- Outlined es la alternativa si el equipo prefiere un aspecto más neutro; el cambio no afecta a tamaños ni a tokens.

## Reglas
- Tamaño 24 dp (`icon-size-default`) en barras y botones de icono; 18–20 dp dentro de chips y botones S; 16 dp en etiquetas.
- **Relleno = seleccionado:** pestaña activa de la barra inferior, corazón de «Favorito», icono de la fila de Favoritos.
- Color por rol: `on-surface-variant` en reposo, `on-secondary-container` en el indicador activo (sobre el degradado tonal), `acento` en iconos activos (corazones de Favoritos, check, enlaces de acento), `error` solo en errores.
- En el wireframe los iconos se dibujan como SVG de trazo redondeado (estilo Material Symbols Rounded): el lienzo no carga la fuente de iconos.
- Botones solo de icono llevan `aria-label` con el texto del wireframe («Volver», «Compartir perfil», «Más opciones», «Enviar mensaje»).
- **Redes sociales** (Instagram, YouTube, Spotify, TikTok, SoundCloud, WhatsApp, Facebook): Material Symbols no incluye logotipos de marca. Se mantienen las letras del wireframe (I, Y, S, T, SC, W, F) como marcador hasta descargar los iconos oficiales del kit de marca de cada red.

## Correspondencia con el wireframe
La elección concreta de cada símbolo es PROPUESTA: el wireframe usa iconos de trazo genéricos.

| Símbolo | Uso |
|---|---|
| `explore` | Explorar (barra inferior) |
| `favorite` | Favoritos, Añadir a Favoritos / Favorito, quitar de Favoritos |
| `chat_bubble` | Chats, Enviar a un chat de la app, estado vacío de Chats |
| `person` | Mi perfil, marcador de avatar |
| `arrow_back` | Volver, Volver a Chats, Volver sin aplicar |
| `search` | Buscar músicos, sin resultados |
| `tune` | Filtros de búsqueda |
| `close` | Cerrar, Quitar filtro |
| `check` | Chip seleccionado, casilla |
| `share` | Compartir perfil, Compartir mi perfil |
| `more_vert` | Más opciones |
| `settings` | Ajustes |
| `send` | Enviar mensaje |
| `play_arrow` | Reproducir vídeo |
| `chevron_left` / `chevron_right` | Foto o vídeo anterior / siguiente; filas que abren otra vista |
| `arrow_drop_down` | Selector de Instrumento o rol / Géneros musicales |
| `add` | Añadir, Añadir vídeo |
| `videocam` / `add_photo_alternate` | Subir vídeo / Subir foto, Cambiar foto |
| `delete` | Eliminar |
| `error` | Error de campo, «No se ha enviado», error de carga |
| `check_circle` | ¡Perfil enviado!, Cambios guardados |
| `payments` / `handshake` | Proyectos remunerados / Colaboraciones gratuitas (PROPUESTA) |
| `flag` / `block` | Denunciar perfil / Bloquear |
| `logout` | Cerrar sesión |
| `open_in_new` | Abrir red social |
