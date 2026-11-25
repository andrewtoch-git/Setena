import {
  Controller,
  Get,
  Header,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';
import { Public } from '../common/decorators';
import { ProfilesService } from '../profiles/profiles.service';

const escapar = (s: string) =>
  s.replace(
    /[&<>"']/g,
    (c) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[
        c
      ]!,
  );

/**
 * Enlace público para compartir un perfil fuera de la app («Copiar enlace», WhatsApp, Facebook).
 * Página mínima con vista previa (Open Graph) y botón para abrir la app (setena://perfil/:id).
 */
@ApiExcludeController()
@Public()
@SkipThrottle()
@Controller('p')
export class CompartirController {
  constructor(private readonly perfiles: ProfilesService) {}

  @Get(':id')
  @Header('Content-Type', 'text/html; charset=utf-8')
  @Header('Cache-Control', 'public, max-age=300')
  async pagina(@Param('id') id: string): Promise<string> {
    const p = await this.perfiles.porId(id);
    if (!p) throw new NotFoundException('Este perfil ya no está disponible');
    const nombre = escapar(p.nombre);
    const linea = escapar(`${p.roles.join(', ')} · ${p.generos.join(', ')}`);
    const lugar = escapar(
      p.zona === 'Barcelona ciudad' ? `${p.lugar}, Barcelona` : p.lugar,
    );
    const imagen = p.avatarId ? `/media/${p.avatarId.toString()}` : null;
    const app = `setena://perfil/${p._id.toString()}`;
    return `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${nombre} · setena</title>
<meta property="og:title" content="${nombre} en setena">
<meta property="og:description" content="${linea} · ${lugar}">
${imagen ? `<meta property="og:image" content="${imagen}">` : ''}
<meta name="theme-color" content="#141318">
<style>
body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#141318;color:#e5e1e9;font-family:Roboto,"Helvetica Neue",Arial,sans-serif}
main{max-width:360px;padding:32px 24px;text-align:center;display:flex;flex-direction:column;gap:12px;align-items:center}
img{width:96px;height:96px;border-radius:50%;object-fit:cover;background:#35343a}
h1{margin:0;font-size:24px;font-weight:500}
p{margin:0;color:#c9c5d0;font-size:14px;line-height:20px}
a{margin-top:12px;height:40px;padding:0 24px;border-radius:999px;background:#d4f06a;color:#1a1d00;display:inline-flex;align-items:center;font-weight:500;font-size:14px;text-decoration:none}
.marca{font-family:Nunito,Roboto,sans-serif;font-weight:700;font-size:22px}
</style>
</head>
<body>
<main>
<span class="marca">setena</span>
${imagen ? `<img src="${imagen}" alt="">` : ''}
<h1>${nombre}</h1>
<p>${linea}</p>
<p>${lugar}</p>
<a href="${app}">Ver perfil en setena</a>
</main>
</body>
</html>`;
  }
}
