# Aviso
Mensaje fijo dentro de la pantalla para errores de formulario, de servidor o de bloqueo.

**Pantallas:** Registro — campos obligatorios, Registro — correo ya registrado, Iniciar sesión — datos incorrectos, Editar perfil — error al guardar, Ajustes — contraseña actual incorrecta, Perfil y Chat bloqueados.
**M3 Expressive:** M3 no incluye banner. PROPUESTA – pendiente de validar por el equipo.

## Variantes
| Variante | Colores | Ejemplo | Acción |
|---|---|---|---|
| Error | `error-container` / `on-error-container`, icono `error` | «Faltan campos obligatorios. Revisa los campos marcados.», «El correo o la contraseña no son correctos. Revísalos o recupera tu contraseña.», «No se han podido guardar los cambios. Revisa tu conexión e inténtalo de nuevo.» | «Reintentar» (al guardar) |
| Bloqueo | `surface-container-highest` / `on-surface`, icono `block` | «Has bloqueado a Marc Soler. No podrá escribirte ni ver tu perfil.» | «Desbloquear» |

## Anatomía
Icono 24 dp · texto `body-medium` · acción de texto opcional · `corner-medium` · padding 12/16 dp. Errores con `role="alert"`.
