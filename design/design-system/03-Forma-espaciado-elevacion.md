# Forma, espaciado y elevación

## Escala de esquinas (M3 Expressive)
| Token | Valor (dp) | Componentes |
|---|---|---|
| `corner-none` | 0 | Barra de navegación, barra superior, pestañas |
| `corner-extra-small` | 4 | Campo de texto con contorno, mensaje temporal, cola de burbuja |
| `corner-small` | 8 | Chips, etiquetas |
| `corner-medium` | 12 | Tarjeta de músico, miniatura de vídeo, avisos |
| `corner-large` | 16 | Burbujas de chat |
| `corner-large-increased` | 20 (a verificar) | Sin uso |
| `corner-extra-large` | 28 | Ventanas modales, carrusel, hoja inferior |
| `corner-extra-large-increased` | 32 (a verificar) | Sin uso |
| `corner-extra-extra-large` | 48 (a verificar) | Sin uso |
| `corner-full` | totalmente redondo | Botones, botones de icono, barra de búsqueda, campo de mensaje, avatar, insignia, indicador activo, interruptor |

Los botones de M3 Expressive cambian de forma: redondos en reposo, más cuadrados al pulsar o al quedar seleccionados (ver «Botón» y «Botón Favorito»).

## Espaciado (rejilla de 4 dp)
| Token | dp | Uso |
|---|---|---|
| `space-4` | 4 | Texto dentro de un bloque; icono ↔ texto en etiquetas |
| `space-8` | 8 | Entre chips y entre botones de un grupo |
| `space-12` | 12 | Entre tarjetas y entre bloques de una tarjeta |
| `space-16` | 16 | Margen lateral de pantalla; padding de tarjeta y de fila de lista |
| `space-20` | 20 | Entre campos de formulario |
| `space-24` | 24 | Padding de ventana; entre secciones del perfil |
| `space-32` | 32 | Grupos grandes (estado vacío) |
| `space-40`, `space-48`, `space-64` | — | Reservados |

## Móvil (ventana compact, < 600 dp)
- Margen lateral: **16 dp** (`layout-margin-compact`).
- Rejilla de 4 columnas; separación entre columnas **8 dp** (`layout-gutter-compact`, a verificar en m3.material.io).
- Tamaño de referencia del wireframe: 402 × 874 px.
- Área táctil mínima: **48 dp** (`touch-target`). El wireframe usaba 44 px.

## Elevación
En M3 la elevación se expresa sobre todo con el color del contenedor (`surface-container-*`); la sombra se reserva a elementos flotantes.

| Nivel | dp | Contenedor | Componentes |
|---|---|---|---|
| 0 | 0 | `surface` | Pantalla, barra superior en reposo, tarjeta con contorno, botones |
| 1 | 1 | `surface-container-low` | Tarjeta elevada, hoja inferior |
| 2 | 3 | `surface-container` | Barra de navegación; barra superior al desplazar |
| 3 | 6 | `surface-container-high` | Ventanas modales, barra de búsqueda, mensaje temporal |
| 4 | 8 | — | Hovered de un elemento de nivel 3 |
| 5 | 12 | — | Sin uso |

Sombras (`elevation-level-1…5`): valores del kit M3 para web, **a verificar**. Nivel de la barra de navegación y de la barra de búsqueda en M3 Expressive: **a verificar**.

## Estados (capas de estado)
| Estado | Opacidad de la capa | Notas |
|---|---|---|
| Hovered | 8 % (`state-hover`) | — |
| Focused | 10 % (`state-focus`) | + anillo de foco 3 dp `secondary`, separación 2 dp (a verificar) |
| Pressed | 10 % (`state-pressed`) | + morph de forma en botones |
| Dragged | 16 % (`state-dragged`) | Solo el carrusel |
| Disabled | contenido 38 %, contenedor 12 % de `on-surface` | — |
| Selected | — | Cambio de rol de color + icono relleno o check |
