import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { CodeTarifService } from './code-tarif.service';
import { CreateCodeTarifDto } from './dto/create-code-tarif.dto';
import { UpdateCodeTarifDto } from './dto/update-code-tarif.dto';
import { CodeTarif } from './entities/code-tarif.entity';

@Controller('code-tarif')
export class CodeTarifController {
  constructor(private readonly codeTarifService: CodeTarifService) {}

  /**
   * get count of all code tarif
   * @returns 
   */
  @Get('nbCodeTarif')
  getNbCodeTarif() {
    return this.codeTarifService.getNbCodeTarif();
  }

  @Post()
  create(@Body() createCodeTarifDto: CreateCodeTarifDto) {
    return this.codeTarifService.create(createCodeTarifDto);
  }

  @Post('create-new-tarification')
  createNewTarification(@Body() newTarification: any) {
    return this.codeTarifService.createNewTarification(newTarification);
  }
  
  
  @Get()
  findAll() {
    return this.codeTarifService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.codeTarifService.findOneCodeTarifById(+id); 
  }

  @Get('chekIfServiceExist/:codeTarifName')
  chekIfServiceExist(
    @Param('codeTarifName') codeTarifName: string,
  ): Promise<boolean> {
    return this.codeTarifService.chekIfServiceExist(codeTarifName);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCodeTarifDto: UpdateCodeTarifDto,
  ) {
    return this.codeTarifService.update(+id, updateCodeTarifDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.codeTarifService.remove(+id);
  }
  @Get('serviceId/:id')
  getCodeTarifByServiceId(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<CodeTarif[]> {
    return this.codeTarifService.getTarifByserviceId(id);
  }
}
