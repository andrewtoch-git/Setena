import { plainToInstance } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min, MinLength, validateSync } from 'class-validator';

export class EnvVars {
  @IsString()
  MONGODB_URI!: string;

  @IsString()
  @MinLength(32)
  JWT_ACCESS_SECRET!: string;

  @IsString()
  @MinLength(32)
  JWT_REFRESH_SECRET!: string;

  /** Vida del token de acceso, en segundos (15 min). */
  @IsInt() @Min(60)
  JWT_ACCESS_TTL = 900;

  /** Vida del refresh token, en segundos (30 días). */
  @IsInt() @Min(3600)
  JWT_REFRESH_TTL = 2_592_000;

  /** Orígenes permitidos por CORS, separados por comas. Vacío = ninguno. */
  @IsString()
  CORS_ORIGINS = '';

  /** IDs de cliente OAuth de Google (web y Android), separados por comas. Vacío = login con Google desactivado. */
  @IsString()
  GOOGLE_CLIENT_IDS = '';

  @IsInt() @Min(1)
  THROTTLE_LIMIT = 10;

  @IsInt() @Min(1000)
  THROTTLE_TTL_MS = 60_000;

  @IsOptional() @IsInt()
  PORT = 3000;
}

export function validateEnv(config: Record<string, unknown>): EnvVars {
  const env = plainToInstance(EnvVars, config, { enableImplicitConversion: true, exposeDefaultValues: true });
  const errors = validateSync(env, { skipMissingProperties: false });
  if (errors.length) {
    const detalle = errors.map((e) => `${e.property}: ${Object.values(e.constraints ?? {}).join(', ')}`).join('; ');
    throw new Error(`Variables de entorno no válidas: ${detalle}`);
  }
  return env;
}
