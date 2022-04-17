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
} from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import { Pagination } from 'nestjs-typeorm-paginate';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { UpdateResult } from 'typeorm';
import { CoursierService } from './coursier.service';
import { CreateCoursierDto } from './dto/create-coursier.dto';
import { UpdateCoursierDto } from './dto/update-coursier.dto';
import { Coursier } from './entities/coursier.entity';

@UseGuards(JwtAuthGuard, RoleGuard)
@Controller('coursier')
export class CoursierController {
  constructor(private readonly coursierService: CoursierService) {}

  @Post()
  create(@Body() createCoursierDto: CreateCoursierDto) {
    return this.coursierService.create(createCoursierDto);
  }
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  @ApiQuery({ name: 'searchCoursierTerm', type: String, required: false })
  @Get('paginateCoursier')
  findPaginateCoursier(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit,
    @Query('searchCoursierTerm') searchCoursierTerm: string,
  ): Promise<Pagination<Coursier>> {
    return this.coursierService.findPaginateCoursier(
      {
        page,
        limit,
      },
      searchCoursierTerm,
    );
  }
  @Get()
  findAll() {
    return this.coursierService.findAll();
  }

  @Get('coursierByStation')
  findAllByStation(@Request() req): Promise<Coursier[]> {
    console.log('hakim')
    return this.coursierService.findAllByStation(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.coursierService.findOne(+id);
  }
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCoursierDto: UpdateCoursierDto,
  ): Promise<UpdateResult> {
    return this.coursierService.updateCoursier(updateCoursierDto, id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.coursierService.remove(+id);
  }

  @Patch(':id/setActivity')
  updateActvivty(@Param('id', ParseIntPipe) id: number, @Body() updateCoursierDto: UpdateCoursierDto) {
    return this.coursierService.updateActivity(id, updateCoursierDto);
  }
}
