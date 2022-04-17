import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DepartementsService } from './departements.service';
import { CreateDepartementDto } from './dto/create-departement.dto';
import { UpdateDepartementDto } from './dto/update-departement.dto';

@Controller('departements')
export class DepartementsController {
  constructor(private readonly departementsService: DepartementsService) {}

  @Post()
  create(@Body() createDepartementDto: CreateDepartementDto) {
    return this.departementsService.create(createDepartementDto);
  }

  @Get()
  findAll() {
    return this.departementsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.departementsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDepartementDto: UpdateDepartementDto) {
    return this.departementsService.update(+id, updateDepartementDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.departementsService.remove(+id);
  }
}
