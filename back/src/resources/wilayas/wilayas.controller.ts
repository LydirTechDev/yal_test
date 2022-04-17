import {
  Controller,
  Get,
  Post,
  Body,
  DefaultValuePipe,
  ParseIntPipe,
  Query,
  Request,
  UseGuards,
  Patch,
  Param,
} from '@nestjs/common';
import { WilayasService } from './wilayas.service';
import { CreateWilayaDto } from './dto/create-wilaya.dto';
import { Wilaya } from './entities/wilaya.entity';
import { Pagination } from 'nestjs-typeorm-paginate';
import { ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { UpdateResult } from 'typeorm';
import { UpdateWilayaDto } from './dto/update-wilaya.dto';

@UseGuards(JwtAuthGuard, RoleGuard)
@Controller('wilayas')
export class WilayasController {
  constructor(private readonly wilayasService: WilayasService) {}

  /**
   * create and save new entity wilaya
   * @param createWilayaDto
   * @returns
   */
  @Post('createWilayaByFile')
  createWilayaByFile(@Body() createWilayaDto: CreateWilayaDto[]) {
    if (createWilayaDto.length > 1) {
      return this.wilayasService.createWilayaByFile(createWilayaDto);
    }
  }
  @Post()
  create(@Body() createWilayaDto: CreateWilayaDto) {
    return this.wilayasService.create(createWilayaDto);
  }

  /**
   * get all wilayas
   * @returns
   */
  @Get()
  findAllWilaya(): Promise<Wilaya[]> {
    return this.wilayasService.findAllWilaya();
  }
  @Get('wilayasOfMyCenter')
  wilayasOfMyCenter(@Request() req) {
    return this.wilayasService.wilayasOfMyCenter(req.user);
  }
  /**
   * get all wilaya or search or by limite nb items to select or defin n° of page
   * serach on
   *  - codeWilaya
   *  - nomLatin
   *  - nomArabe
   * @param page
   * @param limit
   * @param searchWilayaTerm
   * @returns
   */
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  @ApiQuery({ name: 'searchWilayaTerm', type: String, required: false })
  @Get('paginateWilaya')
  async findPaginateWilaya(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit,
    @Query('searchWilayaTerm') searchWilayaTerm: string,
  ): Promise<Pagination<Wilaya>> {
    return await this.wilayasService.findPaginateWilaya(
      {
        page,
        limit,
      },
      searchWilayaTerm,
    );
  }
  @Get(':id')
  findOneWilayaById(@Param('id', ParseIntPipe) id: number): Promise<Wilaya> {
    return this.wilayasService.findOne(id);
  }

  @Patch(':id')
  updateWilaya(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateWilayaDto: UpdateWilayaDto,
  ): Promise<UpdateResult> {
    return this.wilayasService.updateWilaya(id, updateWilayaDto);
  }
}
