import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategys/local.strategy';
import { AuthController } from './auth.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategys/jwt.strategy';
import { UsersModule } from 'src/resources/users/users.module';
import { RoleGuard } from './guards/role.guard';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
    imports: [ConfigModule],
    useFactory: async () => ({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '365d' },
    }),
    inject: [ConfigService],
  }),
  ],
  providers: [
    AuthService, 
    LocalStrategy,
    JwtStrategy,
    RoleGuard
  ],
  controllers: [AuthController]
})
export class AuthModule { }
