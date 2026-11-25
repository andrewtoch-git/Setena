# Pendientes y conflictos

## 0. Actualización del 25/11 (setena)
La librería se ha puesto al día con el wireframe de fidelidad media:
- Nombre «setena», logotipo (símbolo + Nunito Bold) y barra superior con logotipo.
- Colores del sistema definitivo del 17/11, solo modo oscuro (el claro se eliminó el 25/11). Sustituyen a la paleta gris de `material-theme (1).json` (semilla `#808080`), así que el conflicto C3 y la sección 5 quedan superados.
- Fotos de ejemplo de los siete perfiles en las vistas previas.
- «Ver perfil» relleno en cada tarjeta de Explorar y «Regístrate» con contorno lima.
- Decidido el 25/11: los puntos del logotipo son `#5C48CB` (`palette-primary-40`) en todas partes, también en la animación de Inicio. Contraste sobre el fondo de 2,86:1: válido solo para el símbolo decorativo.
- Decidido el 25/11: la animación de Inicio dura unos 1 s, en versión simplificada (sin el compás 4/4 ni los nodos que se alejan). La nota del lienzo ya lo recoge, con el nombre «setena» bajo la marca.

Limpieza del lienzo (25/11, sin cambios visibles):
- Archivos `Guardados.dc.html` y `Guardados-vacio.dc.html` renombrados a `Favoritos.dc.html` y `Favoritos-vacio.dc.html`, con todos los enlaces corregidos (barra inferior, «Volver» desde los perfiles, destino tras registrarse). Resuelve C9.
- Quitado el código del selector de tema que ya no hacía nada: todas las pantallas fijan el modo oscuro.
- Revisadas las insignias: todas usan `acento`; ninguna en rojo.

Pendiente de decidir por el equipo:
- Nombre del botón: «Favorito» / «Añadir a Favoritos» en las pantallas; la Guía visual del lienzo todavía dice «Guardado».
- La Guía visual y la hoja Componentes del lienzo no recogen la excepción de «Ver perfil» relleno en lima en las tarjetas: siguen con la regla «un relleno por pantalla» y muestran «Ver perfil» en degradado morado.
- «Reintentar», «Regístrate» (aviso de Explorar sin registro) y el botón de enviar del chat no van fijos al pie con 56 dp.
- Anillo de foco: el wireframe dibuja 2 px; el token `focus-ring-width` dice 3 px.
- En las pruebas con usuarios, comprobar si «setena» se llega a leer en la animación de 1 s.
- El lienzo se sigue llamando «Wireframe App Music (FIDELIDAD MEDIA)» y su copia de la librería está en `ds/appmusic/`; la Guía visual también dice «App Music». Se mantienen para no romper rutas hasta que el equipo decida.
- El degradado tonal no es un token de esta librería (el formato de tokens no admite degradados; ver Color), pero el lienzo sí tiene `degradado-tonal` en sus tokens. Es coherente; solo hay que tenerlo en cuenta al pasar a código.

## 1. Conflictos entre fuentes
| # | Conflicto | Fuentes | Decisión aplicada |
|---|---|---|---|
| C1 | El enunciado pide el botón «Guardar» / «Guardado» (corazón vacío/lleno); el wireframe, en los ajustes del 12/11 (tarde), lo llama «Añadir a Favoritos» / «Favorito». | Enunciado vs. wireframe (1) | Se sigue el wireframe. En el wireframe «Guardar» solo existe en la ventana de selección de chips y «Guardar cambios» en Editar perfil. |
| C2 | El enunciado pide un botón «Aplicar filtros»; el wireframe muestra «Mostrar N músicos» y solo «Aplicar filtros (sin resultados)» cuando no hay coincidencias. | Enunciado vs. wireframe (1) | Se sigue el wireframe. |
| C3 | (Superado el 17/11.) El wireframe usaba negro para el botón principal y el JSON gris daba `primary`. | — | Sistema de color definitivo: botón principal lima, insignias `acento`. |
| C4 | El wireframe usa Inter con tamaños de 11 a 24 px. | Wireframe vs. Roboto (3) y escala M3 (4) | Roboto con la escala M3. La propia Guía visual del wireframe dice que la tipografía es provisional. |
| C5 | Chips con forma de píldora (999 px) y 36 px de alto en el wireframe; M3 usa `corner-small` (8 dp) y 32 dp. | Wireframe vs. M3 (4) | M3: el wireframe no define forma ni tamaño. Área táctil de 48 dp garantizada. |
| C6 | Áreas táctiles de 44 px en el wireframe; M3 exige 48 dp. | Wireframe vs. M3 | 48 dp. |
| C7 | Las ventanas del wireframe apilan un botón relleno a todo el ancho + «Cancelar»; M3 coloca botones de texto alineados a la derecha. | Wireframe vs. M3 | M3, salvo la Ventana de registro (dos caminos de igual peso), marcada como PROPUESTA. |
| C8 | Contorno del botón y del chip: M3 Expressive usa `outline-variant`, que sobre `surface` (1,97:1) no llega al 3:1 de WCAG para límites de control. | M3 vs. requisito WCAG del enunciado | Se usa `outline` (5,82:1 sobre `surface` en modo oscuro, el único esquema). |
| C9 | (Resuelto el 25/11.) El archivo del wireframe se llamaba «Guardados» pero la pantalla y la barra dicen «Favoritos». | Nomenclatura interna del wireframe | Se usa «Favoritos»; los archivos se han renombrado a `Favoritos*.dc.html`. |

## 2. Valores marcados «a verificar»
- Pesos de las variantes **Emphasized** de la tipografía (500 / 700).
- **Tamaños de botón XS–XL**: alto, padding, icono, esquina cuadrada y esquina pulsada.
- Valores de `corner-large-increased` (20), `corner-extra-large-increased` (32) y `corner-extra-extra-large` (48).
- Valores de **sombra** de los niveles de elevación 1–5 y el nivel asignado a la barra de navegación y a la barra de búsqueda en M3 Expressive.
- Altura de la **barra de navegación** M3 Expressive (64 dp; M3 base: 80 dp).
- Separación entre columnas en compact (8 dp).
- Grosor (3 dp) y separación (2 dp) del **anillo de foco**.
- Muelles del **esquema expresivo** (0.6/800, 0.8/380, 0.8/200). Los del esquema estándar sí están confirmados.
- Secuencia de formas del **indicador de carga** de M3 Expressive.
- Color del texto y del contorno del botón con contorno en M3 Expressive.

## 3. Propuestas pendientes de validar por el equipo
- Iconos **Material Symbols Rounded** (frente a Outlined) y el símbolo elegido para cada icono, en especial `payments` y `handshake` para los tipos de proyecto.
- Asignación de **tamaños de botón**: S en tarjetas y ventanas, M para la acción principal fija.
- **Barra superior**: «medium flexible» para Favoritos, Chats y Mi perfil; variante de Chat con avatar.
- **Filtros de búsqueda** como diálogo a pantalla completa (alternativa: hoja inferior).
- **Carrusel** hero con puntos y sin flechas (los puntos no forman parte del carrusel M3).
- **Cabecera de perfil** como composición.
- **Selector de instrumento / géneros**: campo de solo lectura + ventana con chips.
- **Etiqueta** no interactiva (sin equivalente M3).
- **Subida de vídeo** como composición; mensaje temporal con indicador de progreso.
- **Burbuja de mensaje** y **campo de envío** (sin componente M3).
- **Aviso** (banner) y **estado vacío** (M3 no los define).
- Colores del **Botón Favorito** seleccionado (tonal + forma cuadrada).
- Muelle expresivo con rebote solo para el corazón de Favorito.
- Ventana de registro con acciones apiladas.
- Fila de iconos de redes en la Ventana de Compartir.

## 4. Elementos del wireframe que no se han convertido en componente
- **Iconos oficiales de redes sociales** (Instagram, YouTube, Spotify, TikTok, SoundCloud, WhatsApp, Facebook): Material Symbols no incluye logotipos de marca. Se mantienen las letras del wireframe hasta descargar el kit de marca de cada red.
- **Fotos**: desde el 18/11 hay fotos de ejemplo de los siete perfiles (grupo «Fotos de ejemplo»). Solo el primer vídeo de cada perfil tiene imagen; el resto siguen como marcadores.
- **Zona de estado del móvil** (64 px superiores del wireframe): la pinta el sistema operativo; no es un componente.
- **Pantalla de Bienvenida**: la lista de tres consejos («Busca por instrumento, estilo, zona o disponibilidad.»…) se resuelve con icono + texto `body-medium`, sin componente propio.
- **Hojas «Componentes» y «Guía visual» del wireframe**: se usan como fuente del inventario; los valores de su Guía visual (grises, Inter, radios) quedan sustituidos por esta librería.

## 5. Observaciones sobre el JSON gris anterior (superadas el 17/11)
- El tono 99 de `neutral` y `neutral-variant` es `#F6FEFF`, ligeramente azulado y fuera de la secuencia de grises. Puede ser un efecto del generador; conviene revisarlo en Material Theme Builder.
- La paleta es acromática (semilla `#808080`): `primary`, `secondary` y `tertiary` solo se diferencian por luminosidad. Si el equipo quiere un color de marca, hay que volver a exportar el JSON desde Material Theme Builder con otra semilla; esta librería no lo cambia.
