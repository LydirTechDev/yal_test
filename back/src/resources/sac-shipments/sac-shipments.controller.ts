import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SacShipmentsService } from './sac-shipments.service';
import { CreateSacShipmentDto } from './dto/create-sac-shipment.dto';
import { UpdateSacShipmentDto } from './dto/update-sac-shipment.dto';

@Controller('sac-shipments')
export class SacShipmentsController {
  constructor(private readonly sacShipmentsService: SacShipmentsService) {}

  @Post()
  create(@Body() createSacShipmentDto: CreateSacShipmentDto) {
    return this.sacShipmentsService.create(createSacShipmentDto);
  }

  @Get()
  findAll() {
    return this.sacShipmentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sacShipmentsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSacShipmentDto: UpdateSacShipmentDto) {
    return this.sacShipmentsService.update(+id, updateSacShipmentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sacShipmentsService.remove(+id);
  }
}
