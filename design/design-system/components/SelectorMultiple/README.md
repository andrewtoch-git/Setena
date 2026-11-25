# Selector de instrumento / géneros
Campo que muestra lo elegido y abre una ventana con chips de selección múltiple y el botón «Guardar».

**Pantallas:** Registro, Editar perfil, Mi perfil — editar, instrumento o rol, Mi perfil — editar, géneros musicales.
**M3 Expressive:** no existe un selector múltiple estándar. Se propone campo con contorno de solo lectura (como el Exposed dropdown menu) + Dialog con Filter chips. PROPUESTA – pendiente de validar por el equipo.

## Anatomía
1. Campo: etiqueta «Instrumento o rol» / «Géneros musicales», valor («Piano», «Jazz, Soul») o texto de apoyo «Elige uno o varios» / «Elige tus estilos», icono `arrow_drop_down`.
2. Ventana: título («Instrumento o rol» / «Géneros musicales»), botón «Cerrar», texto «Marca todas las opciones que quieras.», chips (24 roles / 36 estilos), botón «Guardar».
3. Error: «Este campo es obligatorio».

## Estados
Campo: los de «Campo de texto» (focus al abrir). Chips: los de «Chip». La ventana entra con `spring-spatial-default`.
