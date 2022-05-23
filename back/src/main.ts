import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AuthModule } from './auth/auth.module';
import { GlobalFilterException } from './core/filters/global.filter';
import { AgencesModule } from './resources/agences/agences.module';
import { CodeTarifModule } from './resources/code-tarif/code-tarif.module';
import { CommunesModule } from './resources/communes/communes.module';
import { RotationsModule } from './resources/rotations/rotations.module';
import { ServicesModule } from './resources/services/services.module';
import { UsersModule } from './resources/users/users.module';
import { WilayasModule } from './resources/wilayas/wilayas.module';
import { ZonesModule } from './resources/zones/zones.module';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: false,
      skipMissingProperties: false,
      enableDebugMessages: true,
    }),
  );

  app.useGlobalFilters(new GlobalFilterException());
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
  app.enableCors({
    origin: 'http://localhost:4200',
    credentials: true,
  });

  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('ERP Api Yalidine')
    .setDescription('The API description')
    .setVersion('1.0')
    // .addTag('Erp Yalidine')
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    include: [
      AuthModule,
      UsersModule,
      WilayasModule,
      CommunesModule,
      AgencesModule,
      RotationsModule,
      ZonesModule,
      ServicesModule,
      CodeTarifModule,
    ],
  });
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
