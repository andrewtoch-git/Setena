# Campo de texto
Entrada de texto con etiqueta, texto de ayuda y error.

**Pantallas:** Registro, Iniciar sesión, Recuperar contraseña, Editar perfil, Ajustes — cambiar contraseña, Ventana de registro (inicio de sesión).
**M3 Expressive:** Outlined text field. Estándar.

## Campos del wireframe
Nombre · Correo electrónico (`nombre@correo.com`) · Contraseña («Crea una contraseña», «Mínimo 8 caracteres.») · Repite la contraseña · Sobre mí (multilínea, «¡Cuéntale a la comunidad sobre ti…!») · Tarifas: Bolo / Directo, Grabación, Composición (`Ej.: 120 €`, sufijo «por actuación / por hora / por proyecto»), Otros («Especificar») · Redes sociales («Enlace a tu Instagram»… con marcador de marca) · Título del vídeo.

## Anatomía
1. Contenedor 56 dp, borde 1 dp `outline`, `corner-extra-small`.
2. Etiqueta (`body-small` cuando flota; `body-large` en reposo vacío).
3. Texto introducido / texto de apoyo `body-large`.
4. Elemento inicial (marcador de red) o final (icono de error, sufijo de unidad).
5. Texto de ayuda o de error `body-small`.

## Variantes
Una línea · multilínea («Sobre mí») · con sufijo (tarifas) · con elemento inicial (redes).

## Estados
| Estado | Cómo se expresa |
|---|---|
| Enabled | Borde 1 dp `outline`. |
| Hovered | Borde 1 dp `on-surface`. |
| Focused | Borde 2 dp `acento`, etiqueta `acento`, cursor `acento`. |
| Error | Borde 2 dp `error`, icono `error`, texto de error debajo («Este campo es obligatorio», «Introduce un correo válido (nombre@correo.com)»). Nunca solo color. |
| Disabled | Borde y texto `on-surface` al 12 % / 38 %. |
| Pressed / Dragged / Selected | No aplica. |
