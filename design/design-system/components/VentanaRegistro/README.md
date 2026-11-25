# Ventana de registro / inicio de sesión
Aparece sin cuenta al tocar Perfil, Chat, Favoritos, Chats o Mi perfil; permite registrarse o iniciar sesión sin salir.

**Pantallas:** Perfil — sin registro (los 6 músicos), Favoritos — sin registro, Chats — sin registro, Mi perfil — sin registro.
**M3 Expressive:** Dialog (basic). Estándar.

El velo `state-scrim` cubre toda la pantalla, también la barra superior con el logotipo (corregido el 18/11); la barra de navegación inferior queda por encima y se puede usar. Arriba a la derecha, botón de icono «Cerrar» para seguir explorando sin cuenta.

## Anatomía — paso 1
1. Título «¡La música se disfruta más en comunidad!»
2. Texto «Regístrate, conecta con otros músicos y descubre nuevas personas con las que compartir tu pasión por la música.»
3. Botón relleno «Regístrate gratis» (`accion-destacada`) → Registro.
4. Botón con contorno «Iniciar sesión» → paso 2.

## Anatomía — paso 2
1. Título «Inicia sesión para continuar».
2. Campos «Correo electrónico» y «Contraseña» (errores: «Introduce tu correo electrónico», «Introduce tu contraseña»).
3. Botón de texto «¿Has olvidado tu contraseña?»
4. Botón relleno «Iniciar sesión»; botón de texto «Volver».
5. Al entrar se vuelve a lo que se quería ver (regla del 10/11).

> Excepción a M3: aquí las acciones van apiladas a todo el ancho porque son dos caminos de igual peso y textos largos. PROPUESTA – pendiente de validar por el equipo.

## Aviso «Únete a la comunidad» (Explorar sin registro)
Tarjeta con contorno sobre la lista: título «Únete a la comunidad» (`title-medium`), texto «Regístrate gratis para ver perfiles, guardar músicos y chatear.» (`body-small`) y botón «Regístrate» **solo con contorno**: borde 1,5 dp, texto `acento`, esquina `corner-medium`. Va sin relleno para no competir con los «Ver perfil» rellenos de las tarjetas (decisión del equipo, 18/11).
