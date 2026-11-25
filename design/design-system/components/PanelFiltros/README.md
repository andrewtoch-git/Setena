# Filtros de búsqueda
Panel a pantalla completa con secciones de chips de selección múltiple y el botón que aplica los filtros.

**Pantallas:** Filtros de búsqueda, Filtros de búsqueda (sin registro), Referencia — Filtros completo.
**M3 Expressive:** Full-screen dialog con Filter chips. El wireframe lo muestra a pantalla completa; una hoja inferior sería la alternativa: PROPUESTA – pendiente de validar por el equipo.

## Anatomía
1. Barra superior: `arrow_back` «Volver sin aplicar», título «Filtros», botón de texto «Borrar filtros».
2. Secciones con título (`title-small`) y chips con salto de línea:
   - Instrumento o rol (24 opciones), Estilo musical (36), Ubicación (Barcelona ciudad, Alrededores), Disponibilidad (Inmediata, El próximo fin de semana, Esta semana, La próxima semana, Este mes), Tipo de proyecto (Proyectos remunerados, Colaboraciones gratuitas).
3. Barra inferior con botón relleno a todo el ancho: «Mostrar N músicos» o «Aplicar filtros (sin resultados)».

## Variantes
Sin selección · con selección · sin resultados (el botón cambia de texto, no se desactiva).

## Estados
Los de «Chip» y «Botón». Apertura y cierre con `spring-spatial-default`.

## Tokens
Fondo `surface` · títulos `title-small` `on-surface` · botón relleno `accion-destacada`/`on-accion-destacada` · divisor de la barra inferior `outline-variant`.
