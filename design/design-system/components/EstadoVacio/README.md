# Estado vacío y de error
Pantalla o zona sin contenido, con explicación y una acción para continuar.

**Pantallas:** Favoritos — vacío, Chats — vacío, Explorar — sin resultados, Explorar — error de carga, Perfil — no disponible, Recuperar contraseña (enviado).
**M3 Expressive:** M3 no define un componente de estado vacío. PROPUESTA – pendiente de validar por el equipo.

## Variantes del wireframe
| Variante | Icono | Título | Texto | Acción |
|---|---|---|---|---|
| Favoritos vacío | `favorite` | ¡Aún no tienes favoritos! | Encuentra y guarda músicos que te inspiren. | Explorar músicos |
| Chats vacío | `chat_bubble` | ¡Tu bandeja está vacía! | Conecta con otros músicos y empieza a conversar. | Buscar músicos |
| Sin resultados | `search` | No hay músicos con estos filtros | Prueba a quitar algún filtro o a elegir otro instrumento. | Quitar filtros |
| Error de carga | `error` | No se ha podido cargar el catálogo | Revisa tu conexión a internet e inténtalo de nuevo. | Reintentar |
| Perfil no disponible | `error` | Este perfil ya no está disponible | Puede que la persona haya eliminado su cuenta o haya cambiado su privacidad. | Volver a Explorar |
| Correo enviado (Recuperar contraseña) | `check_circle` | Revisa tu correo | Si {{correo}} tiene una cuenta, recibirás un enlace para crear una contraseña nueva. | Volver a iniciar sesión |

## Anatomía
Icono 48 dp `on-surface-variant` · título `title-medium` · texto `body-medium` · botón relleno S. Aparece con `spring-effects-slow`.
