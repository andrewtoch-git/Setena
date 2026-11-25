# Botón de icono
Acción representada solo con un icono, siempre con aria-label con el texto del wireframe.

**Pantallas:** todas las barras superiores («Volver», «Compartir perfil», «Más opciones», «Ajustes»), Explorar («Filtros de búsqueda», «Reproducir vídeo de…»), Favoritos («Quitar a Laia Serra de Favoritos»), Chat («Enviar mensaje»), Perfil («Foto o vídeo anterior/siguiente»), ventanas («Cerrar»).
**M3 Expressive:** Icon button (standard, filled, tonal, outlined; tamaños XS–XL). Estándar.

## Variantes
- Estándar: barras superiores, filtros, carrusel.
- Relleno: «Enviar mensaje».
- De alternar (toggle): «Quitar de Favoritos» (corazón relleno `acento` = seleccionado).

## Tamaño
Contenedor S 40 dp con área táctil 48 dp; icono 24 dp. Resto de tamaños M3 Expressive: a verificar; sin uso.

## Estados
| Estado | Cómo se expresa |
|---|---|
| Enabled | Reposo, colores del rol. |
| Hovered | Capa de estado del color del contenido a `state-hover` (8 %). |
| Focused | Capa a `state-focus` (10 %) + anillo `focus-ring-width` en `acento`, separado `focus-ring-offset`. |
| Pressed | Capa a `state-pressed` (10 %). |
| Dragged | No aplica. |
| Disabled | Contenido `on-surface` al 38 % (`state-disabled-content`), contenedor `on-surface` al 12 % (`state-disabled-container`). |
| Selected | Icono relleno (FILL 1) en `acento`. |

## Tokens
Icono `on-surface-variant` · relleno `accion-destacada`/`on-accion-destacada` («Enviar mensaje») · forma `corner-full`.
