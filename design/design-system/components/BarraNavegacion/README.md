# Barra de navegación inferior
Barra fija con las cuatro pestañas principales: Explorar, Favoritos, Chats y Mi perfil.

**Pantallas:** Explorar (y sus estados), Favoritos, Chats, Chat, Mi perfil, Editar perfil, Ajustes. No aparece en Inicio, Registro, Iniciar sesión ni Bienvenida.
**M3 Expressive:** Navigation bar (vertical, «short»). Estándar.

## Anatomía
1. Contenedor (`surface-container`, nivel 2, altura `navigation-bar-height` 64 dp — a verificar; M3 base: 80 dp).
2. Indicador activo (56 × 32 dp, `corner-full`, degradado tonal (`secondary-container-alto` → `secondary-container`)).
3. Icono 24 dp: FILL 1 en la pestaña activa.
4. Etiqueta (`label-medium`): Explorar · Favoritos · Chats · Mi perfil.
5. Insignia de no leídos en Chats (`acento` / `on-acento`, `label-small`), con la etiqueta accesible «Chats, 1 mensaje sin leer».

## Variantes
- Con / sin insignia de mensajes sin leer.
- Sin registro: las pestañas Favoritos, Chats y Mi perfil abren la Ventana de registro (regla del 10/11).

## Estados
| Estado | Cómo se expresa |
|---|---|
| Enabled | Reposo, colores del rol. |
| Hovered | Capa de estado del color del contenido a `state-hover` (8 %). |
| Focused | Capa a `state-focus` (10 %) + anillo `focus-ring-width` en `acento`, separado `focus-ring-offset`. |
| Pressed | Capa a `state-pressed` (10 %). |
| Dragged | No aplica. |
| Disabled | Contenido `on-surface` al 38 % (`state-disabled-content`), contenedor `on-surface` al 12 % (`state-disabled-container`). |
| Selected | Indicador con degradado tonal (`secondary-container-alto` → `secondary-container`), icono relleno `on-secondary-container`, etiqueta `secondary` en `label-medium-emphasized` (PROPUESTA). |

## Tokens
| Parte | Color | Tipo | Forma |
|---|---|---|---|
| Contenedor | `surface-container` | — | `corner-none` |
| Indicador | degradado tonal (`secondary-container-alto` → `secondary-container`) | — | `corner-full` |
| Icono inactivo / activo | `on-surface-variant` / `on-secondary-container` | — | — |
| Etiqueta | `on-surface-variant` / `secondary` | `label-medium` | — |
| Insignia | `acento` / `on-acento` | `label-small` | `corner-full` |

## Uso
- Siempre las cuatro pestañas, en este orden y con estos textos.
- Cambio de pestaña: fade through con `spring-effects-default`.
