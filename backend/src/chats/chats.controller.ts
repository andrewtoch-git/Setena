import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiProperty,
  ApiPropertyOptional,
  ApiTags,
} from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsDateString,
  IsInt,
  IsMongoId,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { AuthUser, CurrentUser } from '../common/decorators';
import { ChatsService } from './chats.service';

class AbrirDto {
  @ApiProperty() @IsMongoId() perfilId!: string;
}

class MensajeDto {
  @ApiProperty({ maxLength: 2000 })
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString()
  @MinLength(1)
  @MaxLength(2000)
  texto!: string;
}

class HistorialQuery {
  @ApiPropertyOptional({
    description: 'Mensajes anteriores a esta fecha (paginación)',
  })
  @IsOptional()
  @IsDateString()
  antesDe?: string;

  @ApiPropertyOptional({ default: 30 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limite = 30;
}

@ApiTags('chats')
@ApiBearerAuth()
@Controller('conversaciones')
export class ChatsController {
  constructor(private readonly chats: ChatsService) {}

  @Get()
  @ApiOperation({
    summary: 'Mis chats con mensajes, del más reciente al más antiguo',
  })
  listar(@CurrentUser() user: AuthUser) {
    return this.chats.listar(user.userId);
  }

  @Get('no-leidos')
  @ApiOperation({
    summary: 'Total de mensajes sin leer (insignia de la barra inferior)',
  })
  async noLeidos(@CurrentUser() user: AuthUser) {
    return { total: await this.chats.totalNoLeidos(user.userId) };
  }

  @Post()
  @ApiOperation({ summary: 'Abrir (o recuperar) el chat con un perfil' })
  abrir(@CurrentUser() user: AuthUser, @Body() dto: AbrirDto) {
    return this.chats.abrirCon(user.userId, dto.perfilId);
  }

  @Get(':id/mensajes')
  historial(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Query() q: HistorialQuery,
  ) {
    return this.chats.historial(id, user.userId, q.antesDe, q.limite);
  }

  @Post(':id/mensajes')
  enviar(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() dto: MensajeDto,
  ) {
    return this.chats.enviar(id, user.userId, dto.texto);
  }

  @Post(':id/leido')
  @HttpCode(204)
  async leido(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    await this.chats.marcarLeido(id, user.userId);
  }
}
