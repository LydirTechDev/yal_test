import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BanquesService } from './banques.service';
import { CreateBanqueDto } from './dto/create-banque.dto';
import { UpdateBanqueDto } from './dto/update-banque.dto';

@Controller('banques')
export class BanquesController {
  constructor(private readonly banquesService: BanquesService) {}

  @Post()
  create(@Body() createBanqueDto: CreateBanqueDto) {
    return this.banquesService.create(createBanqueDto);
  }

  @Get()
  findAll() {
    return this.banquesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.banquesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBanqueDto: UpdateBanqueDto) {
    return this.banquesService.update(+id, updateBanqueDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.banquesService.remove(+id);
  }
}
