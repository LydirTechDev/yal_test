import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './resources/users/users.module';
import { AuthModule } from './auth/auth.module';
import { DepartementsModule } from './resources/departements/departements.module';
import { ShipmentsModule } from './resources/shipments/shipments.module';
import { ServicesModule } from './resources/services/services.module';
import { WilayasModule } from './resources/wilayas/wilayas.module';
import { CommunesModule } from './resources/communes/communes.module';
import { ClientsModule } from './resources/clients/clients.module';
import { ClientsTarifsModule } from './resources/clients-tarifs/clients-tarifs.module';
import { CodeTarifModule } from './resources/code-tarif/code-tarif.module';
import { StatusModule } from './resources/status/status.module';
import { ZonesModule } from './resources/zones/zones.module';
import { RotationsModule } from './resources/rotations/rotations.module';
import { CodeTarifsZonesModule } from './resources/code-tarifs-zones/code-tarifs-zones.module';
import { PoidsModule } from './resources/poids/poids.module';
import { BanquesModule } from './resources/banques/banques.module';
import { FonctionsModule } from './resources/fonctions/fonctions.module';
import { EmployesModule } from './resources/employes/employes.module';
import { AgencesModule } from './resources/agences/agences.module';
import { SacModule } from './resources/sac/sac.module';
import { SacShipmentsModule } from './resources/sac-shipments/sac-shipments.module';
import { CoursierModule } from './resources/coursier/coursier.module';
import { RecoltesModule } from './resources/recoltes/recoltes.module';
import configuration from './config/configuration';
import { PmtModule } from './resources/pmt/pmt.module';
import { PmtCoursierModule } from './resources/pmt-coursier/pmt-coursier.module';
import { FactureModule } from './resources/facture/facture.module';
import { ServiceClientModule } from './resources/service-client/service-client.module';
import { ExpiditeurPublicModule } from './resources/expiditeur-public/expiditeur-public.module';
import { RecolteFactureModule } from './resources/recolte-facture/recolte-facture.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: process.env.DB_TYPE as any,
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: ['dist/**/*.entity{.ts,.js}'],
      synchronize: true,
      // logging: true
    }),
    UsersModule,
    AuthModule,
    DepartementsModule,
    ShipmentsModule,
    ServicesModule,
    WilayasModule,
    CommunesModule,
    ClientsModule,
    ClientsTarifsModule,
    CodeTarifModule,
    StatusModule,
    ZonesModule,
    RotationsModule,
    CodeTarifsZonesModule,
    PoidsModule,
    BanquesModule,
    FonctionsModule,
    EmployesModule,
    AgencesModule,
    SacModule,
    SacShipmentsModule,
    CoursierModule,
    RecoltesModule,
    PmtModule,
    PmtCoursierModule,
    FactureModule,
    ServiceClientModule,
    ExpiditeurPublicModule,
    RecolteFactureModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
