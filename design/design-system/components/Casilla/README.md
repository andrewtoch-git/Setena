# Casilla y botón de opción
Marcar una o varias opciones en listas y formularios.

**Pantallas:** Registro («Acepto las condiciones de uso y la política de privacidad»), Enviar a un chat (elegir chats), Denunciar perfil (motivo, opción única).
**M3 Expressive:** Checkbox y Radio button. Estándar.

## Usos
- Casilla: aceptar condiciones (error: «Debes aceptar las condiciones para crear tu cuenta»); filas de «Enviar a un chat» (el wireframe usa un círculo con check; M3 usa casilla).
- Opción única: motivos de denuncia — «Perfil falso o suplantación», «Contenido inapropiado», «Spam o publicidad», «Otro motivo».

## Anatomía
Caja 18 dp (radio 20 dp) dentro de un área táctil de 48 dp + etiqueta `body-large`.

## Estados
| Estado | Cómo se expresa |
|---|---|
| Enabled | Reposo, colores del rol. |
| Hovered | Capa de estado del color del contenido a `state-hover` (8 %). |
| Focused | Capa a `state-focus` (10 %) + anillo `focus-ring-width` en `acento`, separado `focus-ring-offset`. |
| Pressed | Capa a `state-pressed` (10 %). |
| Dragged | No aplica. |
| Disabled | Contenido `on-surface` al 38 % (`state-disabled-content`), contenedor `on-surface` al 12 % (`state-disabled-container`). |
| Selected | Casilla `acento` + check `on-acento`; opción con anillo y punto `acento`. |
Error: borde o relleno `error` + texto de error debajo.
