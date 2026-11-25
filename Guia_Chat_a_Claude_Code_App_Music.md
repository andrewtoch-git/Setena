# App Music — Del chat a Claude Code (terminal)

> Guía de paso a código · actualizada el 25/11/2026
> Stack: **NestJS** (backend en **Render**) · **MongoDB** (Atlas) · **Ionic + Capacitor** (frontend, Android primero) → plan B: **nativo**

---

## 0. Qué tenemos y qué hay que llevar a la terminal

| Origen (claude.ai) | Qué es | Cómo llega a Claude Code |
|---|---|---|
| **Wireframe App Music (FIDELIDAD MEDIA)** — Design | Las pantallas actuales | *Export → Hand off to Claude Code* (o .zip / HTML) |
| **App Music** — Design System | Tokens M3 (6 esquemas), Roboto, forma, motion, iconos, 30 componentes | Igual: export / handoff |
| `claude/material-theme.json` (docs del proyecto) | JSON de Material Theme Builder | Descargarlo a `design/` |
| Decisiones del chat (navegación, reglas sin registro, campos del perfil, roles, géneros, disponibilidad…) | Contexto de producto | **No se transfiere solo** → hay que escribirlo en `docs/producto.md` y `CLAUDE.md` |

**Idea clave:** Claude Code no ve este chat ni la memoria del proyecto de claude.ai. Todo lo que no esté en archivos del repositorio, no existe para él.

---

## 1. Requisitos previos (una vez por persona del equipo)

- [ ] Plan de Claude **Pro, Max, Team o Enterprise** (o cuenta de Claude Console con créditos).
- [ ] **Git** y una cuenta de **GitHub** (repositorio compartido del equipo).
- [ ] **Node.js LTS** (lo necesitan NestJS e Ionic; Claude Code nativo no lo necesita).
- [ ] Cuenta en **MongoDB Atlas** (clúster gratuito M0).
- [ ] Cuenta en **Render** conectada a GitHub.
- [ ] **Android Studio** (para compilar y probar con Capacitor en emulador o móvil).
- [ ] Windows: instalar **Git for Windows** o trabajar en **WSL**.

---

## 2. Instalar Claude Code

**macOS / Linux / WSL**
```bash
curl -fsSL https://claude.ai/install.sh | bash
```

**Windows PowerShell**
```powershell
irm https://claude.ai/install.ps1 | iex
```

Alternativas: `brew install --cask claude-code` · `winget install Anthropic.ClaudeCode`
(Homebrew y WinGet **no** se actualizan solos; el instalador nativo sí.)

Comprobar y entrar:
```bash
claude --version
cd ~/proyectos/app-music
claude          # la primera vez abre el navegador para iniciar sesión
```

---

## 3. Crear el repositorio (monorepo)

```bash
mkdir app-music && cd app-music
git init
mkdir backend mobile design docs
```

Estructura objetivo:
```
app-music/
├── CLAUDE.md            ← instrucciones permanentes para Claude Code
├── docs/
│   ├── producto.md      ← decisiones del equipo (sale de este chat)
│   └── datos-mock.md    ← modelo de datos acordado
├── design/
│   ├── handoff/         ← export del Design (wireframe fidelidad media)
│   ├── design-system/   ← export del Design System "App Music"
│   └── material-theme.json
├── backend/             ← NestJS
└── mobile/              ← Ionic + Capacitor
```

Crear el repo en GitHub y hacer el primer push antes de empezar a generar código: así cada fase queda en commits y se puede volver atrás.

---

## 4. Sacar el diseño de Claude Design

### Opción A — Handoff directo (recomendada)
1. Abrir el artefacto **Wireframe App Music (FIDELIDAD MEDIA)**.
2. **Export → Hand off to Claude Code…**
3. Elegir **Send to local coding agent** (terminal) o **Send to Claude Code Web**.
4. Copiar el comando que aparece y pegarlo en la sesión de `claude` abierta **dentro de `app-music/`**.
5. Repetir con el Design System **App Music**.

El handoff no envía capturas: envía un *bundle* con estructura de componentes, tokens, jerarquía de layout y assets.

### Opción B — Si el handoff falla o no aparece
- **Export → Download as .zip** (o *standalone HTML*) y descomprimir en `design/handoff/` y `design/design-system/`.
- Descargar `material-theme.json` del proyecto de claude.ai a `design/`.

> ⚠️ Ojo: el handoff está pensado sobre todo para pasar UI a código. El backend, la autenticación y la base de datos no vienen en el bundle: hay que pedírselos a Claude Code por fases (sección 7).

---

## 5. Pasar el contexto de este chat a archivos

### `docs/producto.md` — qué debe contener
Solo decisiones **tomadas** por el equipo (no hipótesis):

- Arquitectura de información: BUSCAR (Explorar, Buscador, Filtros, Resultados → Ficha de músico) · PERFIL (Mi perfil, Editar perfil) · CHATS · FAVORITOS.
- **Fuera del prototipo por ahora:** Búsqueda urgente, Mi disponibilidad, Mis contactos, valoraciones.
- **Sin registro:** solo Explorar, barra de búsqueda y filtros. Favoritos, Chats y Chat desde un perfil → ventana de registro / inicio de sesión.
- Barra de búsqueda con texto libre que aplica filtros automáticamente.
- Perfil: Sobre mí, instrumento o rol (multiselección), géneros (multiselección), tarifas por servicio escritas por el músico (Bolo/Directo, Grabación, Composición, Otros), disponibilidad (Inmediata, Esta semana, El próximo fin de semana, La próxima semana, Este mes), redes (Instagram, YouTube, Spotify, TikTok, SoundCloud), **vídeo obligatorio en el registro**. El nombre no se puede editar.
- Listas cerradas de **roles** y **géneros** (copiar literalmente las acordadas).
- Nomenclatura: roles por instrumento ("Piano", no "Pianista"); "Favoritos", no "Guardados".
- Color: primary #5540C4 · secondary #8C64DC · lima #D4F06A como "Acción destacada" solo en modo oscuro · nunca tonos oliva.

> Puedo generar este `producto.md` completo a partir de lo documentado en el proyecto si lo queréis.

### `CLAUDE.md` — plantilla inicial
Ejecutar `/init` dentro de `claude` y luego añadir/editar:

```markdown
# App Music
App móvil (Android primero) para que músicos del área de Barcelona encuentren
y validen a otros músicos (multimedia, géneros, recomendaciones) antes de contactar.

## Fuentes de verdad
- Diseño: design/handoff y design/design-system. No inventar pantallas ni componentes.
- Producto: docs/producto.md. Si algo no está ahí, PREGUNTAR antes de implementarlo.
- Tokens de color: design/material-theme.json (Material 3).

## Stack
- backend/: NestJS + Mongoose + MongoDB Atlas. Despliegue en Render.
- mobile/: Ionic + Capacitor, modo "md" (Material). Android primero.

## Reglas
- Textos de la interfaz en español, con la nomenclatura de docs/producto.md.
- Secretos solo en variables de entorno; nunca commitear .env.
- Antes de cada fase: proponer plan y esperar aprobación.
- Cada fase termina con tests que pasan y un commit.
- Datos mock: solo vía script de seed, marcados como ficticios.
```

---

## 6. Datos mock — propuesta de objetos (a validar por el equipo)

> Esto es **una interpretación mía** a partir de las decisiones del wireframe, no una decisión del equipo.

| Colección | Campos principales |
|---|---|
| **users** | `_id`, `email` (único), `passwordHash`, `createdAt`, `lastActivityAt`, `refreshTokenHash` |
| **musicianProfiles** | `userId`, `name`, `photoUrl`, `about`, `roles[]`, `genres[]`, `location` (barrio/ciudad), `availability` (enum de 5 valores), `rates[]` (`service`, `price`, `unit`, `note`), `videoUrl` (obligatorio), `audioUrls[]`, `socialLinks` (instagram, youtube, spotify, tiktok, soundcloud), `paidProjects` (bool), `collaborations` (bool) |
| **favorites** | `userId`, `profileId`, `createdAt` |
| **conversations** | `participants[2]`, `lastMessageAt` |
| **messages** | `conversationId`, `senderId`, `text`, `createdAt`, `readAt` |

Seed sugerido: 25–40 perfiles ficticios de Barcelona repartidos entre roles y géneros, con vídeos/fotos de *placeholder* y 2–3 conversaciones de ejemplo para el usuario demo.

---

## 7. Trabajar con Claude Code por fases

**Rutina en cada fase:**
1. `Shift+Tab` hasta **plan mode** → pegar el prompt de la fase.
2. Revisar el plan, corregir, aprobar.
3. Dejar que implemente; revisar diffs.
4. `"ejecuta los tests y arréglalos si fallan"` → commit.
5. `/clear` antes de la siguiente fase (el contexto vive en `CLAUDE.md` y `docs/`).

### Fase 1 — Backend NestJS + auth
```text
Lee CLAUDE.md, docs/producto.md y docs/datos-mock.md. Crea en backend/ un proyecto
NestJS con Mongoose y módulos auth, users, profiles, favorites y chats.
Auth: registro y login con email + contraseña (hash con argon2 o bcrypt), JWT de
acceso corto + refresh token rotativo, guard global con rutas públicas marcadas
(GET de perfiles y búsqueda son públicas; favoritos y chats requieren sesión).
Validación con class-validator, configuración por variables de entorno, CORS
configurable, Swagger en /docs y endpoint /health. Propón el plan antes de escribir código.
```

### Fase 2 — Datos mock
```text
Crea un script de seed (npm run seed) que cargue en MongoDB los datos ficticios
descritos en docs/datos-mock.md, idempotente, y un usuario demo con credenciales
en .env.example.
```

### Fase 3 — MongoDB Atlas + Render
```text
Prepara el despliegue: render.yaml para un Web Service Node (build y start de Nest),
variables MONGODB_URI, JWT_SECRET, JWT_REFRESH_SECRET, CORS_ORIGINS, health check en
/health. Escribe docs/deploy.md con los pasos manuales en Atlas y Render.
```
Pasos manuales: crear clúster M0 en Atlas → usuario de BD → *Network Access* (el plan gratuito de Render no tiene IP fija; habrá que permitir 0.0.0.0/0 en desarrollo) → copiar URI a Render → *New → Blueprint* desde el repo.
Nota: el plan gratuito de Render "duerme" el servicio sin tráfico; la primera petición tarda.

### Fase 4 — Ionic + Capacitor
```text
Crea en mobile/ una app Ionic + Capacitor (Android) en modo "md". Implementa las
pantallas de design/handoff usando los tokens de design/material-theme.json como
variables CSS de Ionic (claro y oscuro) y Roboto. Navegación con barra inferior según
docs/producto.md. Empieza solo por Explorar + Ficha de músico con datos de la API.
```
Después, por iteraciones: Buscador y filtros → Registro / Login (con la regla "sin registro") → Favoritos → Chats → Mi perfil y Editar perfil.

### Fase 5 — Evaluar Ionic vs. nativo
Definid **antes** qué es "resultado aceptable", por ejemplo:
- Fidelidad visual con el Design System (componentes M3, tipografía, color claro/oscuro).
- Fluidez de scroll en Explorar y de la reproducción de vídeo.
- Comportamiento Android (botón atrás, teclado, permisos).

Si no se cumple → plan B: **Kotlin + Jetpack Compose**. Ventaja: Material Theme Builder exporta el tema directamente a Compose y los componentes M3 son nativos. El backend NestJS no cambia.

---

## 8. Comandos y atajos útiles

| Comando | Para qué |
|---|---|
| `claude` | Abrir sesión en la carpeta actual |
| `claude -c` | Continuar la última conversación de esa carpeta |
| `claude -r` | Elegir una conversación anterior |
| `/init` | Generar `CLAUDE.md` inicial |
| `/memory` | Editar `CLAUDE.md` / memoria |
| `/clear` | Vaciar el contexto entre fases |
| `/login` | Cambiar de cuenta |
| `Shift+Tab` | Cambiar modo de permisos (incluido plan mode) |
| `/help` | Ver todos los comandos |

Opcional: conectar servidores **MCP** (por ejemplo, Figma si volvéis a usarlo, o uno de MongoDB para consultar la BD desde Claude Code). Ver https://code.claude.com/docs/en/mcp.md

---

## 9. Decisiones pendientes del equipo

- [ ] ¿Ionic con **Angular**, **React** o **Vue**? (Angular encaja con el estilo de NestJS; React tiene más ejemplos.)
- [ ] ¿Los chats deben ser en **tiempo real** (WebSockets) o basta con mock/refresco para el prototipo?
- [ ] ¿Dónde se guardan el **vídeo obligatorio** y las fotos? (para el prototipo: URLs de placeholder).
- [ ] ¿Login solo con email o también Google/Apple?
- [ ] Validar el modelo de datos mock de la sección 6.
- [ ] Criterios concretos de "aceptable" para decidir Ionic vs. nativo.
- [ ] Nombre definitivo de la marca (NEXUM / NEXA / NODI siguen abiertos) → afecta a `applicationId` de Android.

---

## Fuentes
- Quickstart de Claude Code: https://code.claude.com/docs/en/quickstart.md
- Memoria y CLAUDE.md: https://code.claude.com/docs/en/memory.md
- Buenas prácticas y permisos: https://code.claude.com/docs/en/best-practices.md
- Subagentes: https://code.claude.com/docs/en/sub-agents.md
- Claude Design → Claude Code (tutorial oficial): https://claude.com/resources/tutorials/using-claude-design-for-prototypes-and-ux
