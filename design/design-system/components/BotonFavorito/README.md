# Botón Favorito
Botón de alternar del perfil que añade o quita al músico de Favoritos: «Añadir a Favoritos» (corazón vacío) / «Favorito» (corazón lleno).

**Pantallas:** Perfil de músico (desde Explorar, Favoritos y chat), Perfil — sin registro (abre la Ventana de registro).
**M3 Expressive:** Toggle button (variante de Button). Estándar; los colores del estado seleccionado son PROPUESTA – pendiente de validar por el equipo.

> **Conflicto de nomenclatura:** el enunciado pide «Guardar/Guardado». El wireframe (ajustes del 12/11, tarde) usa «Añadir a Favoritos» / «Favorito». Se sigue el wireframe (fuente 1).

## Anatomía
1. Contenedor S (40 dp). 2. Icono `favorite` 20 dp (FILL 0 / FILL 1). 3. Etiqueta `label-large`.

## Variantes
- No seleccionado: contorno de 1,5 dp en `acento`, corazón y texto en `acento`, «Añadir a Favoritos», forma redonda.
- Seleccionado: tonal con degradado tonal (`secondary-container-alto` → `secondary-container`), corazón lleno, «Favorito», forma cuadrada (M3 Expressive cambia la forma al seleccionar).

## Estados
| Estado | Cómo se expresa |
|---|---|
| Enabled | Reposo, colores del rol. |
| Hovered | Capa de estado del color del contenido a `state-hover` (8 %). |
| Focused | Capa a `state-focus` (10 %) + anillo `focus-ring-width` en `acento`, separado `focus-ring-offset`. |
| Pressed | Capa a `state-pressed` (10 %) y morph de forma. |
| Dragged | No aplica. |
| Disabled | Contenido `on-surface` al 38 % (`state-disabled-content`), contenedor `on-surface` al 12 % (`state-disabled-container`). |
| Selected | Ver variantes. Al cambiar: relleno con `spring-effects-fast`, forma con `spring-spatial-fast`; mensaje temporal «Añadido a Favoritos» / «Quitado de Favoritos». |

## Accesibilidad
`aria-pressed="true|false"`. El cambio se comunica con icono y texto, no solo con color.
