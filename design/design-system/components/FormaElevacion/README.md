# Forma y elevación
Escala de esquinas de M3 Expressive y niveles de elevación 0–5 con el componente de setena que usa cada uno.

**Pantallas:** todas.

## Esquinas
| Token | Valor | Uso en setena |
|---|---|---|
| `corner-none` | 0 | Barra de navegación, barra superior, pestañas. |
| `corner-extra-small` | 4 | Campo de texto con contorno, mensaje temporal, cola de burbuja. |
| `corner-small` | 8 | Chips y etiquetas. |
| `corner-medium` | 12 | Tarjeta de músico, miniatura de vídeo, avisos. |
| `corner-large` | 16 | Burbujas de chat. |
| `corner-large-increased` | 20 (a verificar) | Sin uso. |
| `corner-extra-large` | 28 | Ventanas modales, carrusel, hoja inferior. |
| `corner-extra-large-increased` | 32 (a verificar) | Sin uso. |
| `corner-extra-extra-large` | 48 (a verificar) | Sin uso. |
| `corner-full` | 9999 | Botones, botones de icono, búsqueda, campo de mensaje, avatar, insignia, indicador activo, interruptor. |

## Elevación
En M3 la elevación se expresa sobre todo con el color del contenedor; la sombra solo aparece en elementos flotantes.

| Nivel | dp | Contenedor | Uso |
|---|---|---|---|
| 0 | 0 | `surface` | Pantalla, barra superior en reposo, tarjeta con contorno. |
| 1 | 1 | `surface-container-low` | Tarjeta elevada, hoja inferior. |
| 2 | 3 | `surface-container` | Barra inferior; barra superior al desplazar. |
| 3 | 6 | `surface-container-high` | Ventanas modales, barra de búsqueda; mensaje temporal (`inverse-surface`). |
| 4 | 8 | — | Hovered de un elemento de nivel 3. |
| 5 | 12 | — | Sin uso. |

Los valores de sombra (`elevation-level-*`) proceden del kit M3 para web: **a verificar**. La asignación de nivel de la barra inferior y la búsqueda en M3 Expressive: **a verificar**.
