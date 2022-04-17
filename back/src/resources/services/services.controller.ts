import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Service } from './entities/service.entity';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ZonesService } from '../zones/zones.service';
import { PoidsService } from '../poids/poids.service';
import { CodeTarifService } from '../code-tarif/code-tarif.service';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('services')
export class ServicesController {
  constructor(
    private readonly servicesService: ServicesService,
    private readonly zoneService: ZonesService,
    private readonly poidsService: PoidsService,
    private readonly codeTarifsService: CodeTarifService,
    ) {}

  /**
   * create new service
   * @param createServiceDto
   * @returns
   */
  @Post()
  create(@Body() createServiceDto: CreateServiceDto): Promise<Service> {
    return this.servicesService.create(createServiceDto);
  }

  /**
   * find all services
   * @returns
   */
  @Get('findAllService')
  findAllServices(): Promise<Service[]> {
    return this.servicesService.findAllServices();
  }
  
  @Get('chekIfServiceExist/:serviceName')
  chekIfServiceExist(
    @Param('serviceName') serviceName: string,
  ): Promise<boolean> {
    return this.servicesService.chekIfServiceExist(serviceName);
  }
  /**
   * find users services
   * @param req
   * @returns
   */
  @Get('findServicesOfUser')
  async findServicesOfUser(@Request() req) {
    return await this.servicesService.findServicesOfUser(req);
  }

  /**
   * get count of all services
   * @returns
   */
  @Get('nbServices')
  getNbServices() {
    return this.servicesService.getNbServices();
  }
  @Get(':id')
  findOneServiceById(@Param('id') id: string) {
    return this.servicesService.findOne(+id);
  }
}
