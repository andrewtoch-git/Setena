# Pestañas
Alternan contenido dentro de una pantalla: Info / Tarifas en los perfiles y Barcelona ciudad / Alrededores en Ubicación.

**Pantallas:** Perfil de músico, Mi perfil (Info / Tarifas); Registro y Editar perfil (Ubicación).
**M3 Expressive:** Tabs. Info/Tarifas = pestañas primarias; Ubicación = pestañas secundarias. Estándar.

## Anatomía
1. Contenedor con divisor inferior `outline-variant`.
2. Etiqueta (`title-small`): «Info», «Tarifas» / «Barcelona ciudad», «Alrededores».
3. Indicador activo: primarias 3 dp, ancho del texto, esquinas superiores redondeadas; secundarias 2 dp a todo el ancho.

## Estados
| Estado | Cómo se expresa |
|---|---|
| Enabled | Reposo, colores del rol. |
| Hovered | Capa de estado del color del contenido a `state-hover` (8 %). |
| Focused | Capa a `state-focus` (10 %) + anillo `focus-ring-width` en `acento`, separado `focus-ring-offset`. |
| Pressed | Capa a `state-pressed` (10 %). |
| Dragged | No aplica. |
| Disabled | Contenido `on-surface` al 38 % (`state-disabled-content`), contenedor `on-surface` al 12 % (`state-disabled-container`). |
| Selected | Etiqueta `acento` (primarias) u `on-surface` (secundarias) + indicador `acento`; el indicador se desplaza con `spring-spatial-fast`. |

## Tokens
Etiqueta `on-surface-variant` / `acento` · indicador `acento` · divisor `outline-variant` · altura 48 dp.

## Uso
- Dos pestañas como máximo en setena; no añadir más sin decisión del equipo.
- `role="tablist"` / `role="tab"` / `aria-selected`, como en el wireframe.
