import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  Res,
  Response,
} from '@nestjs/common';
import { ServiceClientService } from './service-client.service';
import { CreateServiceClientDto } from './dto/create-service-client.dto';
import { UpdateServiceClientDto } from './dto/update-service-client.dto';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { EstimateTarifDto } from './dto/estimate-tarif-service-client.dto';
import { CreateShipmentByServiceClientDto } from './dto/create-shipment-by-service-client.dto';

@UseGuards(JwtAuthGuard, RoleGuard)
@Controller('service-client')
export class ServiceClientController {
  constructor(private readonly serviceClientService: ServiceClientService) {}

  @Post()
  create(@Body() createServiceClientDto: CreateServiceClientDto) {
    return this.serviceClientService.create(createServiceClientDto);
  }

  @Get()
  findAll() {
    return this.serviceClientService.findAll();
  }

  @Post('create-shipment-classique')
  async createShipmentClassique(
    @Req() req,
    @Body() shipment: CreateShipmentByServiceClientDto,
    @Response() res,
  ) {
    console.log(
      '🚀 ~ file: service-client.controller.ts ~ line 44 ~ ServiceClientController ~ shipment',
      shipment,
    );
    const buffer = await this.serviceClientService.createShipment(
      req.user,
      shipment,
      'classique divers',
      res,
    );
    const buf = Buffer.from(buffer);
    res.send(buf);
    return res;
  }

  @Post('create-shipment-retrait-cahier-de-charge')
  async createShipmentRetraitCahierDeCharge(
    @Req() req,
    @Body() shipment: CreateShipmentByServiceClientDto,
    @Response() res,
  ) {
    console.log(
      '🚀 ~ file: service-client.controller.ts ~ line 44 ~ ServiceClientController ~ shipment',
      shipment,
    );
    const buffer = await this.serviceClientService.createShipment(
      req.user,
      shipment,
      'cahier de charge',
      res,
    );
    const buf = Buffer.from(buffer);
    res.send(buf);
    return res;
  }

  @Post('create-shipment-soumission')
  async createShipmentSoumission(
    @Req() req,
    @Body() shipment: CreateShipmentByServiceClientDto,
    @Response() res,
  ) {
    console.log(
      '🚀 ~ file: service-client.controller.ts ~ line 44 ~ ServiceClientController ~ shipment',
      shipment,
    );
    const buffer = await this.serviceClientService.createShipment(
      req.user,
      shipment,
      'soumission',
      res,
    );
    const buf = Buffer.from(buffer);
    res.send(buf);
    return res;
  }

  @Post('estimate-tarif')
  getEstimateTarif(@Req() req, @Body() estimateTarifDto: EstimateTarifDto) {
    return this.serviceClientService.getEstimateTarif(
      req.user,
      estimateTarifDto,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.serviceClientService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateServiceClientDto: UpdateServiceClientDto,
  ) {
    return this.serviceClientService.update(+id, updateServiceClientDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.serviceClientService.remove(+id);
  }
}
