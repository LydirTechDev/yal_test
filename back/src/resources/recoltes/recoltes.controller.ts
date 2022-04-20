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
  Response,
  DefaultValuePipe,
  ParseIntPipe,
  Query,
  Req,
} from '@nestjs/common';
import { RecoltesService } from './recoltes.service';
import { CreateRecolteDto } from './dto/create-recolte.dto';
import { UpdateRecolteDto } from './dto/update-recolte.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Recolte } from './entities/recolte.entity';
@UseGuards(JwtAuthGuard, RoleGuard)
@Controller('recoltes')
export class RecoltesController {
  constructor(private readonly recoltesService: RecoltesService) {}

  @Get('paginateRecolteOfUser')
  getPaginateRecolteOfUser(
    @Request() req,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit,
    @Query('searchRecolteTerm') searchRecolteTerm: string,
  ): Promise<Pagination<Recolte>> {
    return this.recoltesService.getPaginateRecolteOfUser(
      req.user,
      {
        page,
        limit,
      },
      searchRecolteTerm,
    );
  }

  @Get('paginateAllRecolte')
  getPaginateAllRecolte(
    @Req() req,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit,
    @Query('searchRecolteTerm') searchRecolteTerm: string,
  ) {
    if (req.user.typeUser === '2548965156') {
      return this.recoltesService.getPaginateAllAgenceRecolte(
        req.user,
        {
          page,
          limit,
        },
        searchRecolteTerm,
      );
    } else if (req.user.typeUser === '1548965156') {
      return this.recoltesService.getPaginateAllRegionalRecolte(
        req.user,
        {
          page,
          limit,
        },
        searchRecolteTerm,
      );
    } else {
      return this.recoltesService.getPaginateAllRecolte(
        {
          page,
          limit,
        },
        searchRecolteTerm,
      );
    }
  }

  @Get('getRecoltePresRecolte')
  getRecoltePresRecolte(@Req() req) {
    if (req.user.typeUser === '2548965156') {
      return this.recoltesService.getRecolteAgencePresRecolte(req.user);
    } else if (req.user.typeUser === '1548965156') {
      return this.recoltesService.getRecolteRegionalPresRecolte(req.user);
    } else {
      return this.recoltesService.getRecoltePresRecolte();
    }
  }

  @Post('receiveRecoltes')
  receiveRecoltes(@Body('rctTracking') rctTrackings: string[], @Request() req) {
    if (rctTrackings.length > 0) {
      return this.recoltesService.receiveRecoltes(req.user, rctTrackings);
    }
  }
  @Post('createRecolteDesk')
  createRecolteDesk(@Request() req, @Response() res) {
    return this.recoltesService.createRecolteDesk(req.user, res);
  }

  @Post()
  create(
    @Request() req,
    @Body() createRecolteDto: CreateRecolteDto,
    @Response() res,
  ) {
    return this.recoltesService.create(req.user, createRecolteDto, res);
  }
  
  @Get('printRecolte/:idRecolte')
  async printRecolte(@Param('idRecolte') idRecolte, @Response() res) {
    return await this.recoltesService.printRecolteManifest(idRecolte, res);
  }

  @Get('getInformationsPaiementToLiberer')
  getInformationsPaiementToLiberer(@Req() req) {
    console.log(
      '🚀 ~ file: recoltes.controller.ts ~ line 85 ~ RecoltesController ~ getInformationsPaiementToLiberer ~ req',
      req.user,
    );
    return this.recoltesService.getInformationsPaiementToLiberer(req.user);
  }

  @Get('get-solde-agence')
  getSoldeAgence(@Req() req) {
    return this.recoltesService.getSoldeAgence(req.user);
  }

  @Post('libererParIdRecolte')
  libererParIdRecolte(@Request() req, @Body() tracking) {
    const express_reg = new RegExp(/^rec-\d{3}\w{3}$/, 'i');
    if (!express_reg.test(tracking)) {
      return this.recoltesService.libererParIdRecolte(
        req.user,
        tracking.tracking,
      );
    }
  }
  @Post('libererParDateRecolte')
  libererParDateRecolte(@Request() req, @Body() date) {
    return this.recoltesService.libererParDateRecolte(req.user, date.date);
  }

  @Post('libererParClient')
  libererParClient(@Request() req, @Body() clientId) {
    console.log(
      '🚀 ~ file: recoltes.controller.ts ~ line 140 ~ RecoltesController ~ libererParClient ~ clientId',
      clientId,
    );
    return this.recoltesService.libererParClient(req.user, clientId.clientId);
  }

  @Get()
  findAll() {
    return this.recoltesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.recoltesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRecolteDto: UpdateRecolteDto) {
    return this.recoltesService.update(+id, updateRecolteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.recoltesService.remove(+id);
  }
}
