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
  Res,
  Req,
  DefaultValuePipe,
  ParseIntPipe,
  Query,
  Response,
} from '@nestjs/common';
import { ShipmentsService } from './shipments.service';
import { CreateShipmentDto } from './dto/create-shipment.dto';
import { UpdateShipmentDto } from './dto/update-shipment.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/auth/decorators/role.decorator';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { Pagination } from 'nestjs-typeorm-paginate';
import { CreateInterneShipmentDto } from './dto/create-interne-shipment.dto';
import { TentativesEchouer } from 'src/enums/tentatives-echouer';
import { Echecs } from 'src/enums/echecs';
import { TypeUserEnum } from 'src/enums/TypeUserEnum';
import { ApiQuery } from '@nestjs/swagger';
import { Shipment } from './entities/shipment.entity';
import { Service } from '../services/entities/service.entity';
import { CreateAspirationShipmentDto } from './dto/createAspirationShipmentDto';

@UseGuards(JwtAuthGuard, RoleGuard)
@Controller('shipments')
export class ShipmentsController {
  constructor(private readonly shipmentsService: ShipmentsService) {}

  @Post()
  create(@Body() createShipmentDto: CreateShipmentDto[], @Request() req: any) {
    return this.shipmentsService.create(createShipmentDto, req.user);
  }

  @Post('createInterneShipment')
  createInterneShipment(
    @Body() createInterneShipmentDto: CreateInterneShipmentDto,
    @Req() req: any,
    @Res() res: Response,
  ) {
    return this.shipmentsService.createInterneShipment(
      createInterneShipmentDto,
      req.user,
      res,
    );
  }
  @Post('createShipmentByFile')
  createShipmentByFile(
    @Request() req,
    @Body('service') Service,
    @Body('shipments') shipments: CreateAspirationShipmentDto[],
  ) {
    return this.shipmentsService.createShipmentByFile(
      req.user,
      Service,
      shipments,
    );
  }
  @Post('assignToCourier')
  async assignToCourier(
    @Request() req,
    @Body('trackings') trackings: string[],
    @Body('coursier') coursier: number,
  ) {
    return this.shipmentsService.assignToCourier(trackings, coursier, req.user);
  }

  @Post('set-shipment-status-livre')
  setShipmentLivre(@Request() req, @Body('tracking') tracking: string) {
    return this.shipmentsService.setShipmentLivre(req.user, tracking);
  }

  @Post('set-shipment-status-enAlert')
  setShipmentEnAlert(
    @Request() req,
    @Body('tracking') tracking: string,
    @Body('msg') msg: string,
  ) {
    if ((<any>Object).values(TentativesEchouer).includes(msg)) {
      return this.shipmentsService.setShipmentEnAlert(req.user, tracking, msg);
    }
  }

  @Post('set-shipment-status-echec-livraison')
  setStatusShipmentEchec(
    @Request() req,
    @Body('tracking') tracking: string,
    @Body('msg') msg: string,
  ) {
    console.log(msg);
    if ((<any>Object).values(Echecs).includes(msg)) {
      return this.shipmentsService.setShipmentStatusEchecLivraison(
        req.user,
        tracking,
        msg,
      );
    }
  }

  @Post('one-shipment-of-coursier-a-livrer')
  async oneShipmentOfCoursierAlivrer(@Request() req, @Body('tracking') tracking: string,) {
    return await this.shipmentsService.oneShipmentOfCoursierAlivrer(tracking, req.user);
  }
  
  @Get('getPickupFreelance')
  findAllShipmentsPresExpPickup(@Request() req) {
    return this.shipmentsService.getTrackingPresExpPickup(req.user);
  }

  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  @ApiQuery({ name: 'searchShipmentsTerm', type: String, required: false })
  @Get('paginateAllShipments')
  findPaginateShipments(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit,
    @Query('searchShipmentsTerm') searchShipmentsTerm: string,
  ): Promise<Pagination<Shipment>> {
    return this.shipmentsService.findPaginateAllShipments(
      {
        page,
        limit,
      },
      searchShipmentsTerm,
    );
  }

  @Get('download')
  download(@Res() res, @Query('term') term: string) {
    return this.shipmentsService.export(res, term);
  }

  @Get('shipment-of-coursier-a-livrer')
  async shipmentOfCoursierAlivrer(@Request() req) {
    return await this.shipmentsService.shipmentOfCoursierAlivrer(req.user);
  }
  @Get('shimentStopDeskALivrer')
  async shimentStopDeskALivrer(@Request() req) {
    console.log('hah');
    return await this.shipmentsService.shimentStopDeskALivrer(req.user);
  }
  @Get('getTracking-coursier-receive')
  getTrackingCoursierReceive(@Request() req) {
    return this.shipmentsService.getTrackingCoursierReceive(req.user);
  }

  @Post('receive-shipments-coursier')
  receiveShipmentCoursier(
    @Request() req,
    @Body('trackings') trackings: string[],
  ) {
    return this.shipmentsService.receiveShipmentCoursier(req.user, trackings);
  }
  @Patch('payerShipmentsOfCoursier')
  async payerShipment(
    @Query('coursierId') coursierId,
    @Request() req,
    @Response() res,
  ) {
    const buffer = await this.shipmentsService.payerCoursier(coursierId, req);
    const buf = Buffer.from(buffer);
    res.send(buf);
    return res;
  }
  @Get('downloadBrdToAspire')
  downloadBorderau(@Res() res) {
    const filePath = 'src/assets/brd_aspirer.xlsx';
    return res.download(filePath);
  }

  // @Get('receive-shipment-coursier')
  // receiveshipmentCoursier(){}

  @Get('paginateColisInterneOfUser')
  async getpaginateColisInterneOfUser(
    @Request() req,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit,
    @Query('searchColisTerm') searchColisTerm: string,
  ): Promise<Pagination<any>> {
    return await this.shipmentsService.findPaginateColisInterneOfUser(
      req.user,
      {
        page,
        limit,
      },
      searchColisTerm,
    );
  }
  @Get('paginateColisCoursierEchecs')
  async paginateColisCoursierEchecs(
    @Request() req,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit,
    @Query('searchColisTerm') searchColisTerm: string,
  ): Promise<Pagination<any>> {
    return await this.shipmentsService.findpaginateColisCoursierEchecs(
      req.user,
      {
        page,
        limit,
      },
      searchColisTerm,
    );
  }
  @Get('paginateColisStopDeskEchecs')
  async paginateColisStopDeskEchecs(
    @Request() req,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit,
    @Query('searchColisTerm') searchColisTerm: string,
  ): Promise<Pagination<any>> {
    return await this.shipmentsService.paginateColisStopDeskEchecs(
      req.user,
      {
        page,
        limit,
      },
      searchColisTerm,
    );
  }
  @Get('getPaginatedShipmentsEnpreparation')
  @Roles('1976729')
  getPaginatedShipmentsEnpreparation(
    @Request() req,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit,
    @Query('searchColisTerm') searchColisTerm: string,
  ): Promise<Pagination<any>> {
    return this.shipmentsService.getPaginatedShipmentsEnpreparation(
      req.user,
      {
        page,
        limit,
      },
      searchColisTerm,
    );
  }

  @Get('getPresExp')
  @Roles('236429359')
  findAllShipmentsPresExp(@Req() req) {
    return this.shipmentsService.getTrackingPresExp(req.user);
  }

  @Get('getShipmentsPresTransfert')
  @Roles('236429359')
  getShipmentsPresTransfert(@Request() req) {
    console.log(
      '🚀 ~ file: shipments.controller.ts ~ line 42 ~ ShipmentsController ~ getTrackingPresTransfert ~ req',
      req.user,
    );
    return this.shipmentsService.getShipmentsPresTransfert(req.user);
  }

  @Get('getShipmentsPresLivraison')
  @Roles('236429359')
  getShipmentsPresLivraison(@Request() req) {
    return this.shipmentsService.getShipmentsPresLivraison(req.user);
  }
  @Get('getStatistiqueShipmentOfCoursierSelected/:id')
  getStatistiqueShipmentOfCoursierSelected(@Param('id') id: number) {
    return this.shipmentsService.getStatistiqueShipmentOfCoursierSelected(id);
  }
  @Get('getStatistiqueShipmentCoursier')
  getStatistiqueShipmentCoursier(@Request() req) {
    return this.shipmentsService.getStatistiqueShipmentCoursier(req.user);
  }
  @Get('getStatistiqueClient')
  getStatistiqueClient(@Request() req) {
    return this.shipmentsService.getStatistiqueClient(req.user);
  }
  @Get('getStatistiquesStatusOPS/:agence')
  getStatistiquesStatusOPS(
    @Param() agence,
    @Query('dateDebut') dateDebut,
    @Query('dateFin') dateFin,
  ) {
    return this.shipmentsService.getStatistiquesStatusOPS(
      agence,
      dateDebut,
      dateFin,
    );
  }
  @Get('getStatistiquesStatusFinance/:agence')
  getStatistiquesStatusFinance(
    @Param() agence,
    @Query('dateDebut') dateDebut,
    @Query('dateFin') dateFin,
  ) {
    return this.shipmentsService.getStatistiquesStatusFinance(
      agence,
      dateDebut,
      dateFin,
    );
  }
  @Get()
  findAll() {
    return this.shipmentsService.findAll();
  }
  @Post('setPreExpedition')
  async setShipmentsPreExpedition(
    @Body() shipmentId: number[],
    @Request() req,
    @Res() res: Response,
  ) {
    return this.shipmentsService.setShipmentsPreExpedition(
      shipmentId,
      req,
      res,
    );
  }

  @Post('setShipmentExpedier')
  @Roles('236429359')
  async setShipmentExpedier(@Request() req, @Body('tracking') shipments) {
    return this.shipmentsService.setShipmentExpedier(req.user, shipments);
  }
  @Post('setShipmentRamasser-freelance')
  // @Roles('236429359')
  async setShipmentRamasser(@Request() req, @Body('tracking') shipments) {
    return this.shipmentsService.setShipmentRamasser(req.user, shipments);
  }
  @Post('setReturnStation')
  setReturnStation(@Request() req, @Body('trackings') trackings) {
    return this.shipmentsService.setReturnStation(req.user, trackings);
  }

  @Get('getTrackingPresVersWilaya/:id')
  @Roles('236429359')
  async getTrackingPresVersWilaya(@Param() idWilaya, @Req() req) {
    return this.shipmentsService.getTrackingPresVersWilaya(idWilaya, req.user);
  }
  @Get('getTrackingPresTranfsertRetour/:stationId')
  getTrackingPresTranfsertRetour(
    @Request() req,
    @Param('stationId') stationId: number,
  ) {
    console.log('hakim', req.user, stationId);
    return this.shipmentsService.getTrackingPresTranfsertRetour(
      req.user,
      stationId,
    );
  }
  @Get('getTrackingPresRetourVersWilaya/:idWilaya')
  getTrackingPresRetourVersWilaya(@Request() req, @Param('idWilaya') idWilaya) {
    return this.shipmentsService.getTrackingPresRetourVersWilaya(
      req.user,
      parseInt(idWilaya),
    );
  }
  @Get('getColisPresReturnVersAgence/:idAgence')
  getColisPresReturnVersAgence(@Request() req, @Param('idAgence') idAgence) {
    return this.shipmentsService.getColisPresReturnVersAgence(
      req.user,
      parseInt(idAgence),
    );
  }
  @Get('getShipmentsPresARetire/:idClient')
  getShipmentsPresARetire(@Request() req, @Param('idClient') idClient: number) {
    return this.shipmentsService.getShipmentsPresARetire(req.user, idClient);
  }
  @Get('searchTracking/:tracking')
  serchTracking(@Request() req, @Param('tracking') tracking: string) {
    console.log(tracking);
    const express_reg = new RegExp(/^\d{8}$/, 'i');
    if (express_reg.test(tracking)) {
      if (
        req.user.typeUser == TypeUserEnum.operations ||
        req.user.typeUser == TypeUserEnum.admin ||
        req.user.typeUser == TypeUserEnum.caissierRegional ||
        req.user.typeUser == TypeUserEnum.finance ||
        req.user.typeUser == TypeUserEnum.caissierAgence ||
        req.user.typeUser == TypeUserEnum.manager ||
        req.user.typeUser == TypeUserEnum.service_client
      ) {
        return this.shipmentsService.searchTrackingByEmploye(
          tracking.toLowerCase(),
        );
      } else if (req.user.typeUser == TypeUserEnum.client) {
        return this.shipmentsService.searchTrackingByClient(
          tracking.toLowerCase(),
          req.user,
        );
      } else {
        // searchTrackingPublic
        return this.shipmentsService.searchTrackingPublic(
          tracking.toLowerCase(),
        );
      }
    }
  }
  @Get('printBordereau/:idShipment')
  async printBordereau(
    @Request() req,
    @Param('idShipment') idShipment,
    @Response() res,
  ) {
    const buffer = await this.shipmentsService.printBordereau(
      idShipment,
      req.user,
    );
    const buf = Buffer.from(buffer);
    res.send(buf);
    return res;
  }

  @Get('getRecoltesOfCoursier/:coursierId')
  getRecoltesOfCoursier(@Param('coursierId') coursierId: number) {
    return this.shipmentsService.getRecoltesOfCoursier(coursierId);
  }
  @Get('getRecoltesDeskInformation')
  getRecoltesDeskInformation(@Request() req) {
    return this.shipmentsService.getRecoltesDeskInformation(req.user);
  }
  
  @Get('getRecoltesCsInformation')
  getRecoltesCsInformation(@Request() req) {
    return this.shipmentsService.getRecoltesCsInformation(req.user);
  }
  @Get('getShipmentsReturnStation/:coursierId')
  getShipmentsReturnStation(
    @Request() req,
    @Param('coursierId') coursierId: number,
  ) {
    return this.shipmentsService.getColisReturnStation(req.user, coursierId);
  }

  @Get('getColisOfClientClassic/:id')
  getColisOfClientClassic(
    @Param('id', ParseIntPipe) id,
    @Query('dateDebut') dateDebut,
    @Query('dateFin') dateFin,
    @Query('espece') espece,
  ) {
    return this.shipmentsService.getShipmentClassicWithIntervalOfClient(
      id,
      dateDebut,
      dateFin,
      espece,
    );
  }

  @Get('getColisOfClientEcommerce/:id')
  getColisOfClientEcommerce(
    @Param('id', ParseIntPipe) id,
    @Query('dateDebut') dateDebut,
    @Query('dateFin') dateFin,
    @Query('espece') espece,
  ) {
    return this.shipmentsService.getShipmentEcommerceWithIntervalOfClient(
      id,
      dateDebut,
      dateFin,
      espece,
    );
  }

  @Get('getColisOfClientEcommerceZero/:id')
  getColisOfClientEcommerceZero(
    @Param('id', ParseIntPipe) id,
    @Query('dateDebut') dateDebut,
    @Query('dateFin') dateFin,
    @Query('espece') espece,
  ) {
    return this.shipmentsService.getShipmentEcommerceZeroWithIntervalOfClient(
      id,
      dateDebut,
      dateFin,
      espece,
    );
  }

  @Get('getSacsClientInformation/:idClient')
  getSacsClientInformation(@Request() req, @Param('idClient') idClient) {
    return this.shipmentsService.getSacsClientInformation(req.user, idClient);
  }
  @Get('getShipmentsPresVersAgence/:idAgence')
  getShipmentsPresVersAgence(@Request() req, @Param('idAgence') idAgence) {
    return this.shipmentsService.getShipmentsPresVersAgence(
      req.user,
      parseInt(idAgence),
    );
  }
  @Get('colisLivrer/coursier/:id')
  getShipmentLivrerByCoursierId(@Param('id', ParseIntPipe) id: number) {
    return this.shipmentsService.getShipmentsByCoursierId(id);
  }
  @Get('paginateColisTracabiliteOfClient')
  getPaginateColisTracabiliteOfClient(
    @Request() req,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit,
    @Query('searchColisTerm') searchColisTerm: string,
  ) {
    return this.shipmentsService.getPaginateColisTracabiliteOfClient(
      req.user,
      {
        page,
        limit,
      },
      searchColisTerm,
    );
  }

  @Patch('facturerShipments')
  async facturerShipments(
    @Request() req,
    @Query('clientId') clientId,
    @Query('dateDebut') dateDebut,
    @Query('dateFin') dateFin,
    @Query('espece') espece,
    @Response() res,
  ) {
    const buffer = await this.shipmentsService.facturerShipmentsClassique(
      req,
      clientId,
      dateDebut,
      dateFin,
      espece,
    );
    const buf = Buffer.from(buffer);
    console.log(
      '🚀 ~ file: shipments.controller.ts ~ line 438 ~ ShipmentsController ~ buf',
      buf,
    );
    res.send(buf);
    return res;
  }

  @Patch('facturerShipmentsEcommerceDetail')
  async facturerShipmentsEcommerce(
    @Request() req,
    @Query('clientId') clientId,
    @Query('dateDebut') dateDebut,
    @Query('dateFin') dateFin,
    @Query('espece') espece,
    @Response() res,
  ) {
    const buffer = await this.shipmentsService.facturerShipmentnsEcommerce(
      req,
      clientId,
      dateDebut,
      dateFin,
      espece,
      'detail',
    );
    const buf = Buffer.from(buffer);
    res.send(buf);
    return res;
  }

  @Patch('facturerShipmentsEcommerceSimplifier')
  async facturerShipmentsEcommerceSimplifier(
    @Request() req,
    @Query('clientId') clientId,
    @Query('dateDebut') dateDebut,
    @Query('dateFin') dateFin,
    @Query('espece') espece,
    @Response() res,
  ) {
    const buffer = await this.shipmentsService.facturerShipmentnsEcommerce(
      req,
      clientId,
      dateDebut,
      dateFin,
      espece,
      'simple',
    );
    const buf = Buffer.from(buffer);
    res.send(buf);
    return res;
  }

  @Patch('facturerShipmentsEcommerceZeroDetail')
  async facturerShipmentsEcommerceZero(
    @Request() req,
    @Query('clientId') clientId,
    @Query('dateDebut') dateDebut,
    @Query('dateFin') dateFin,
    @Query('espece') espece,
    @Response() res,
  ) {
    const buffer = await this.shipmentsService.facturerShipmentnsEcommerceZero(
      req,
      clientId,
      dateDebut,
      dateFin,
      espece,
      'detail',
    );
    const buf = Buffer.from(buffer);
    res.send(buf);
    return res;
  }

  @Patch('facturerShipmentsEcommerceZeroSimplifier')
  async facturerShipmentsEcommerceZeroSimplifier(
    @Request() req,
    @Query('clientId') clientId,
    @Query('dateDebut') dateDebut,
    @Query('dateFin') dateFin,
    @Query('espece') espece,
    @Response() res,
  ) {
    const buffer = await this.shipmentsService.facturerShipmentnsEcommerce(
      req,
      clientId,
      dateDebut,
      dateFin,
      espece,
      'simple',
    );
    const buf = Buffer.from(buffer);
    res.send(buf);
    return res;
  }
  @Patch('updateStopDeskToDomicile/:id')
  updateStopDeskToDomicile(
    @Param('id') id: number,

    @Body('adress') adress: string,
  ) {
    console.log(
      '🚀 ~ file: shipments.controller.ts ~ line 582 ~ ShipmentsController ~ adress',
      adress,
    );
    console.log(
      '🚀 ~ file: shipments.controller.ts ~ line 582 ~ ShipmentsController ~ tracking',
      id,
    );
    return this.shipmentsService.updateStopDeskToDomicile(id, adress);
  }
  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateShipmentDto: UpdateShipmentDto,
  ) {
    console.log(
      '🚀 ~ file: shipments.controller.ts ~ line 435 ~ ShipmentsController ~ updateShipmentDto',
      updateShipmentDto,
    );
    return this.shipmentsService.update(id, updateShipmentDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: any) {
    return this.shipmentsService.findOne(+id);
  }

  @Delete(':id')
  async remove(@Param('id') id: number, @Request() req: any) {
    return await this.shipmentsService.remove(id, req.user.id);
  }
  @Get('get-solde-client/:id')
  getSoldeClient(@Req() req, @Param() clientId) {
    return this.shipmentsService.getSoldeClient(req.user, clientId);
  }
}
