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

## Decisiones delegadas (25/11)
El equipo delegó en Claude estas decisiones para poder avanzar. Se pueden revisar en cualquier momento.

| Tema | Decisión | Motivo |
|---|---|---|
| Chat | **Tiempo real con WebSocket (socket.io), implementado.** REST sigue siendo la fuente de verdad. | Coste real bajo sobre el chat REST ya probado; detalles en `docs/evaluacion-websocket.md`. |
| Búsqueda libre | Sinónimos de rol: «pianista» → Piano, «guitarrista» → Guitarra, etc. | La gente escribe así, aunque los roles se nombran por instrumento. |
| Bloquear | Al bloquear a alguien se quita de tus Favoritos y no vuelve al desbloquear. | Coherente con «no podrá escribirte ni ver tu perfil». |
| Vídeo aplazado | La tarjeta y el carrusel muestran la **miniatura/foto principal sin botón de reproducir**; si no hay imagen, el marcador de foto del wireframe. No se añade texto nuevo. | No inventar textos ni pantallas. |
| Textos «hasta 100 MB» del wireframe | Se mantienen hasta que se implemente el vídeo; entonces pasan a «hasta 30 s». | Hoy la subida de vídeo no existe. |
| Conflictos C5–C7 (wireframe vs. M3) | Se mantiene M3: chips de 8 dp, **áreas táctiles de 48 dp**, botones de ventana de M3. | 48 dp es el mínimo de accesibilidad de Android; bajar a 44 empeora la app. |
| Login con Google en la app | Aplazado hasta configurar el OAuth de Google. El wireframe de «Iniciar sesión» no tiene botón de Google (manda el wireframe); el backend ya lo soporta. | Sin el ID de cliente no se puede probar. |
| «¿Has olvidado tu contraseña?» | No aparece hasta tener un servicio de correo para enviar el enlace. | Un enlace que no funciona confunde en las pruebas con usuarios. |
| Búsqueda | Se escribe directamente en la barra de Explorar (resultados mientras escribes), en vez de abrir una pantalla aparte. | Menos pasos; mismo resultado que el wireframe «Explorar-busqueda». |
| Fotos por perfil | Máximo 10 fotos, JPG o PNG de hasta 10 MB | Cabe en el clúster gratuito M0 (512 MB) con margen. |
| `applicationId` Android | `cat.setena.app` | La marca es «setena» y el proyecto es de Barcelona. |
| Ionic vs. nativo (fase 5) | Ionic es **aceptable** si en un Android de gama media: (1) el scroll de Explorar con 30 tarjetas va a 60 fps sin tirones visibles, (2) abrir una ficha tarda < 300 ms desde el toque, (3) el botón Atrás y el teclado se comportan como en una app nativa en todas las pantallas, y (4) los componentes cumplen el design system (color, Roboto, formas, estados). Si falla (1) o (3), plan B nativo. | Criterios medibles y ligados a la experiencia real. |

## Pendiente
- Nada bloqueante. Las propuestas de diseño de la librería siguen en `design/design-system/07-Pendientes.md`.
