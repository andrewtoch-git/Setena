import { Controller, Get } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { ApiTags } from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';
import { Connection, ConnectionStates } from 'mongoose';
import { CATALOGOS } from './common/catalogos';
import { Public } from './common/decorators';

@ApiTags('general')
@Public()
@SkipThrottle()
@Controller()
export class MiscController {
  constructor(@InjectConnection() private readonly conexion: Connection) {}

  @Get('health')
  health() {
    const db =
      this.conexion.readyState === ConnectionStates.connected ? 'up' : 'down';
    return { status: db === 'up' ? 'ok' : 'degradado', db };
  }

  @Get('catalogos')
  catalogos() {
    return CATALOGOS;
  }
}
