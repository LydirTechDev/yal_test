import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CodeTarifsZonesService } from './code-tarifs-zones.service';
import { CreateCodeTarifsZoneDto } from './dto/create-code-tarifs-zone.dto';
import { UpdateCodeTarifsZoneDto } from './dto/update-code-tarifs-zone.dto';

@Controller('code-tarifs-zones')
export class CodeTarifsZonesController {
  constructor(
    private readonly codeTarifsZonesService: CodeTarifsZonesService,
  ) {}

  @Post()
  create(@Body() createCodeTarifsZoneDto: CreateCodeTarifsZoneDto) {
    return this.codeTarifsZonesService.create(createCodeTarifsZoneDto);
  }
  @Post('createTarifsByFile')
  createTarifsByFile(@Body() tarifications) {
    console.log("🚀 ~ file: code-tarifs-zones.controller.ts ~ line 26 ~ CodeTarifsZonesController ~ createTarifsByFile ~ tarifications", tarifications)
    return this.codeTarifsZonesService.createTarifsByFile(tarifications);
  }
  @Get()
  findAll() {
    return this.codeTarifsZonesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.codeTarifsZonesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCodeTarifsZoneDto: UpdateCodeTarifsZoneDto,
  ) {
    return this.codeTarifsZonesService.update(+id, updateCodeTarifsZoneDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.codeTarifsZonesService.remove(+id);
  }
}
