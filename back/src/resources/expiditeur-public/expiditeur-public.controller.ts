import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ExpiditeurPublicService } from './expiditeur-public.service';
import { CreateExpiditeurPublicDto } from './dto/create-expiditeur-public.dto';
import { UpdateExpiditeurPublicDto } from './dto/update-expiditeur-public.dto';

@Controller('expiditeur-public')
export class ExpiditeurPublicController {
  constructor(private readonly expiditeurPublicService: ExpiditeurPublicService) {}

  // @Post()
  // create(@Body() createExpiditeurPublicDto: CreateExpiditeurPublicDto) {
  //   return this.expiditeurPublicService.create(createExpiditeurPublicDto);
  // }

  @Get()
  findAll() {
    return this.expiditeurPublicService.findAll();
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.expiditeurPublicService.findOne(+id);
  // }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateExpiditeurPublicDto: UpdateExpiditeurPublicDto) {
    return this.expiditeurPublicService.update(+id, updateExpiditeurPublicDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.expiditeurPublicService.remove(+id);
  }
}
