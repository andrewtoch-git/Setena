# Motion
Tokens de muelle (spring) de M3 Expressive y las interacciones de setena que los usan; pulsa cada fila para ver el muelle simulado.

**Pantallas:** Explorar, Filtros, Perfil de músico, Favoritos, Chats, Mi perfil.

## Tokens
Formato del valor: `damping stiffness`. Esquema **estándar** (sin rebote) confirmado en la documentación de Material Components Android. Esquema **expresivo** (con rebote): **a verificar**.

| Token | Damping | Stiffness | Uso |
|---|---|---|---|
| `spring-spatial-fast` | 0.9 | 1400 | Indicador de pestaña Info/Tarifas, check del chip, morph del botón al pulsar. |
| `spring-spatial-default` | 0.9 | 700 | Abrir Filtros de búsqueda y ventanas modales (Compartir, registro), entrada del mensaje temporal, deslizar el carrusel. |
| `spring-spatial-slow` | 0.9 | 300 | Transición entre pantallas (Explorar → Perfil → Chat): eje compartido horizontal. |
| `spring-effects-fast` | 1 | 3800 | Relleno del corazón Favorito, color del chip seleccionado, capas de estado. |
| `spring-effects-default` | 1 | 1600 | Fundido del velo de las ventanas; cambio de contenido Info ↔ Tarifas y entre pestañas de la barra inferior (fade through). |
| `spring-effects-slow` | 1 | 800 | Aparición del indicador de carga y de los estados vacíos. |
| `spring-expressive-spatial-fast` | 0.6 | 800 | PROPUESTA: escala del corazón al marcar Favorito (único rebote de la app). |

## Interacciones
- **Abrir Filtros:** el panel entra desde abajo con `spatial-default`; el contenido de Explorar se atenúa con `effects-default`. Al aplicar («Mostrar N músicos»), sale con el mismo muelle.
- **Añadir a Favoritos:** el icono pasa de FILL 0 a FILL 1 con `effects-fast`; el botón cambia de redondo a cuadrado con `spatial-fast`; el mensaje temporal «Añadido a Favoritos» entra con `spatial-default`.
- **Transición entre pantallas:** eje compartido X con `spatial-slow` para el desplazamiento y `effects-default` para el fundido. Entre pestañas de la barra inferior: fade through con `effects-default`.
- Respeta «Reducir movimiento» del sistema: sustituye los desplazamientos por fundidos.
