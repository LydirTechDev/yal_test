import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  DefaultValuePipe,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { EmployesService } from './employes.service';
import { CreateEmployeDto } from './dto/create-employe.dto';
import { UpdateEmployeDto } from './dto/update-employe.dto';
import { Roles } from 'src/auth/decorators/role.decorator';
import { ApiQuery } from '@nestjs/swagger';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Employe } from './entities/employe.entity';

@Controller('employes')
export class EmployesController {
  constructor(private readonly employesService: EmployesService) {}

  @Post()
  create(@Body() createEmployeDto: CreateEmployeDto) {
    return this.employesService.create(createEmployeDto);
  }
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  @ApiQuery({ name: 'searchEmployeTerm', type: String, required: false })
  @Get('paginateEmploye')
  findPaginateCoursier(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit,
    @Query('searchEmployeTerm') searchCoursierTerm: string,
  ): Promise<Pagination<Employe>> {
    return this.employesService.findPaginateEmploye(
      {
        page,
        limit,
      },
      searchCoursierTerm,
    );
  }

  @Get()
  findAll() {
    return this.employesService.findAll();
  }
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.employesService.findOne(id);
  }

  @Get('employesByAgence/:agenceId')
  @Roles('236429359')
  findEmployesByAgence(@Param('agenceId') agenceId: number) {
    return this.employesService.findEmployesByAgence(agenceId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEmployeDto: UpdateEmployeDto) {
    return this.employesService.updateEmploye(updateEmployeDto, +id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.employesService.remove(+id);
  }

  @Patch(':id/setActivity')
  updateActvivty(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEmployeDto: UpdateEmployeDto,
  ) {
    return this.employesService.updateActivity(id, updateEmployeDto);
  }

}
