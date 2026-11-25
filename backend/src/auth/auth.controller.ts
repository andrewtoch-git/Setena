import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ThrottlerGuard } from '@nestjs/throttler';
import { Public } from '../common/decorators';
import { AuthService } from './auth.service';
import { GoogleDto, LoginDto, RefreshDto, RegistroDto } from './dto';

@ApiTags('auth')
@Public()
@UseGuards(ThrottlerGuard)
@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('registro')
  @ApiOperation({
    summary: 'Crear cuenta con correo y perfil (el vídeo está aplazado)',
  })
  registro(@Body() dto: RegistroDto) {
    return this.auth.registrar(dto);
  }

  @Post('login')
  @HttpCode(200)
  login(@Body() dto: LoginDto) {
    return this.auth.login(dto.email, dto.password);
  }

  @Post('google')
  @HttpCode(200)
  @ApiOperation({
    summary:
      'Entrar con Google. Si perfilCompleto es false, la app debe pedir POST /me/perfil',
  })
  google(@Body() dto: GoogleDto) {
    return this.auth.loginGoogle(dto.idToken);
  }

  @Post('refresh')
  @HttpCode(200)
  refresh(@Body() dto: RefreshDto) {
    return this.auth.refrescar(dto.refreshToken);
  }

  @Post('logout')
  @HttpCode(204)
  async logout(@Body() dto: RefreshDto) {
    await this.auth.logout(dto.refreshToken);
  }
}
