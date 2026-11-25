import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  Equals,
  IsEmail,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { CrearPerfilDto } from '../profiles/dto';

const email = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim().toLowerCase() : value;

export class RegistroDto extends CrearPerfilDto {
  @ApiProperty({ example: 'nombre@correo.com' })
  @Transform(email)
  @IsEmail({}, { message: 'Introduce un correo válido (nombre@correo.com)' })
  email!: string;

  @ApiProperty({ minLength: 8 })
  @IsString()
  @MinLength(8, { message: 'Mínimo 8 caracteres' })
  @MaxLength(128)
  password!: string;

  @ApiProperty({ description: 'Debe ser true' })
  @Equals(true, {
    message: 'Debes aceptar los términos y la política de privacidad',
  })
  aceptaTerminos!: boolean;
}

export class LoginDto {
  @ApiProperty()
  @Transform(email)
  @IsEmail({}, { message: 'Introduce un correo válido (nombre@correo.com)' })
  email!: string;

  @ApiProperty()
  @IsString()
  @MinLength(1)
  @MaxLength(128)
  password!: string;
}

export class GoogleDto {
  @ApiProperty({ description: 'ID token devuelto por Google Sign-In' })
  @IsString()
  @MinLength(10)
  idToken!: string;
}

export class RefreshDto {
  @ApiProperty()
  @IsString()
  @MinLength(10)
  refreshToken!: string;
}
