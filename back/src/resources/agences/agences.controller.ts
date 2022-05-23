import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
  Param,
  Request,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import { Pagination } from 'nestjs-typeorm-paginate';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { UpdateResult } from 'typeorm';
import { AgencesService } from './agences.service';
import { CreateAgenceDto } from './dto/create-agence.dto';
import { UpdateAgenceDto } from './dto/update-agence.dto';
import { Agence } from './entities/agence.entity';

@UseGuards(JwtAuthGuard, RoleGuard)
@Controller('agences')
export class AgencesController {
  /**
   * AgencesController dependencies
   * AgenceService to use agence functions
   * @param agencesService
   */
  constructor(private readonly agencesService: AgencesService) {}

  /**
   * create and save new agence entity
   * @param createAgenceDto
   * @returns
   */
  @Post()
  create(@Body() createAgenceDto) {
    console.log("🚀 ~ file: agences.controller.ts ~ line 41 ~ AgencesController ~ create ~ createAgenceDto", createAgenceDto)
    return this.agencesService.create(createAgenceDto);
  }
  @Get('getListAgencesInMyWilaya')
  getListAgencesInMyWilaya(@Request() req) {
    return this.agencesService.getListAgencesInMyWilaya(req.user);
  }
  /**
   * get all agences
   * @returns
   */
  @Get()
  findAllAgence(): Promise<Agence[]> {
    return this.agencesService.findAllAgence();
  }

  /**
   * find all agence with wilter by
   * typeAgence
   * @param typeAgence
   * @returns
   */
  @ApiQuery({ name: 'typeAgence', type: String, required: false })
  @Get('filterBy')
  findFiltredAgence(
    @Query('typeAgence') typeAgence: string,
  ): Promise<Agence[]> {
    return this.agencesService.findFiltredAgence(typeAgence);
  }

  /**
   * find all paginate agences
   * find agence by serch
   * find agence by defind limit nb items to select or n° page
   * @param page
   * @param limit
   * @param searchAgenceTerm
   * @returns
   */
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  @ApiQuery({ name: 'searchAgenceTerm', type: String, required: false })
  @Get('paginateAgence')
  async findPaginateAgence(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit,
    @Query('searchAgenceTerm') searchAgenceTerm: string,
  ): Promise<Pagination<Agence>> {
    return this.agencesService.findPaginatesAgence(
      {
        page,
        limit,
      },
      searchAgenceTerm,
    );
  }

  @Get('agenceByCommune/:communeId')
  findAgenceByCommune(@Param('communeId') communeId: number) {
    return this.agencesService.findAgenceByCommune(communeId);
  }

  @Get(':id')
  findOneAgenceById(@Param('id', ParseIntPipe) id: number): Promise<Agence> {
    return this.agencesService.findOneAgenceById(id);
  }

  @Get('communeZone/:id')
  findOneAgenceByIdWithCommuneZone(@Param('id', ParseIntPipe) id: number) {
    return this.agencesService.findOneAgenceByIdV3(id);
  }

  @Patch(':id')
  updateAgence(
    @Body() updateAgenceDto: UpdateAgenceDto,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<UpdateResult> {
    return this.agencesService.update(id, updateAgenceDto)
  }
  @Get('agenceByWilaya/:wilayaId')
  findAgenceByWilaya(@Param('wilayaId', ParseIntPipe) wilayaId: number) {
    return this.agencesService.findAgenceByWilayaId(wilayaId);
  }
}
