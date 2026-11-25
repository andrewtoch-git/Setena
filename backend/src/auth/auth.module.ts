import { Module } from '@nestjs/common';
import { ProfilesModule } from '../profiles/profiles.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GoogleVerifier } from './google-verifier';

@Module({
  imports: [ProfilesModule],
  controllers: [AuthController],
  providers: [AuthService, GoogleVerifier],
  exports: [AuthService],
})
export class AuthModule {}
