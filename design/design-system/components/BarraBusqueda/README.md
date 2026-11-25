# Barra de búsqueda
Campo «Buscar músicos» con el botón de filtros a la derecha y una fila de chips rápidos de instrumento debajo.

**Pantallas:** Explorar, Explorar — búsqueda por texto, Explorar — filtros aplicados (con y sin registro).
**M3 Expressive:** Search bar con acción final + Filter chips. Estándar.

## Anatomía
1. Contenedor 56 dp, `corner-full`, `surface-container-high`.
2. Icono `search`.
3. Texto de apoyo «Buscar músicos» (`body-large`, `on-surface-variant`); con texto escrito pasa a `on-surface`.
4. Botón de icono `tune` — aria-label «Filtros de búsqueda» o «Filtros de búsqueda (2 aplicados)».
5. Insignia con el número de filtros aplicados.
6. Chips rápidos (selección **única**): Guitarra, Piano, Teclado, Cantante, Bajo, Batería, DJ.
7. Chips de filtros aplicados (chip de entrada con `close`, «Quitar filtro Guitarra») + «Borrar todo» (botón de texto).

## Variantes
Sin filtros · con filtros (insignia + chips de entrada) · con texto escrito.

## Estados
| Estado | Cómo se expresa |
|---|---|
| Enabled | Reposo, colores del rol. |
| Hovered | Capa de estado del color del contenido a `state-hover` (8 %). |
| Focused | Capa a `state-focus` (10 %) + anillo `focus-ring-width` en `acento`, separado `focus-ring-offset`. |
| Pressed | Capa a `state-pressed` (10 %). |
| Dragged | No aplica. |
| Disabled | Contenido `on-surface` al 38 % (`state-disabled-content`), contenedor `on-surface` al 12 % (`state-disabled-container`). |
| Selected | Chip rápido seleccionado: ver «Chip». |

## Tokens
Contenedor `surface-container-high` · texto `body-large` · iconos `on-surface-variant` · insignia `acento`/`on-acento` · forma `corner-full`.
