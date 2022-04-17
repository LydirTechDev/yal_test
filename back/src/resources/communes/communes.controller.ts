import {
  Controller,
  Get,
  Post,
  Body,
  DefaultValuePipe,
  ParseIntPipe,
  Query,
  Patch,
  Param,
} from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import { Pagination } from 'nestjs-typeorm-paginate';
import { UpdateResult } from 'typeorm';
import { CommunesService } from './communes.service';
import { CreateCommuneDto } from './dto/create-commune.dto';
import { UpdateCommuneDto } from './dto/update-commune.dto';
import { Commune } from './entities/commune.entity';

@Controller('communes')
export class CommunesController {
  /**
   * CommuneController dependencies
   * CommuneService to use commune functions
   * @param communesService
   */
  constructor(private readonly communesService: CommunesService) {}

  /**
   * create and save new entity commune
   * @param createCommuneDto
   * @returns
   */
  @Post('createCommuneByFile')
  createCommuneByFile(@Body() createCommuneDto: CreateCommuneDto[]) {
    if (createCommuneDto.length > 0) {
      return this.communesService.createCommuneByFile(createCommuneDto);
    }
  }
  @Post()
  create(@Body() createCommuneDto: CreateCommuneDto) {
    return this.communesService.create(createCommuneDto);
  }

  /**
   * get all communes or all commune by wilayaId
   * @returns
   */
  @Get()
  findAllCommune(): Promise<Commune[]> {
    return this.communesService.findAllCommune();
  }

  @Get('wilayaId/:wilayaId')
  findCommuneByWilayaId(
    @Param('wilayaId', ParseIntPipe) id: number,
  ): Promise<Commune[]> {
    return this.communesService.findAllCommuneByWilayaId(id);
  }
  /**
   * get all Paginate cummunes
   * get communes by search
   * get communes by defind limie nb items to selecte or by defind
   * @param page
   * @param limit
   * @param searchCommuneTerm
   * @returns
   */
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  @ApiQuery({ name: 'searchCommuneTerm', type: String, required: false })
  @Get('paginateCommune')
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit,
    @Query('searchCommuneTerm') searchCommuneTerm: string,
  ): Promise<Pagination<Commune>> {
    return this.communesService.findPaginateCommune(
      {
        page,
        limit,
      },
      searchCommuneTerm,
    );
  }

  /**
   * selecte commune by wilayaId an
   * @param wilayaId
   * @param livraisonStopDesck
   * @returns
   */
  @Post('communeByWilayaAndTypeLivraison')
  async findAllByWilayaIdAndTypeLivraison(
    @Body('wilayaId') wilayaId: number,
    @Body('livraisonStopDesck') livraisonStopDesck: boolean,
  ) {
    return this.communesService.findAllByWilayaIdAndTypeLivraison(
      wilayaId,
      livraisonStopDesck,
    );
  }
  @Get(':id')
  findOneCommune(@Param('id', ParseIntPipe) id: number): Promise<Commune> {
    return this.communesService.findOne(id);
  }

  @Patch(':id')
  updateCommune(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCommuneDto: UpdateCommuneDto,
  ): Promise<UpdateResult> {
    return this.communesService.updateCommune(id, updateCommuneDto);
  }
}
