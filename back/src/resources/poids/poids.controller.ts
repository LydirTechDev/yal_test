import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PoidsService } from './poids.service';
import { CreatePoidDto } from './dto/create-poid.dto';
import { UpdatePoidDto } from './dto/update-poid.dto';

@Controller('poids')
export class PoidsController {
  constructor(private readonly poidsService: PoidsService) {}

  @Post()
  create(@Body() createPoidDto: CreatePoidDto) {
    return this.poidsService.create(createPoidDto);
  }

  @Get()
  findAll() {
    return this.poidsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.poidsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePoidDto: UpdatePoidDto) {
    return this.poidsService.update(+id, updatePoidDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.poidsService.remove(+id);
  }
}
