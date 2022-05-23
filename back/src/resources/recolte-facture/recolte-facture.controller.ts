import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RecolteFactureService } from './recolte-facture.service';
import { CreateRecolteFactureDto } from './dto/create-recolte-facture.dto';
import { UpdateRecolteFactureDto } from './dto/update-recolte-facture.dto';

@Controller('recolte-facture')
export class RecolteFactureController {
  constructor(private readonly recolteFactureService: RecolteFactureService) {}

  @Post()
  create(@Body() createRecolteFactureDto: CreateRecolteFactureDto) {
    return this.recolteFactureService.create(createRecolteFactureDto);
  }

  @Get()
  findAll() {
    return this.recolteFactureService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.recolteFactureService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRecolteFactureDto: UpdateRecolteFactureDto) {
    return this.recolteFactureService.update(+id, updateRecolteFactureDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.recolteFactureService.remove(+id);
  }
}
