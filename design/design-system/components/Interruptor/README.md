# Interruptor
Activa o desactiva un ajuste al instante.

**Pantallas:** Ajustes (Notificaciones: «Mensajes nuevos — Aviso cuando alguien te escribe», «Novedades de la app — Consejos y nuevas funciones»).
**M3 Expressive:** Switch. Estándar.

## Anatomía
Pista 52 × 32 dp, `corner-full`; tirador 16 dp (apagado), 24 dp (encendido), 28 dp (pulsado). Toda la fila es el área táctil (`role="switch"`, `aria-checked`).

## Estados
| Estado | Cómo se expresa |
|---|---|
| Enabled | Reposo, colores del rol. |
| Hovered | Capa de estado del color del contenido a `state-hover` (8 %). |
| Focused | Capa a `state-focus` (10 %) + anillo `focus-ring-width` en `acento`, separado `focus-ring-offset`. |
| Pressed | Capa a `state-pressed` (10 %) y el tirador crece a 28 dp con `spring-spatial-fast`. |
| Dragged | No aplica. |
| Disabled | Contenido `on-surface` al 38 % (`state-disabled-content`), contenedor `on-surface` al 12 % (`state-disabled-container`). |
| Selected | Encendido: pista `acento`, tirador `surface`. Apagado: pista `surface-container-highest` con borde 2 dp `outline`, tirador `outline`. |
