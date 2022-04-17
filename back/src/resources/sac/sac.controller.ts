import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  Response,
  UseGuards,
  Req,
} from '@nestjs/common';
import { SacService } from './sac.service';
import { CreateSacDto } from './dto/create-sac.dto';
import { UpdateSacDto } from './dto/update-sac.dto';
import { Roles } from 'src/auth/decorators/role.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { REQUEST } from '@nestjs/core';

@UseGuards(JwtAuthGuard, RoleGuard)
@Controller('sac')
export class SacController {
  constructor(private readonly sacService: SacService) {}

  @Post()
  create(@Body() createSacDto: CreateSacDto) {
    return this.sacService.create(createSacDto);
  }

  @Post('createTransfertSac')
  @Roles('236429359')
  createTransfertSac(
    @Request() req,
    @Body('tracking') tracking: string[],
    @Body('agenceSelected') agenceSelected: number,
    @Response() res,
  ) {
    if (agenceSelected != undefined && tracking.length > 0) {
      return this.sacService.createTransfertSac(
        req.user,
        tracking,
        agenceSelected,
        res,
      );
    }
  }

  @Post('createSacVersWilaya')
  @Roles('236429359')
  createSacVersWilaya(
    @Request() req,
    @Body('trakings') trakings: string[],
    @Body('whilayaDestinationId') whilayaDestinationId: number,
    @Response() res,
  ) {
    if (whilayaDestinationId != undefined && trakings.length > 0) {
      return this.sacService.createSacVersWilaya(
        req.user,
        trakings,
        whilayaDestinationId,
        res,
      );
    }
  }

  @Post('viderSacTransfert')
  @Roles('236429359')
  viderSacTransfert(@Request() req, @Body('tracking') tracking: string[]) {
    console.log(tracking);
    if (tracking.length != 0) {
      return this.sacService.viderSacTransfert(req.user, tracking);
    }
  }
  @Post('createSacTransfertRetour')
  createSacTransfertRetour(
    @Request() req,
    @Body('trackings') tracking: string[],
    @Body('stationSelected') stationSelected: number,
    @Response() res,
  ) {
    if (tracking.length != 0) {
      return this.sacService.createTransfertSacRetour(
        req.user,
        tracking,
        stationSelected,
        res,
      );
    }
  }
  @Post('createSacRetourVersWilaya')
  createSacRetourVersWilaya(
    @Request() req,
    @Body('trackings') trackings: string[],
    @Body('whilayaDestinationId') wilayaSelected: number,
    @Response() res,
  ) {
    if (trackings.length > 0) {
      return this.sacService.createSacRetourVersWilaya(
        req.user,
        res,
        trackings,
        wilayaSelected,
      );
    }
  }
  @Post('createSacRetourAgence')
  createSacRetourAgence(
    @Request() req,
    @Body('trackings') trackings: string[],
    @Body('agenceSelected') agenceSelected: number,
    @Response() res,
  ) {
    if (trackings.length > 0) {
      return this.sacService.createSacRetourAgence(
        req.user,
        res,
        trackings,
        agenceSelected,
      );
    }
  }
  @Post('receptShipmentClient')
  receptShipmentClient(
    @Request() req,
    @Response() res,
    @Body('trackings') trackings,
    @Body('sacTracking') sacTracking,
    @Body('idClient') idClient,
  ) {
    if (idClient != null && sacTracking != null && trackings.length > 0) {
      return this.sacService.accReceptShipmentClient(
        req.user,
        trackings,
        sacTracking,
        idClient,
        res,
      );
    }
  }
  @Get('getTrackingEnTransfert/:tracking')
  @Roles('236429359')
  getTrackingEnTransfert(@Param('tracking') tracking: any, @Request() req) {
    const express_reg = new RegExp(/^sac-\d{3}\w{3}$/, 'i');
    if (express_reg.test(tracking.toLowerCase())) {
      return this.sacService.getTrackingEnTransfert(tracking, req.user);
    }
  }

  @Get('getTrackingVersWilaya/:tracking')
  @Roles('236429359')
  getTrackingVersWilaya(@Param('tracking') tracking: string, @Request() req) {
    const express_reg = new RegExp(/^sac-\d{3}\w{3}$/, 'i');
    if (express_reg.test(tracking.toLowerCase())) {
      return this.sacService.getTrackingVersWilaya(tracking, req.user);
    }
  }
  @Get('getTrackingReturnTransfert/:tracking')
  getTrackingReturnTransfert(
    @Param('tracking') tracking: string,
    @Request() req,
  ) {
    const express_reg = new RegExp(/^sac-\d{3}\w{3}$/, 'i');
    if (express_reg.test(tracking.toLowerCase())) {
      return this.sacService.getTrackingReturnTransfert(tracking, req.user);
    }
  }
  @Get('getTrackingReturnWilaya/:trackingSac')
  getTrackingReturnWilaya(@Request() req, @Param('trackingSac') tracking) {
    const express_reg = new RegExp(/^sac-\d{3}\w{3}$/, 'i');
    if (express_reg.test(tracking.toLowerCase())) {
      return this.sacService.getTrackingReturnWilaya(req.user, tracking);
    }
  }
  @Get('getTrackingReturnVersAgence/:trackingSac')
  getTrackingReturnVersAgence(@Request() req, @Param('trackingSac') tracking) {
    const express_reg = new RegExp(/^sac-\d{3}\w{3}$/, 'i');
    if (express_reg.test(tracking.toLowerCase())) {
      return this.sacService.getTrackingReturnVersAgence(req.user, tracking);
    }
  }
  @Get('getTrackingOfSacVersVendeur/:trackingSac')
  getTrackingOfSacVersVendeur(@Param('trackingSac') trackingSac) {
    return this.sacService.getTrackingOfSacVersVendeur(trackingSac);
  }
  @Post('viderSacWilaya')
  @Roles('236429359')
  viderSacWilaya(@Request() req, @Body('tracking') tracking: string[]) {
    console.log(tracking);
    if (tracking.length != 0) {
      return this.sacService.viderSacWilaya(req.user, tracking);
    }
  }
  @Post('viderSacTransfertRetour')
  viderSacTransfertRetour(
    @Request() req,
    @Body('tracking') trackings: string[],
  ) {
    console.log(
      '🚀 ~ file: sac.controller.ts ~ line 133 ~ SacController ~ trackings',
      trackings,
    );
    if (trackings.length > 0) {
      return this.sacService.viderSacTransfertRetour(req.user, trackings);
    }
  }
  @Post('viderSacRetourWilaya')
  viderSacRetourWilaya(@Request() req, @Body('trackings') tracking: string[]) {
    if (tracking.length > 0) {
      return this.sacService.viderSacRetourWilaya(req.user, tracking);
    }
  }
  @Post('viderSacRetourVersAgence')
  viderSacRetourVersAgence(
    @Request() req,
    @Body('trackings') trackings: string[],
  ) {
    if (trackings.length > 0) {
      return this.sacService.viderSacRetourVersAgence(req.user, trackings);
    }
  }
  @Post('createSacRetourClient')
  createSacRetourClient(
    @Request() req,
    @Response() res,
    @Body('trackings') trackings: string[],
  ) {
    if (trackings.length > 0) {
      return this.sacService.createSacRetourClient(req.user, res, trackings);
    }
  }
  @Post('transiterSacs')
  transiterSacs(@Request() req, @Body('trackings') trackings: string[]) {
    if (trackings.length > 0) {
      return this.sacService.transiterSacs(req.user, trackings);
    }
  }
  @Post('createSacVersAgence')
  createSacVersAgence(
    @Request() req,
    @Body('trackings') trackings: string[],
    @Body('agenceSelected') agenceSelected: number,
    @Response() res,
  ) {
    if (trackings.length > 0) {
      return this.sacService.createSacVersAgence(
        req.user,
        res,
        trackings,
        agenceSelected,
      );
    }
  }
  @Post('viderSacVersAgence')
  @Roles('236429359')
  viderSacAgence(@Request() req, @Body('tracking') trackings: string[]) {
    if (trackings.length > 0) {
      return this.sacService.viderSacAgence(req.user, trackings);
    }
  }
  @Get('getTrackingVersAgence/:tracking')
  @Roles('236429359')
  getTrackingVersAgence(@Param('tracking') tracking: string, @Request() req) {
    const express_reg = new RegExp(/^sac-\d{3}\w{3}$/, 'i');
    if (express_reg.test(tracking.toLowerCase())) {
      return this.sacService.getTrackingVersAgence(tracking, req.user);
    }
  }
  @Get('getSacPresTransit')
  getSacPresTransit(@Request() req) {
    return this.sacService.getSacPresTransit(req.user);
  }
  @Get()
  findAll() {
    return this.sacService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    // return this.sacService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSacDto: UpdateSacDto) {
    return this.sacService.update(+id, updateSacDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sacService.remove(+id);
  }
}
