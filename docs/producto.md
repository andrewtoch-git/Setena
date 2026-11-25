# setena — decisiones de producto

> Fuente de verdad para Claude Code. Solo recoge lo **decidido por el equipo** o lo que está en el wireframe de fidelidad media (25/11).
> Lo que no aparece aquí no está decidido: **pregunta antes de implementarlo**.
> Las marcas «PROPUESTA – pendiente de validar por el equipo» indican lo que aún no está aprobado.

## Qué es
App móvil (Android primero) para que músicos del área de Barcelona encuentren y validen a otros músicos (vídeo, géneros, tarifas) antes de contactar por chat.

- Nombre: **setena**, siempre en minúsculas, en Nunito Bold. Símbolo en `design/design-system/assets/Logo/setena-simbolo.svg`.
- Lema de Inicio: «Conecta con músicos en tu misma frecuencia.» («Conecta» en peso 700 y lima).

## Stack (decidido 25/11)
| Parte | Decisión |
|---|---|
| Frontend | **Ionic + Angular** + Capacitor, modo `md`, Android primero |
| Backend | NestJS, desplegado en Render |
| Base de datos | MongoDB Atlas |
| Archivos (fotos y vídeos) | **En MongoDB** (GridFS). Ver límites en `docs/datos-mock.md` |
| Vídeos | **Por ahora no se implementan** (decisión del 25/11). Cuando se hagan: **máximo 30 s** por vídeo |
| Login | **Correo + contraseña** y **Google** |
| Chat | **Tiempo real con WebSocket** (socket.io). Evaluación en `docs/evaluacion-websocket.md` |
| Plan B | Nativo Kotlin + Jetpack Compose si Ionic no cumple los criterios de la fase 5 |

## Navegación
Barra inferior con 4 pestañas: **Explorar · Favoritos · Chats · Mi perfil**.
- Explorar: barra de búsqueda «Buscar músicos» (texto libre que aplica filtros automáticamente), chips rápidos de instrumento, botón Filtros, lista de tarjetas → Perfil de músico.
- Perfil de músico: carrusel (vídeo/fotos), cabecera, «Añadir a Favoritos» / «Favorito», pestañas **Info / Tarifas**, botón «Chat», Compartir, Más opciones (Denunciar, Bloquear).
- Favoritos: lista con quitar + «Deshacer».
- Chats: lista de conversaciones con insignia de no leídos → Chat.
- Mi perfil: igual que el perfil público + «Editar perfil», añadir/eliminar foto o vídeo, marcar vídeo principal, Ajustes.
- Ajustes: correo, cambiar contraseña, notificaciones (Mensajes nuevos, Novedades de la app), Cerrar sesión, Eliminar cuenta.
- Inicio (sin sesión): animación de entrada de ~1 s, «Regístrate gratis», «Iniciar sesión», X para explorar sin cuenta. Bienvenida tras registrarse.

Mapa completo de pantallas: `design/handoff/canvas.json` y `design/design-system/06-Mapa-del-wireframe.md`.

## Reglas sin registro
- Se puede: **Explorar, buscar, filtrar y ver perfiles**.
- Piden registro o inicio de sesión (Ventana de registro): **Favoritos, Chats, «Chat» desde un perfil, «Añadir a Favoritos»** y Mi perfil.
- Sesión caducada: ventana «Tu sesión ha caducado».

## Perfil de músico
| Campo | Regla |
|---|---|
| Nombre | Obligatorio. **No se puede editar** después del registro |
| Instrumento o rol | Multiselección, lista cerrada (abajo). Obligatorio |
| Géneros musicales | Multiselección, lista cerrada (abajo). Obligatorio |
| Tipo de proyecto | Proyectos remunerados y/o Colaboraciones gratuitas |
| Ubicación | Zona: Barcelona ciudad / Alrededores + barrio o municipio |
| Disponibilidad | Multiselección: Inmediata, El próximo fin de semana, Esta semana, La próxima semana, Este mes |
| Sobre mí | Texto libre opcional |
| Tarifas | Las escribe el músico: Bolo / Directo (por actuación), Grabación (por hora), Composición (por proyecto), Otros (texto). «A convenir» permitido. Texto fijo: «Precios orientativos. El precio final se acuerda por chat.» |
| Redes | Instagram, YouTube, Spotify, TikTok, SoundCloud |
| Vídeo | En el diseño es **obligatorio en el registro** y uno es el «Principal». **Aplazado:** de momento no hay subida de vídeos, así que el registro no lo exige. Límite futuro: 30 s (el texto del wireframe «hasta 100 MB» queda desfasado) |
| Fotos | JPG o PNG, hasta 10 MB |
| Última actividad | Se muestra («Última actividad: hace 2 h») |

### Listas cerradas (copiar literalmente)
- **Roles:** Cantante, Corista, Piano, Teclado, Guitarra, Bajo, Batería, Percusión, Saxofón, Trompeta, Trombón, Flauta, Clarinete, Violín, Violonchelo, Contrabajo, Acordeón, Arpa, DJ, Productor/a musical, Beatmaker, Compositor/a, Arreglista, Otros.
- **Géneros:** Pop, Rock, Indie, Alternativo, Metal, Punk, Reggae, Ska, Dub, Dancehall, Soul, R&B, Funk, Jazz, Blues, Hip-Hop, Rap, Electrónica, House, Techno, Drum & Bass, Disco, Clásica, Flamenco, Salsa, Merengue, Bachata, Reguetón, Latin Pop, Cumbia, Tango, Folk, Country, Gospel, Música experimental, Otros.
- **Chips rápidos de Explorar:** Guitarra, Piano, Teclado, Cantante, Bajo, Batería, DJ.
- **Motivos de denuncia:** Perfil falso o suplantación, Contenido inapropiado, Spam o publicidad, Otro motivo.

En formato JSON: `mock-data/catalogos.json`.

## Filtros
Secciones: Instrumento o rol · Estilo musical · Ubicación (Barcelona ciudad / Alrededores) · Disponibilidad · Tipo de proyecto. Botón «Mostrar N músicos»; si no hay coincidencias, «Aplicar filtros (sin resultados)». Chips de filtros aplicados con X y «Borrar todo».

## Bloquear y denunciar
- Bloquear: la otra persona no puede escribirte ni ver tu perfil; no se le avisa. Aviso con «Desbloquear».
- Denunciar: un motivo de la lista; anónimo («No le diremos quién ha enviado la denuncia»).

## Nomenclatura
- Roles por instrumento: «Piano», no «Pianista».
- «Favoritos», no «Guardados». Botón: «Añadir a Favoritos» / «Favorito».
- Textos de la interfaz en español, tuteo, frases cortas; copiar los del wireframe tal cual.

## Diseño
- **Solo modo oscuro.**
- Colores por rol, nunca hex sueltos. Tokens: `design/handoff/ds/appmusic/tokens.css` (los de la librería, `design/design-system/tokens.css`, están desfasados hasta que se regeneren).
- Lima (`accion-destacada` / `acento`, #D4F06A) solo para el botón principal relleno y los indicadores de «activo».
- Un botón relleno por pantalla. Excepción: «Ver perfil» relleno en cada tarjeta de Explorar; por eso «Regístrate» va con contorno lima.
- Seleccionado = degradado vertical `secondary-container-alto` → `secondary-container` + icono relleno o check.
- Rojo solo para errores y acciones destructivas; nunca en insignias.
- Roboto para la interfaz; Nunito Bold solo para «setena». Iconos Material Symbols Rounded (PROPUESTA). Áreas táctiles de 48 dp.

## Fuera del prototipo
Búsqueda urgente, Mi disponibilidad (sección completa), Mis contactos, valoraciones y recomendaciones, notificaciones push.

## Pendiente de decidir
- Qué muestran el carrusel y la tarjeta de Explorar mientras no haya vídeos (propuesta: la miniatura/foto como marcador).
- Criterios concretos de «aceptable» para decidir Ionic vs. nativo (fase 5).
- Diseño: en caso de conflicto **manda el wireframe** (decisión del 25/11). Anillo de foco 2 px en `acento`; botones al pie como dibuja cada pantalla.
- `applicationId` de Android (depende del nombre definitivo; la marca es «setena»).
