import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UseGuards,
  DefaultValuePipe,
  ParseIntPipe,
  Query,
  Response,
  Res,
} from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import { Pagination } from 'nestjs-typeorm-paginate';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { Client } from './entities/client.entity';
@UseGuards(JwtAuthGuard, RoleGuard)
@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  async create(@Body() createClientDto: CreateClientDto, @Response() res) {
    console.log(
      '🚀 ~ file: clients.controller.ts ~ line 31 ~ ClientsController ~ create ~ createClientDto',
      createClientDto,
    );
    const buffer = await this.clientsService.create(createClientDto);
    const buf = Buffer.from(buffer);
    res.send(buf);
    return res;
  }

  @Get('getListClientsAttachedToMyStation')
  getListClientsAttachedToMyStation(@Request() req) {
    return this.clientsService.getListClientsAttachedToMyStation(req.user);
  }
  @Get('printContrat/:id')
  async printContrat(@Param('id') idClient, @Response() res) {
    const buffer = await this.clientsService.printConvention(idClient);
    const buf = Buffer.from(buffer);
    res.send(buf);
    return res;
  }
  @Get('printCarteClient/:id')
  async printCarteClient(@Param('id') idClient, @Response() res) {
    const buffer = await this.clientsService.printCarteClient(idClient);
    const buf = Buffer.from(buffer);
    res.send(buf);
    return res;
  }
  @Get('download')
  download(@Res() res, @Query('term') term: string) {
    return this.clientsService.export(res, term);
  }

  @Get()
  findAll() {
    return this.clientsService.findAll();
  }
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  @ApiQuery({ name: 'searchClientTerm', type: String, required: false })
  @Get('paginateClient')
  findPaginateCoursier(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit,
    @Query('searchClientTerm') searchClientTerm: string,
  ): Promise<Pagination<Client>> {
    return this.clientsService.findPaginateClient(
      {
        page,
        limit,
      },
      searchClientTerm,
    );
  }
  
  @Get('clientsWithClassicShipments')
  getClientsHaveClassicShipmentInInterval(
    @Query('dateDebut') dateDebut,
    @Query('dateFin') dateFin,
    @Request() req
  ): Promise<any> {
    return this.clientsService.getClientsHaveClassicShipmentInInterval(
      dateDebut,
      dateFin,
      req.user.id
    );
  }

  @Get('clientsWithEcommerceShipments')
  getClientsHaveEcommerceShipmentInInterval(
    @Query('dateDebut') dateDebut,
    @Query('dateFin') dateFin,
    @Request() req
  ): Promise<any> {
    return this.clientsService.getClientsHaveEcommerceShipmentInInterval(
      dateDebut,
      dateFin,
      req.user.id
    );
  }

  @Get('clientsWithEcommerceZeroShipments')
  getClientsHaveEcommerceZeroShipmentInInterval(
    @Query('dateDebut') dateDebut,
    @Query('dateFin') dateFin,
    @Request() req
  ): Promise<any> {
    console.log("🚀 ~ file: clients.controller.ts ~ line 118 ~ ClientsController ~ dateFin", dateFin)
    return this.clientsService.getClientsHaveEcommerceZeroShipmentInInterval(
      dateDebut,
      dateFin,
      req.user.id
    );
  }


  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clientsService.findOneClientById(+id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateClientDto: UpdateClientDto,
  ) {
    return this.clientsService.updateClient(id, updateClientDto);
  }

  @Patch(':id/setActivity')
  updateActvivty(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateClientDto: UpdateClientDto,
  ) {
    return this.clientsService.updateActivity(id, updateClientDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.clientsService.remove(+id);
  }
}
