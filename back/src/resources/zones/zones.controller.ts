import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
  Param,
} from '@nestjs/common';
import { ZonesService } from './zones.service';
import { CreateZoneDto } from './dto/create-zone.dto';
import { Zone } from './entities/zone.entity';
import { Pagination } from 'nestjs-typeorm-paginate';
import { ApiQuery } from '@nestjs/swagger';

@Controller('zones')
export class ZonesController {
  constructor(private readonly zonesService: ZonesService) {}
  /**
   * create and save new instance zone
   * @param createZoneDto
   * @returns
   */
  @Post()
  create(@Body() createZoneDto: CreateZoneDto) {
    return this.zonesService.create(createZoneDto);
  }

  /**
   * find all zones
   * @returns
   */
  @Get()
  findAllZone(): Promise<Zone[]> {
    return this.zonesService.findAllZone();
  }

  /**
   * find all zones
   * @returns
   */
   @Get('fineZoneBycodeTarif/:id')
   findOneZone(@Param('id') id: number, ): Promise<Zone[]> {
     return this.zonesService.fineZoneBycodeTarif(id);
   }

  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  @ApiQuery({ name: 'searchZoneTerm', type: String, required: false })
  @Get('paginateZone')
  async findPaginatZone(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page,
    @Query('limit', new DefaultValuePipe(9), ParseIntPipe) limit,
    @Query('searchZoneTerm') searchZoneTerm: string,
  ): Promise<Pagination<Zone>> {
    return this.zonesService.findPaginateZone(
      {
        page,
        limit,
      },
      searchZoneTerm,
    );
  }
}
