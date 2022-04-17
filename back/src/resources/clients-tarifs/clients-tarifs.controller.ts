import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ClientsTarifsService } from './clients-tarifs.service';
import { CreateClientsTarifDto } from './dto/create-clients-tarif.dto';
import { UpdateClientsTarifDto } from './dto/update-clients-tarif.dto';

@Controller('clients-tarifs')
export class ClientsTarifsController {
  constructor(private readonly clientsTarifsService: ClientsTarifsService) {}
    
  @Post()
  create(@Body() createClientsTarifDto: CreateClientsTarifDto) {
    return this.clientsTarifsService.create(createClientsTarifDto);
  }

  @Get()
  findAll() {
    return this.clientsTarifsService.findAll();
  }


  @Patch(':id')
  update(@Param('id') id: string, @Body() updateClientsTarifDto: UpdateClientsTarifDto) {
    return this.clientsTarifsService.update(+id, updateClientsTarifDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.clientsTarifsService.remove(+id);
  }
}
