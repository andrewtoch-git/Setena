# Cabecera de perfil
Bloque superior del perfil bajo el carrusel: nombre, rol y géneros, ubicación, actividad, Favorito y etiquetas.

**Pantallas:** Perfil de músico (todas las variantes), Mi perfil.
**M3 Expressive:** composición de tipografía + Toggle button + etiquetas; no es un componente M3 único. PROPUESTA – pendiente de validar por el equipo.

## Anatomía
1. Avatar de 80 dp con la foto del músico (en Mi perfil, la tuya; sin foto, icono `person`) a la izquierda del bloque de texto.
2. Nombre `title-large-emphasized`: «Marta Ruiz».
3. Línea `body-medium`: «Guitarra · Rock, Indie».
4. Ubicación y actividad `body-small` `on-surface-variant`: «Gràcia, Barcelona», «Última actividad: hace 2 h».
5. Botón Favorito («Añadir a Favoritos» / «Favorito»). En Mi perfil se sustituye por «Editar perfil» (con contorno).
6. Etiquetas de tipo de proyecto.
7. Pestañas Info / Tarifas.
8. Barra de acción al pie con «Chat» (botón relleno `accion-destacada` M, ancho fijo); si el perfil está bloqueado: «Chat no disponible» (desactivado) + aviso de bloqueo.

## Tokens
Texto `on-surface` / `on-surface-variant` · separación interna `space-4`, entre bloques `space-12` · margen `layout-margin-compact`.
