# Chip
Opción pulsable para filtrar o elegir: instrumento, estilo, ubicación, disponibilidad y tipo de proyecto.

**Pantallas:** Explorar (chips rápidos y filtros aplicados), Filtros de búsqueda, Registro y Editar perfil (Tipo de proyecto, Ubicación, Disponibilidad, diálogo de Instrumento o rol / Géneros musicales).
**M3 Expressive:** Filter chip (selección) e Input chip (filtro aplicado que se puede quitar). Estándar.

## Variantes
| Variante | Uso | Selección |
|---|---|---|
| Filtro | Filtros, Disponibilidad, Tipo de proyecto, diálogos de selección | Múltiple |
| Filtro único (`role="radio"`) | Chips rápidos de instrumento en Explorar, Ubicación | Única |
| Entrada | Filtros aplicados en Explorar («Quitar filtro Guitarra») | Se quita con `close` |

## Anatomía
1. Contenedor 32 dp (área táctil 48 dp), `corner-small`.
2. Icono inicial `check` 18 dp (solo seleccionado).
3. Etiqueta `label-large`.
4. Icono final `close` (solo chip de entrada).

## Tamaño
32 dp de alto. El wireframe usaba 36 px: M3 mantiene 32 dp y garantiza 48 dp de área táctil con 8 dp entre chips.

## Estados
| Estado | Cómo se expresa |
|---|---|
| Enabled | Reposo, colores del rol. |
| Hovered | Capa de estado del color del contenido a `state-hover` (8 %). |
| Focused | Capa a `state-focus` (10 %) + anillo `focus-ring-width` en `acento`, separado `focus-ring-offset`. |
| Pressed | Capa a `state-pressed` (10 %). |
| Dragged | No aplica. |
| Disabled | Contenido `on-surface` al 38 % (`state-disabled-content`), contenedor `on-surface` al 12 % (`state-disabled-container`). |
| Selected | degradado tonal (`secondary-container-alto` → `secondary-container`) + `on-secondary-container` + icono `check`; sin borde. La selección no depende solo del color: añade el check. |

## Tokens
Borde `outline` (se usa `outline` y no `outline-variant` para cumplir 3:1 como límite de control) · etiqueta `on-surface-variant` · forma `corner-small`.
