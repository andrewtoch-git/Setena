import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthUser, CurrentUser, Public } from '../common/decorators';
import { ActualizarPerfilDto, BuscarPerfilesQuery, CrearPerfilDto } from './dto';
import { ProfilesService } from './profiles.service';

@ApiTags('perfiles')
@ApiBearerAuth()
@Controller()
export class ProfilesController {
  constructor(private readonly perfiles: ProfilesService) {}

  @Public()
  @Get('perfiles')
  @ApiOperation({ summary: 'Explorar: búsqueda libre + filtros (pública)' })
  buscar(@Query() q: BuscarPerfilesQuery, @CurrentUser() user?: AuthUser) {
    return this.perfiles.buscar(q, user?.userId);
  }

  @Public()
  @Get('perfiles/:id')
  @ApiOperation({ summary: 'Ficha de músico (pública)' })
  detalle(@Param('id') id: string, @CurrentUser() user?: AuthUser) {
    return this.perfiles.detalle(id, user?.userId);
  }

  @Post('me/perfil')
  @ApiOperation({ summary: 'Crear mi perfil (tras entrar con Google)' })
  async crear(@CurrentUser() user: AuthUser, @Body() dto: CrearPerfilDto) {
    return this.perfiles.ficha(await this.perfiles.crear(user.userId, dto));
  }

  @Patch('me/perfil')
  @ApiOperation({ summary: 'Editar mi perfil (el nombre no se puede cambiar)' })
  async actualizar(@CurrentUser() user: AuthUser, @Body() dto: ActualizarPerfilDto) {
    return this.perfiles.ficha(await this.perfiles.actualizar(user.userId, dto));
  }
}
