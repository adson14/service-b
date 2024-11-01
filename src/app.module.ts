import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { AuthService } from './auth.service';
import { MensgaemController } from './mensagem/mensagem.controller';
import { HealthModule } from './health/health.module';
import { TypeOrmModule } from '@nestjs/typeorm';
@Module({
  imports: [
    ConfigModule.forRoot(),
    JwtModule.register({
      secret: process.env.SECRET_JWT, // Mesma chave que no Serviço A
      signOptions: { expiresIn: '1h' },
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port:  Number(process.env.DB_PORT),
      username:  process.env.DB_USERNAME,
      password:  process.env.DB_PASSWORD,
      database:  process.env.DB_DATABASE,
      entities: [/* entidades aqui */],
      synchronize: true,
    }),
    HealthModule,
  ],
  controllers: [AppController, MensgaemController],
  providers: [AppService,AuthService],
  exports: [AuthService],
})
export class AppModule {}
