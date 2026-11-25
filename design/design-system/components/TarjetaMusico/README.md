# Tarjeta de músico
Resultado del catálogo en Explorar: vídeo, nombre, datos clave, etiquetas y los botones Chat y Ver perfil.

**Pantallas:** Explorar y todos sus estados de filtro y búsqueda (con y sin registro).
**M3 Expressive:** Card (outlined). Estándar.

## Anatomía
1. Media 16:9 con la miniatura del vídeo principal a sangre (`object-fit: cover`); sin foto, marcador `surface-container-highest`. Encima, sobre fondo `surface` opaco: chip con avatar de 24 dp y nombre (arriba a la izquierda) y botón circular «Reproducir vídeo de {nombre}» (centro).
2. Rol (`title-medium`) y «Última actividad: hace 1 h» (`body-small`, a la derecha): «Cantante».
3. Metadatos (`body-small`): «Géneros: Pop · Soul», «Ubicación: Sant Martí, Barcelona», «Disponibilidad: Esta semana · El próximo fin de semana».
4. Etiquetas: «Proyectos remunerados», «Colaboraciones gratuitas» (solo las que tenga el músico).
5. Acciones S: «Chat» (con contorno `outline`) y «Ver perfil» (relleno `accion-destacada`, lima), a partes iguales.

> **Excepción a «un botón relleno por pantalla»** (decisión del equipo, 18/11): en las listas de tarjetas cada tarjeta lleva su «Ver perfil» relleno. Fuera de las tarjetas la regla se mantiene.

## Variantes
- Con ambas etiquetas, con una, perfil mínimo (Disponibilidad: «No indicada»).
- Sin registro: Chat y Ver perfil abren la Ventana de registro.

## Estados
La tarjeta no es pulsable entera; los estados son los de sus botones.

## Tokens
Contenedor `surface` + borde `outline-variant` (decorativo) · `corner-medium` · padding `space-16` · separación entre tarjetas `space-12` · nivel 0.
