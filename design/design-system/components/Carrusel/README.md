# Carrusel de fotos y vídeos
Galería del perfil: se desliza a izquierda y derecha y se navega con los puntos (sin flechas desde el 17/11); el primer elemento es siempre el vídeo principal.

**Pantallas:** Perfil de músico (todas las variantes), Mi perfil, Mi perfil — añadir foto o vídeo, Mi perfil — error al subir un vídeo.
**M3 Expressive:** Carousel (hero). Los puntos de posición no forman parte del carrusel M3: PROPUESTA – pendiente de validar por el equipo.

## Anatomía
1. Elementos con `corner-extra-large`; el siguiente asoma por la derecha (hero).
2. Rótulo: «Vídeo · Directo con banda» / «Foto · Foto con su guitarra» (etiqueta).
3. Botón «Reproducir {título}» sobre los vídeos.
4. Foto o miniatura del vídeo a sangre (`object-fit: cover`); rótulo y botón de reproducir sobre fondo `surface` opaco para no depender de la foto. Sin foto: marcador `surface-container-highest` con el icono.
5. Puntos: el relleno es la posición actual.
6. Solo en Mi perfil: etiqueta «Principal» y acciones «Marcar como principal», «Eliminar», «Añadir» (abre «Añadir a tu perfil»).

## Estados
| Estado | Cómo se expresa |
|---|---|
| Enabled | Reposo, colores del rol. |
| Hovered | Capa de estado del color del contenido a `state-hover` (8 %). |
| Focused | Capa a `state-focus` (10 %) + anillo `focus-ring-width` en `acento`, separado `focus-ring-offset`. |
| Pressed | Capa a `state-pressed` (10 %). |
| Dragged | Al arrastrar un elemento: capa al 16 % (`state-dragged`); se ajusta a la posición con `spring-spatial-default`. |
| Disabled | Contenido `on-surface` al 38 % (`state-disabled-content`), contenedor `on-surface` al 12 % (`state-disabled-container`). |
| Selected | No aplica. |

## Tokens
Marcador `surface-container-highest` · punto actual `acento`, resto contorno `on-surface-variant` · forma `corner-extra-large`.
