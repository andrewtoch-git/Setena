# Color

**Solo modo oscuro** (el modo claro se eliminó el 25/11). Colores del JSON de Material Theme Builder (semilla `#5540C4`, export en el lienzo como `ds/appmusic/material-theme.json`) con los ajustes manuales del equipo del 17/11, más cuatro tokens propios: `accion-destacada`, `acento`, sus «on-» y `secondary-container-alto`. Son los mismos valores que usa el wireframe.

## Cómo usar los roles
| Para… | Rol | En el wireframe |
|---|---|---|
| Fondo de pantalla | `surface` | Todas |
| Texto principal / secundario | `on-surface` / `on-surface-variant` | Todas |
| Botón principal relleno | `accion-destacada` + `on-accion-destacada` (lima) | Chat del perfil, Regístrate gratis, Guardar cambios… y «Ver perfil» en cada tarjeta de Explorar |
| «Activo» en trazos e indicadores | `acento` (lima) | Pestaña Info/Tarifas, punto del carrusel, interruptor, casillas, foco de campos, insignias, corazones de Favoritos, contorno de «Añadir a Favoritos» y de «Regístrate», círculos de confirmación, «Conecta» en Inicio |
| Seleccionado (tonal) | degradado vertical `secondary-container-alto` → `secondary-container` + `on-secondary-container` | «Favorito», chips seleccionados, indicador de la barra inferior, etiqueta «Principal» |
| Etiqueta de la pestaña activa | `secondary` | Barra inferior |
| Errores y acciones destructivas | `error`, `on-error`, `error-container` | Errores de campo, «Eliminar», «Cerrar sesión», «Enviar denuncia». Nunca en insignias ni en Favoritos. |
| Bordes de control / decorativos | `outline` / `outline-variant` | Campos, chips y «Chat» / tarjetas y divisores |
| Avisos flotantes | `inverse-surface` + `inverse-on-surface` (también su icono y su acción) | «Has quitado a … de Favoritos · Deshacer» |
| Velo de ventanas | `state-scrim` (negro al 32 %) | Ventanas modales y de registro, a pantalla completa |
| Símbolo del logotipo | puntos `palette-primary-40`, par unido `acento` | Barra superior, animación de Inicio |

## Reglas
- **Lima solo en dos usos:** relleno del botón principal y trazos o indicadores de «activo». Nunca como fondo grande ni en texto largo.
- **Un botón relleno por pantalla o ventana.** Excepción decidida por el equipo (18/11): «Ver perfil» va relleno en cada tarjeta de Explorar. Por eso, en Explorar sin registro, «Regístrate» va solo con contorno lima.
- **El degradado solo en lo seleccionado**, siempre vertical y de un solo tono (`secondary-container-alto` arriba → `secondary-container` abajo). El degradado no es un token (el formato de tokens no admite degradados): se escribe en el CSS con esos dos roles.
- Rojo solo para errores y acciones destructivas.
- Lo seleccionado nunca se marca solo con color: añade icono relleno, check o cambio de forma.
- Nunca hex sueltos en las pantallas: siempre el rol.

## Roles
| Rol | Valor | Uso |
|---|---|---|
| `primary` | `#C8BFFF` | Índigo base de la marca. Las pantallas no lo usan directamente: usan accion-destacada o acento. |
| `surface-tint` | `#C8BFFF` | Tinte de superficie (M3). Sin uso directo: la elevación se expresa con surface-container-*. |
| `on-primary` | `#30285F` | Texto e iconos sobre primary. |
| `primary-container` | `#442CB3` | Contenedor de énfasis medio (sin uso asignado en el wireframe). Ajuste manual en oscuro: JSON #463F77 → #442CB3 (tono 30 de la paleta primary). |
| `on-primary-container` | `#E5DEFF` | Texto e iconos sobre primary-container. |
| `secondary` | `#D2BCFD` | Etiqueta de la pestaña activa de la barra inferior. |
| `on-secondary` | `#38265C` | Texto e iconos sobre secondary. |
| `secondary-container` | `#562AA3` | Seleccionado (tonal): chips con check, chips de filtros activos (con X), indicador de la barra inferior, «Ver perfil», «Favorito» guardado y etiqueta «Principal». Se pinta con degradado-tonal encima. Nunca como color de texto. Ajuste manual en oscuro: JSON #4F3D74 → #562AA3 (tono 30 de la paleta secondary). |
| `secondary-container-alto` | `#6B47BB` | Token propio (no viene del Theme Builder; en Android, color extendido). Color de arriba del degradado tonal. #6B47BB (valor fijado por el equipo). El degradado tonal (de este color arriba a secondary-container abajo, vertical) se escribe en el CSS: linear-gradient(180deg, var(--secondary-container-alto), var(--secondary-container)). |
| `on-secondary-container` | `#EADDFF` | Texto e iconos sobre secondary-container y sobre degradado-tonal. |
| `tertiary` | `#C8BFFF` | Rol terciario (sin uso asignado; igual que primary). |
| `on-tertiary` | `#30285F` | Texto e iconos sobre tertiary. |
| `tertiary-container` | `#442CB3` | Contenedor terciario (sin uso asignado). Ajuste manual en oscuro: JSON #463F77 → #442CB3 (tono 30 de la paleta tertiary). |
| `on-tertiary-container` | `#E5DEFF` | Texto e iconos sobre tertiary-container. |
| `error` | `#FFB4AB` | Errores (borde y texto de campo, «No se ha enviado», avisos de error) y acciones destructivas: Eliminar cuenta, Cerrar sesión, Bloquear, Enviar denuncia, Eliminar foto o vídeo. Nunca en insignias ni en Favoritos. |
| `on-error` | `#690005` | Texto sobre error (botón de acción destructiva). |
| `error-container` | `#93000A` | Fondo del aviso de error de formulario («Faltan campos obligatorios…»). |
| `on-error-container` | `#FFDAD6` | Texto e icono sobre error-container. |
| `background` | `#141318` | Fondo de pantalla (equivale a surface en M3). |
| `on-background` | `#E5E1E9` | Texto sobre background. |
| `surface` | `#141318` | Fondo de todas las pantallas, barra superior, tarjeta con contorno. |
| `on-surface` | `#E5E1E9` | Texto principal sobre surface y todos los surface-container-*. |
| `surface-variant` | `#48454F` | Variante de superficie (M3 heredado; preferir surface-container-highest). |
| `on-surface-variant` | `#C9C5D0` | Texto secundario (rol, ubicación, última actividad), iconos inactivos, placeholder. |
| `outline` | `#928F99` | Bordes que identifican un control: campo de texto, chip sin seleccionar, botón con contorno (incluido «Chat» en las tarjetas de Explorar), casilla sin marcar. Cumple 3:1 sobre surface. |
| `outline-variant` | `#48454F` | Divisores de lista y borde decorativo de la tarjeta (no identifica controles: no exige 3:1). |
| `shadow` | `#000000` | Color de sombra de los niveles de elevación. |
| `scrim` | `#000000` | Color base del velo de ventanas modales (se usa al 32 % mediante state-scrim). |
| `inverse-surface` | `#E5E1E9` | Fondo de los avisos flotantes (snackbars). |
| `inverse-on-surface` | `#313036` | Texto, icono y acción subrayada («Deshacer», «Reintentar») de los avisos flotantes (decisión del 17/11). |
| `inverse-primary` | `#5C48CB` | Sin uso asignado en las pantallas. Ajuste manual en oscuro: JSON #5E5791 → #5C48CB (tono 40 de la paleta primary). |
| `primary-fixed` | `#E5DEFF` | Rol fijo (M3). Sin uso asignado. |
| `on-primary-fixed` | `#1B1249` | Texto sobre primary-fixed. |
| `primary-fixed-dim` | `#C8BFFF` | Rol fijo atenuado. Sin uso asignado. |
| `on-primary-fixed-variant` | `#463F77` | Texto de menor énfasis sobre primary-fixed. |
| `secondary-fixed` | `#EADDFF` | Rol fijo. Sin uso asignado. |
| `on-secondary-fixed` | `#220F46` | Texto sobre secondary-fixed. |
| `secondary-fixed-dim` | `#D2BCFD` | Rol fijo atenuado. Sin uso asignado. |
| `on-secondary-fixed-variant` | `#4F3D74` | Texto de menor énfasis sobre secondary-fixed. |
| `tertiary-fixed` | `#E5DEFF` | Rol fijo. Sin uso asignado. |
| `on-tertiary-fixed` | `#1B1249` | Texto sobre tertiary-fixed. |
| `tertiary-fixed-dim` | `#C8BFFF` | Rol fijo atenuado. Sin uso asignado. |
| `on-tertiary-fixed-variant` | `#463F77` | Texto de menor énfasis sobre tertiary-fixed. |
| `surface-dim` | `#141318` | Superficie más oscura del rango (M3). Sin uso asignado. |
| `surface-bright` | `#3A383E` | Superficie más clara del rango (M3). Sin uso asignado. |
| `surface-container-lowest` | `#0E0D13` | Contenedor más bajo: miniatura del vídeo antes de cargar. |
| `surface-container-low` | `#1C1B20` | Hoja inferior y tarjeta elevada (nivel 1). |
| `surface-container` | `#201F25` | Barra de navegación inferior (nivel 2). |
| `surface-container-high` | `#2A292F` | Ventanas modales, barra de búsqueda, campo de mensaje, burbuja recibida (nivel 3). |
| `surface-container-highest` | `#35343A` | Tarjeta rellena, etiquetas («Proyectos remunerados»), aviso de bloqueo, marcador de foto/avatar, burbuja enviada, pista del interruptor apagado. |
| `accion-destacada` | `#D4F06A` | Token propio (en Android, color extendido). Botón principal relleno: uno por pantalla o ventana. Lima #D4F06A. |
| `on-accion-destacada` | `#1A1D00` | Token propio. Texto e icono del botón principal: #1A1D00. |
| `acento` | `#D4F06A` | Token propio. Trazos e indicadores de «activo»: pestaña activa, punto del carrusel, interruptor encendido, casillas marcadas, foco de campos, contorno de «Añadir a Favoritos», insignias de cantidad, corazones de Favoritos, iconos y enlaces de acento, círculos de confirmación. Lima #D4F06A. |
| `on-acento` | `#1A1D00` | Token propio. Texto o icono sobre acento (número de la insignia, check de la casilla, icono del símbolo de marca): #1A1D00. |
| `state-scrim` | `rgba(0,0,0,0.32)` | Velo de ventanas modales y hojas: scrim (#000000) al 32 % (opacidad M3). |

Las paletas tonales completas (`palette-primary-0` … `palette-neutral-variant-100`) están en los tokens; solo `palette-primary-40` tiene uso (puntos del logotipo).

## Contraste WCAG AA (modo oscuro)
| Par | Ratio | Mínimo |
|---|---|---|
| `on-accion-destacada` / `accion-destacada` | 13,50:1 | 4,5 |
| `acento` / `surface` | 14,50:1 | 4,5 |
| `acento` / `surface-container` (barra inferior) | 12,83:1 | 3 |
| `on-acento` / `acento` (insignias, check) | 13,50:1 | 4,5 |
| `on-secondary-container` / `secondary-container` | 7,22:1 | 4,5 |
| `on-secondary-container` / `secondary-container-alto` (parte alta del degradado) | 5,02:1 | 4,5 |
| `secondary` / `surface-container` | 9,62:1 | 4,5 |
| `on-surface` / `surface` | 14,33:1 | 4,5 |
| `on-surface-variant` / `surface` | 10,90:1 | 4,5 |
| `on-surface-variant` / `surface-container-highest` | 7,27:1 | 4,5 |
| `inverse-on-surface` / `inverse-surface` | 10,13:1 | 4,5 |
| `on-error` / `error` | 7,72:1 | 4,5 |
| `error` / `surface` | 10,89:1 | 4,5 |
| `outline` / `surface` | 5,82:1 | 3 |

No cumplen, y por eso no se usan para texto ni como único límite de un control:
- `outline-variant` / `surface`: 1,97:1 (solo divisores y el borde decorativo de la tarjeta).
- `palette-primary-40` / `surface`: 2,86:1 (solo los puntos del símbolo, que es decorativo).

Sobre las fotos, el texto y los iconos van siempre en una pastilla `surface` opaca (nombre en la tarjeta, rótulo del vídeo, botón de reproducir, «Añadir», «Eliminar»), para no depender de la imagen.
