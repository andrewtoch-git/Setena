# Botón
Acción con texto. Un solo botón relleno por pantalla o ventana, con una excepción: «Ver perfil» en cada tarjeta de Explorar.

**Pantallas:** todas. Ejemplos: «Ver perfil» y «Chat» (tarjeta), «Chat» (perfil), «Editar perfil», «Guardar cambios», «Guardar» (diálogo de selección), «Registrarme», «Iniciar sesión», «Regístrate gratis», «Regístrate» (aviso de Explorar sin registro), «Mostrar N músicos», «Reintentar», «Explorar músicos», «Empezar a explorar».
**M3 Expressive:** Button (filled, tonal, outlined, text) con tamaños XS–XL, forma redonda o cuadrada y morph al pulsar. Estándar.

## Variantes
| Variante | Colores | Uso en setena |
|---|---|---|
| Relleno (`filled`) | `accion-destacada` / `on-accion-destacada` (lima) | Acción principal: Chat (perfil), Guardar cambios, Registrarme, Iniciar sesión, Regístrate gratis, Mostrar N músicos. **Excepción:** «Ver perfil» en cada tarjeta de Explorar. |
| Tonal | degradado vertical `secondary-container-alto` → `secondary-container` / `on-secondary-container` | Seleccionado: «Favorito», chips seleccionados, indicador de la barra inferior, etiqueta «Principal». |
| Contorno acento (`outlined acento`) | borde 1,5 dp y texto `acento` | Llamada a la acción secundaria: «Añadir a Favoritos», «Regístrate» en el aviso de Explorar sin registro. |
| Con contorno | borde 1 dp `outline`, texto `on-surface` | Secundaria neutra: Chat (tarjeta), Editar perfil, Iniciar sesión (junto a Regístrate gratis), Añadir vídeo. |
| Texto | `acento` | Terciaria: Borrar filtros, Cancelar, ¿Has olvidado tu contraseña?, Quitar, Hacer principal. En avisos flotantes: `inverse-on-surface` subrayado («Deshacer»). |
| Destructivo | relleno `error` / `on-error` en las ventanas de confirmación; texto `error` en listas | «Eliminar», «Cerrar sesión», «Enviar denuncia»; fila «Eliminar cuenta». Nunca en insignias ni en Favoritos. |

## Tamaños M3 Expressive (a verificar)
| Tamaño | Alto | Padding lateral | Icono | Texto | Esquina cuadrada | Esquina pulsado |
|---|---|---|---|---|---|---|
| XS | 32 | 12 | 20 | `label-large` | 12 | 8 |
| S | 40 | 16 | 20 | `label-large` | 12 | 8 |
| M | 56 | 24 | 24 | `title-medium` | 16 | 12 |
| L | 96 | 48 | 32 | `headline-small` | 28 | 16 |
| XL | 136 | 64 | 40 | `headline-large` | 28 | 16 |

En el wireframe los botones miden 40 dp (S). La acción principal fija al pie de 56 dp (M) está pendiente en «Reintentar», «Regístrate» y el botón de enviar del chat. XS y S necesitan área táctil de 48 dp.

## Anatomía
1. Contenedor (`corner-full` redondo por defecto). 2. Icono inicial opcional. 3. Etiqueta.

## Estados
| Estado | Cómo se expresa |
|---|---|
| Enabled | Reposo, colores del rol. |
| Hovered | Capa del color del contenido a `state-hover` (8 %). |
| Focused | Capa a `state-focus` (10 %) + anillo en `acento` (el wireframe usa 2 px; el token `focus-ring-width` dice 3 px). |
| Pressed | Capa a `state-pressed` (10 %) y la esquina pasa a la de «pulsado» (morph con `spring-spatial-fast`). |
| Disabled | Contenido `on-surface` al 38 %, contenedor `on-surface` al 12 %. |
| Selected | Solo en botones de alternar (ver «Botón Favorito»). |

## Contraste (modo oscuro)
`on-accion-destacada` sobre `accion-destacada` 13,50:1 · `on-secondary-container` sobre el degradado 5,02:1 (arriba) y 7,22:1 (abajo) · `acento` sobre `surface` 14,50:1 · `outline` sobre `surface` 5,82:1.
