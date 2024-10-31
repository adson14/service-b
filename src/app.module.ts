import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { AuthService } from './auth/auth.service';
import { MensgaemController } from './mensagem/mensagem.controller';

@Module({
  imports: [
    ConfigModule.forRoot(),
    JwtModule.register({
      secret: process.env.SECRET_JWT, // Mesma chave que no Serviço A
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AppController, MensgaemController],
  providers: [AppService,AuthService],
  exports: [AuthService],
})
export class AppModule {}
