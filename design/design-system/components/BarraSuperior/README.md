# Barra superior
Cabecera de cada pantalla: logotipo en las pestañas principales y flecha atrás + título en las secundarias.

**Pantallas:** Explorar, Favoritos, Chats, Mi perfil y sus variantes sin registro (con logotipo); Perfil de músico, Editar perfil, Ajustes, Filtros de búsqueda, Iniciar sesión, Registro (secundaria); Chat (variante de conversación).
**M3 Expressive:** Top app bar. La barra con logotipo y la variante Chat son PROPUESTA – pendiente de validar por el equipo.

## Variantes
| Variante | Pantallas | Contenido |
|---|---|---|
| Con logotipo | Explorar, Favoritos, Chats, Mi perfil (+ sin registro) | Símbolo (24 dp de alto) + «setena» en Nunito Bold 22 px (`logo-barra`), separación 8 dp, alineado a la izquierda con el margen de 16 dp. Barra de 56 dp bajo la zona de estado. Debajo, el título grande de la pestaña (`headline-medium`) con 24 dp de aire; en Explorar, el buscador y los chips. |
| Secundaria | Perfil, Editar perfil, Ajustes, Filtros | Icono atrás + título `title-large` + acciones (Compartir perfil, Más opciones). |
| Chat | Chat | Icono atrás + avatar 40 dp con foto + nombre (`title-medium`) + «Ver perfil» (`body-small`); todo el bloque abre el perfil. Acción: Más opciones. |

## Logotipo en la barra
- Símbolo: 5 puntos `palette-primary-40` alrededor del par unido en `acento` (lima). Es la marca con la que termina la animación de Inicio.
- Nombre: «setena», siempre en minúsculas, `on-surface`.
- Proporción: el símbolo es un poco más alto que las letras (como en la referencia del equipo), para que ninguno de los dos pese más.
- El nombre es texto real (lectores de pantalla) y el símbolo es decorativo (`aria-hidden`).

## Estados
- En reposo: `surface`, nivel 0. Al desplazar el contenido: `surface-container`, nivel 2.
- Los botones de icono siguen los estados de «Botón de icono».

## Tokens
Contenedor `surface`/`surface-container` · título `on-surface` · iconos `on-surface-variant` · nombre de la marca `logo-barra`.
