Librería de estilos y componentes de **setena**, la app para conectar músicos de Barcelona. Recoge el estado del wireframe «Wireframe App Music (FIDELIDAD MEDIA)» a 25/11: cada componente corresponde a un elemento real del wireframe y dice en qué pantallas aparece.

## Marca
- **Nombre:** «setena», siempre en minúsculas, en **Nunito Bold** (decisión del equipo, 18/11).
- **Símbolo:** cinco puntos morados (`palette-primary-40`) alrededor de dos círculos lima unidos (`acento`): la marca con la que termina la animación de entrada. Archivo en el grupo de recursos «Logo».
- **Logotipo en la app:** símbolo de 24 dp + «setena» a 22 px, separados 8 dp, en la barra superior de Explorar, Favoritos, Chats y Mi perfil.
- **Lema de Inicio:** «Conecta con músicos en tu misma frecuencia.», con «Conecta» en peso 700 y lima.

## Fuentes y prioridad
1. **Wireframe App Music (FIDELIDAD MEDIA)**: qué componentes existen, su contenido, sus colores y su nomenclatura.
2. **Tokens del wireframe** (`ds/appmusic/tokens.json` del lienzo): colores del JSON de Material Theme Builder (semilla `#5540C4`) con los ajustes manuales del equipo del 17/11.
3. **Roboto** para la interfaz y **Nunito Bold** solo para el nombre de la marca.
4. **Material Design 3 Expressive**: escala tipográfica, forma, espaciado, elevación, estados, motion y anatomía.

Si dos fuentes se contradicen, manda la de número más bajo y el conflicto se anota en «Pendientes y conflictos».

## Cómo leer esta librería
- **Fundamentos:** Color, Tipografía, Forma, espaciado y elevación, Motion e Iconografía.
- **Componentes:** una ficha por componente con anatomía, variantes, estados, tokens y pantallas del wireframe. Las vistas previas usan las fotos de ejemplo del equipo (grupo «Fotos de ejemplo»).
- **Mapa del wireframe:** qué componente usa cada pantalla.
- **Pendientes y conflictos:** lo que falta decidir o verificar.
- **«PROPUESTA – pendiente de validar por el equipo»** marca lo que todavía no ha decidido el equipo. **«a verificar»** marca valores de M3 Expressive no confirmados.

## Reglas de uso
- **Solo modo oscuro.** El modo claro se eliminó el 25/11.
- Usa siempre tokens, nunca hex ni px sueltos: color por rol, texto por estilo, forma por `corner-*`, espacio por `space-*`.
- **Lima** (`accion-destacada` / `acento`) solo para el botón principal relleno y los indicadores de «activo».
- **Un botón relleno por pantalla o ventana**, con una excepción: «Ver perfil» en cada tarjeta de Explorar (decisión del 18/11). Junto a ellas, «Regístrate» va solo con contorno lima.
- **Seleccionado** = tonal con degradado vertical de un solo tono (`secondary-container-alto` → `secondary-container`), más icono relleno o check: nunca solo color.
- **Rojo** solo para errores y acciones destructivas; nunca en insignias.
- Sobre fotos, texto e iconos siempre en una pastilla `surface` opaca.
- Los errores llevan borde de 2 dp `error`, icono y texto debajo del campo.
- Áreas táctiles de 48 dp como mínimo; margen lateral 16 dp; rejilla de 4 dp.
- Textos: los del wireframe, tal cual. Nombres, fotos, importes y títulos de vídeo son contenido de ejemplo, no datos de la investigación.

## Tono del contenido
Tuteo, frases cortas y directas, tono cercano («Conecta con músicos en tu misma frecuencia.», «¡La música se disfruta más en comunidad!», «¡Aún no tienes favoritos!»). Los errores explican qué pasa y cómo arreglarlo. Las acciones destructivas siempre piden confirmación.

## Fuera del alcance
No se incluyen componentes para Búsqueda urgente, Mi disponibilidad (sección completa) ni Mis contactos (fuera del prototipo, decisión del 10/11), ni valoraciones o recomendaciones.
