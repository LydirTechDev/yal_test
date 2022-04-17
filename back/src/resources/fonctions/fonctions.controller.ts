import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { FonctionsService } from './fonctions.service';
import { CreateFonctionDto } from './dto/create-fonction.dto';
import { UpdateFonctionDto } from './dto/update-fonction.dto';
import { ApiQuery } from '@nestjs/swagger';
import { Fonction } from './entities/fonction.entity';

@Controller('fonctions')
export class FonctionsController {
  constructor(private readonly fonctionsService: FonctionsService) {}

  @Post()
  create(@Body() createFonctionDto: CreateFonctionDto) {
    return this.fonctionsService.create(createFonctionDto);
  }

  @ApiQuery({ name: 'departementId', type: Number, required: false })
  @Get('departement/:departementId')
  findFonctionsByDepartementId(
    @Param('departementId') id: number,
  ): Promise<Fonction[]> {
    return this.fonctionsService.findFonctionByDepartementId(id);
  }
  @Post('createFonctionByFile')
  createFonctionByFile(@Body() functions) {
    if (functions.length > 1) {
      return this.fonctionsService.createFonctionByFile(functions);
    }
  }

  @Get()
  findAll() {
    return this.fonctionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fonctionsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateFonctionDto: UpdateFonctionDto,
  ) {
    return this.fonctionsService.update(+id, updateFonctionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.fonctionsService.remove(+id);
  }
}
