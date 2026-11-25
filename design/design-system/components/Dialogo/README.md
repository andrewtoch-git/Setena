# Ventana modal
Ventana sobre un velo para confirmar, elegir o informar.

**Pantallas:** Perfil y Chat (Más opciones, Denunciar perfil, Gracias por avisarnos, ¿Bloquear a…?, Has bloqueado a…), Ajustes (¿Cerrar sesión?, ¿Eliminar tu cuenta?), Editar perfil (¿Salir sin guardar?, Cambios guardados), Compartir (¡Perfil enviado!), Enviar a un chat, Explorar — sesión caducada.
**M3 Expressive:** Dialog (basic). Estándar.

## Anatomía
1. Velo `state-scrim` (scrim al 32 %).
2. Contenedor `surface-container-high`, `corner-extra-large`, nivel 3, padding 24 dp, ancho 280–560 dp.
3. Icono opcional en confirmaciones de éxito: círculo con contorno de 2 dp `acento` y check `acento`.
4. Título `headline-small`.
5. Texto `body-medium` `on-surface-variant`.
6. Contenido opcional: lista de opciones, casillas, botones de opción.
7. Acciones alineadas a la derecha: botones de texto. Las acciones destructivas de confirmación («Eliminar», «Cerrar sesión», «Enviar denuncia») van en relleno `error`/`on-error` en el wireframe.

## Variantes
| Variante | Ejemplo | Acciones |
|---|---|---|
| Confirmación | «¿Bloquear a Marta Ruiz?» | Cancelar · Bloquear |
| Destructiva | «¿Eliminar tu cuenta?» | Cancelar · Eliminar cuenta |
| Sesión caducada | «Tu sesión ha caducado» — «Por seguridad, vuelve a iniciar sesión para seguir usando tu cuenta.» | Seguir sin cuenta · Iniciar sesión |
| Resultado | «¡Perfil enviado!», «Gracias por avisarnos», «Cambios guardados» | Aceptar / Ver mi perfil |
| Lista de opciones | «Más opciones»: Denunciar perfil, Bloquear a Marta Ruiz | Cancelar |
| Selección | «Denunciar perfil» (opción única), «Enviar a un chat» (casillas) | Cancelar · Enviar denuncia / Enviar (desactivado sin selección) |

> **Diferencia con el wireframe:** el wireframe apila un botón relleno a todo el ancho + «Cancelar». M3 coloca botones de texto a la derecha. Se sigue M3 (la disposición de acciones no la define el wireframe); se puede volver a la disposición apilada si el equipo lo prefiere — PROPUESTA – pendiente de validar por el equipo.

## Estados
Apertura `spring-spatial-default` (contenedor) + `spring-effects-default` (velo). Botones: ver «Botón».
