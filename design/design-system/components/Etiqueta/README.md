# Etiqueta e insignia
Marcas no pulsables: tipo de proyecto, «Principal» y números de no leídos o filtros aplicados.

**Pantallas:** Explorar (tarjeta), Perfil de músico, Mi perfil, Editar perfil y Registro («Principal»), Chats y barra inferior (insignia), barra de búsqueda (número de filtros).
**M3 Expressive:** la insignia es Badge (estándar). La etiqueta no tiene equivalente M3 no interactivo: se basa en la anatomía del Assist chip sin estados — PROPUESTA – pendiente de validar por el equipo.

## Etiqueta
- 24 dp de alto, `corner-small`, `surface-container-highest` + `on-surface`, `label-medium`, icono 16 dp opcional.
- Textos: «Proyectos remunerados», «Colaboraciones gratuitas», «Principal».
- No tiene estados (no se pulsa); no debe parecer un chip: sin borde.

## Insignia
- Grande: 16 dp, `corner-full`, `acento`/`on-acento`, `label-small` («1», «2»). Pequeña: punto de 6 dp.
- El wireframe la pintaba negra; con el JSON pasa a `error`, el único color con tono de la paleta.
- Siempre acompañada de texto accesible («Chats, 1 mensaje sin leer», «1 mensaje sin leer»).
