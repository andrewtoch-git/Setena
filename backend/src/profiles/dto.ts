import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  ArrayMaxSize, ArrayMinSize, ArrayUnique, IsArray, IsBoolean, IsIn, IsInt, IsNumber, IsOptional, IsString, IsUrl,
  Max, MaxLength, Min, MinLength, ValidateNested,
} from 'class-validator';
import { CLAVES_SERVICIO, DISPONIBILIDAD, GENEROS, ROLES, ZONAS } from '../common/catalogos';

const trim = ({ value }: { value: unknown }) => (typeof value === 'string' ? value.trim() : value);
const URL_OPTS = { require_protocol: true, protocols: ['https', 'http'] };

export class TarifaDto {
  @ApiProperty({ enum: CLAVES_SERVICIO }) @IsIn(CLAVES_SERVICIO)
  servicio!: string;

  @ApiPropertyOptional({ description: 'Importe en euros; null si es «A convenir» o solo texto' })
  @IsOptional() @IsNumber() @Min(0) @Max(100000)
  precio?: number | null;

  @ApiPropertyOptional({ example: 'Clases de piano: 25 € la hora' })
  @IsOptional() @IsString() @MaxLength(120) @Transform(trim)
  texto?: string | null;
}

export class RedesDto {
  @IsOptional() @IsUrl(URL_OPTS) instagram?: string | null;
  @IsOptional() @IsUrl(URL_OPTS) youtube?: string | null;
  @IsOptional() @IsUrl(URL_OPTS) spotify?: string | null;
  @IsOptional() @IsUrl(URL_OPTS) tiktok?: string | null;
  @IsOptional() @IsUrl(URL_OPTS) soundcloud?: string | null;
}

/** Campos editables del perfil (todos menos el nombre). */
export class PerfilEditableDto {
  @ApiProperty({ enum: ROLES, isArray: true })
  @IsArray() @ArrayMinSize(1) @ArrayMaxSize(ROLES.length) @ArrayUnique() @IsIn(ROLES, { each: true })
  roles!: string[];

  @ApiProperty({ enum: GENEROS, isArray: true })
  @IsArray() @ArrayMinSize(1) @ArrayMaxSize(GENEROS.length) @ArrayUnique() @IsIn(GENEROS, { each: true })
  generos!: string[];

  @ApiProperty() @IsBoolean() remunerados!: boolean;
  @ApiProperty() @IsBoolean() colaboraciones!: boolean;

  @ApiProperty({ enum: ZONAS }) @IsIn(ZONAS) zona!: string;
  @ApiProperty({ description: 'Distrito o municipio de la lista de la zona' }) @IsString() lugar!: string;

  @ApiProperty({ enum: DISPONIBILIDAD, isArray: true })
  @IsArray() @ArrayMinSize(1) @ArrayUnique() @IsIn(DISPONIBILIDAD, { each: true })
  disponibilidad!: string[];

  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(600) @Transform(trim)
  sobreMi?: string | null;

  @ApiPropertyOptional({ type: [TarifaDto] })
  @IsOptional() @IsArray() @ArrayMaxSize(4) @ValidateNested({ each: true }) @Type(() => TarifaDto)
  tarifas?: TarifaDto[];

  @ApiPropertyOptional({ type: RedesDto })
  @IsOptional() @ValidateNested() @Type(() => RedesDto)
  redes?: RedesDto;
}

export class CrearPerfilDto extends PerfilEditableDto {
  @ApiProperty({ example: 'Alex Martín' }) @IsString() @MinLength(1) @MaxLength(60) @Transform(trim)
  nombre!: string;
}

export class ActualizarPerfilDto extends PartialType(PerfilEditableDto) {}

export class BuscarPerfilesQuery {
  @ApiPropertyOptional({ description: 'Texto libre. Las palabras que coinciden con un rol, género, zona o disponibilidad se aplican como filtro.' })
  @IsOptional() @IsString() @MaxLength(100)
  q?: string;

  @ApiPropertyOptional({ enum: ROLES, isArray: true }) @IsOptional() @IsIn(ROLES, { each: true })
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  roles?: string[];

  @ApiPropertyOptional({ enum: GENEROS, isArray: true }) @IsOptional() @IsIn(GENEROS, { each: true })
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  generos?: string[];

  @ApiPropertyOptional({ enum: ZONAS, isArray: true }) @IsOptional() @IsIn(ZONAS, { each: true })
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  zonas?: string[];

  @ApiPropertyOptional({ enum: DISPONIBILIDAD, isArray: true }) @IsOptional() @IsIn(DISPONIBILIDAD, { each: true })
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  disponibilidad?: string[];

  @ApiPropertyOptional({ enum: ['remunerados', 'colaboraciones'], isArray: true })
  @IsOptional() @IsIn(['remunerados', 'colaboraciones'], { each: true })
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  tipos?: string[];

  @ApiPropertyOptional({ default: 1 }) @IsOptional() @Type(() => Number) @IsInt() @Min(1)
  pagina = 1;

  @ApiPropertyOptional({ default: 20 }) @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(50)
  porPagina = 20;
}
