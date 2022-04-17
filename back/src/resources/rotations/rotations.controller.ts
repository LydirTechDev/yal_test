import {
  Controller,
  Post,
  Body,
  DefaultValuePipe,
  Get,
  ParseIntPipe,
  Query,
  Param,
  Patch,
  NotFoundException,
  Res,
} from '@nestjs/common';
import { RotationsService } from './rotations.service';
import { CreateRotationDto } from './dto/create-rotation.dto';
import { ApiQuery } from '@nestjs/swagger';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Rotation } from './entities/rotation.entity';
import { UpdateResult } from 'typeorm';
import { UpdateRotationDto } from './dto/update-rotation.dto';

@Controller('rotations')
export class RotationsController {
  /**
   * Ro
   * @param rotationsService
   */
  constructor(private readonly rotationsService: RotationsService) {}
  @Post('createRotationsByFile')
  createRotationsByFile(@Body() createRotationDto: CreateRotationDto[]) {
    if (createRotationDto.length > 0) {
      return this.rotationsService.createRotationsByFile(createRotationDto);
    }
    throw new NotFoundException(createRotationDto);
  }
  @Post()
  create(@Body() createRotationDto: CreateRotationDto) {
    return this.rotationsService.create(createRotationDto);
  }
  @Get('Download')
  download(@Res() res, @Query('term') term: string) {
    return this.rotationsService.export(res, term);
  }

  /**
   * find all rotations
   * @returns
   */
  @Get()
  findAllRotation(): Promise<Rotation[]> {
    return this.rotationsService.findAllRotations();
  }
  /**
   * get all Paginate rotations
   * get zones by search
   * get zones by defind limie nb items to selecte or by defind
   * @param page
   * @param limit
   * @param searchZoneTerm
   * @returns
   */
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  @ApiQuery({ name: 'searchRotationTerm', type: String, required: false })
  @Get('paginateRotation')
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit,
    @Query('searchRotationTerm') searchRotationTerm: string,
  ): Promise<Pagination<Rotation>> {
    return this.rotationsService.findPaginateRotation(
      {
        page,
        limit,
      },
      searchRotationTerm,
    );
  }
  @Get(':id')
  findOneRotationById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Rotation> {
    return this.rotationsService.findOneRotationById(id);
  }

  @Patch(':id')
  updateRotation(
    @Body() updateRotationDto: UpdateRotationDto,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<UpdateResult> {
    return this.rotationsService.updateRotation(id, updateRotationDto);
  }
}
