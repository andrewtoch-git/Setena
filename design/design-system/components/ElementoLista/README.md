# Elemento de lista
Filas de Chats, Favoritos y Ajustes.

**Pantallas:** Chats, Chats — con la conversación nueva de Marta, Favoritos, Ajustes, Enviar a un chat, Más opciones.
**M3 Expressive:** List item (dos y tres líneas). Estándar.

## Variantes
| Variante | Anatomía | Pantalla |
|---|---|---|
| Fila de chat | Avatar 44 con la foto del músico (sin foto: icono `person` sobre `surface-container-highest`) · nombre (`body-large`) · vista previa (`body-medium`, «Tú: » si es tuyo) · hora (`label-small`: «10:24», «Ayer», «Lun», «12/10») · insignia | Chats |
| Fila de chat sin leer | Nombre y vista previa en peso Emphasized + insignia «1» | Chats (Núria Font) |
| Fila de favorito | Avatar 44 con foto · nombre · «Piano · Jazz, Clásica» · «L'Hospitalet de Llobregat» · botón de icono corazón relleno «Quitar a … de Favoritos» | Favoritos |
| Fila de ajustes | Título + subtítulo opcional + `chevron_right` o interruptor; «Eliminar cuenta» en `error` | Ajustes |
| Encabezado | `title-small` `on-surface-variant`: «CUENTA», «NOTIFICACIONES», «SESIÓN», «EN TUS CHATS», «FUERA DE LA APP» | Ajustes, Compartir |

Contador de Favoritos sobre la lista: «3 músicos en favoritos» (`body-medium`).

## Estados
| Estado | Cómo se expresa |
|---|---|
| Enabled | Reposo, colores del rol. |
| Hovered | Capa de estado del color del contenido a `state-hover` (8 %). |
| Focused | Capa a `state-focus` (10 %) + anillo `focus-ring-width` en `acento`, separado `focus-ring-offset`. |
| Pressed | Capa a `state-pressed` (10 %). |
| Dragged | No aplica. |
| Disabled | Contenido `on-surface` al 38 % (`state-disabled-content`), contenedor `on-surface` al 12 % (`state-disabled-container`). |
| Selected | No aplica. |

## Tokens
Divisor `outline-variant` · avatar `surface-container-highest` · alto 72 dp (chat), 88 dp (favorito), 56 dp (ajustes).
