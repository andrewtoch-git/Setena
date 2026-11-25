# Tipografía

**Roboto** (Google Fonts) para toda la interfaz, con la escala de M3. Pila: `Roboto, "Helvetica Neue", Arial, sans-serif` (familia `brand`).

**Nunito Bold** (Google Fonts, peso 700) solo para el nombre de la marca, «setena», siempre en minúsculas (familia `logo`, decisión del equipo del 18/11):
| Estilo | Tamaño / interlineado | Peso | Tracking | Dónde |
|---|---|---|---|---|
| `logo-barra` | 22 / 22 | 700 | −0,2 | Barra superior de Explorar, Favoritos, Chats y Mi perfil, junto al símbolo de 24 dp |
| `logo-inicio` | 58 / 64 | 700 | −0,4 | Animación de entrada de Inicio, bajo el símbolo |

Nunito no se usa en ningún otro texto.

## Escala base M3
| Estilo | Tamaño / interlineado | Peso | Tracking |
|---|---|---|---|
| `display-large` | 57 / 64 | 400 | −0,25 |
| `display-medium` | 45 / 52 | 400 | 0 |
| `display-small` | 36 / 44 | 400 | 0 |
| `headline-large` | 32 / 40 | 400 | 0 |
| `headline-medium` | 28 / 36 | 400 | 0 |
| `headline-small` | 24 / 32 | 400 | 0 |
| `title-large` | 22 / 28 | 400 | 0 |
| `title-medium` | 16 / 24 | 500 | 0,15 |
| `title-small` | 14 / 20 | 500 | 0,1 |
| `body-large` | 16 / 24 | 400 | 0,5 |
| `body-medium` | 14 / 20 | 400 | 0,25 |
| `body-small` | 12 / 16 | 400 | 0,4 |
| `label-large` | 14 / 20 | 500 | 0,1 |
| `label-medium` | 12 / 16 | 500 | 0,5 |
| `label-small` | 11 / 16 | 500 | 0,5 |

## Variantes Emphasized (M3 Expressive)
Mismo tamaño, interlineado y tracking que su estilo base; solo sube el peso. Nombre: `<estilo>-emphasized`.
**Los pesos son a verificar:** M3 Expressive publica los tokens `md.sys.typescale.emphasized.*`, pero no he podido confirmar los valores en una fuente oficial. Valores usados: 500 para display, headline, `title-large` y body; 700 para `title-medium`, `title-small` y label.

## Qué estilo usa cada texto del wireframe
| Texto del wireframe | Estilo |
|---|---|
| «Conecta con músicos en tu misma frecuencia.» (Inicio; «Conecta» en peso 700 y `acento`) y título de pestaña principal: Explorar, Favoritos, Chats, Mi perfil | `headline-medium` |
| Saludo de Bienvenida («¡Tu cuenta está lista!») | `headline-small` |
| Título de pantalla de formulario: Iniciar sesión, Crear cuenta | `headline-small` |
| Título de ventana: «Compartir perfil», «¿Bloquear a Marta Ruiz?», «Más opciones» | `headline-small` |
| Título de barra superior: Perfil, Editar perfil, Ajustes, Filtros | `title-large` |
| Nombre del músico en el perfil: «Marta Ruiz» | `title-large-emphasized` |
| Nombre en tarjeta de Explorar y en cabecera del chat | `title-medium` |
| Títulos de sección: Sobre mí, Disponibilidad, Redes sociales | `title-medium` |
| Importe de tarifa: «120 €» | `title-medium-emphasized` |
| Pestañas: Info / Tarifas, Barcelona ciudad / Alrededores; títulos de sección de Filtros | `title-small` |
| Nombre en filas de Chats y Favoritos; servicio de tarifa («Bolo / Directo») | `body-large` |
| Texto de las burbujas de chat; texto escrito en campos; «Buscar músicos», «Escribe un mensaje» | `body-large` |
| Rol y géneros: «Guitarra · Rock, Indie»; texto de «Sobre mí»; vista previa del mensaje; texto de ventanas y mensajes temporales | `body-medium` |
| Vista previa de mensaje sin leer | `body-medium-emphasized` |
| Ubicación, «Última actividad: hace 2 h», metadatos de la tarjeta, ayudas y errores de campo, «Enviado», «Precios orientativos…» | `body-small` |
| Texto de todos los botones (Chat, Ver perfil, Guardar, Editar perfil…) y chips (instrumento, género, disponibilidad) | `label-large` |
| Botón Favorito seleccionado («Favorito») | `label-large` (PROPUESTA: `label-large-emphasized`) |
| Etiquetas de la barra inferior; etiquetas «Proyectos remunerados», «Colaboraciones gratuitas», «Principal»; «EN TUS CHATS», «FUERA DE LA APP» | `label-medium` |
| Número de insignias; hora en la fila de chat | `label-small` |

## Reglas
- No mezcles pesos fuera de la escala: para destacar, usa la variante Emphasized del mismo estilo.
- Texto de párrafo con interlineado de la escala; ancho máximo cómodo en pantallas de 360–412 dp.
- Los tamaños del wireframe (Inter, 11–24 px) eran provisionales: la Guía visual del wireframe dice que la tipografía definitiva se decide en fidelidad media.
