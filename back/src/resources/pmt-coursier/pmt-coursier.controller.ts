import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  DefaultValuePipe,
  Query,
  Response,
  Req,
} from '@nestjs/common';
import { PmtCoursierService } from './pmt-coursier.service';
import { CreatePmtCoursierDto } from './dto/create-pmt-coursier.dto';
import { UpdatePmtCoursierDto } from './dto/update-pmt-coursier.dto';
import { ApiQuery } from '@nestjs/swagger';
import { Pagination } from 'nestjs-typeorm-paginate';
import { PmtCoursier } from './entities/pmt-coursier.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RoleGuard } from 'src/auth/guards/role.guard';

@Controller('pmtCoursier')
@UseGuards(JwtAuthGuard, RoleGuard)

export class PmtCoursierController {
  constructor(private pmtCoursierService: PmtCoursierService) {}

  @Get()
  findAll() {
    return this.pmtCoursierService.findAll();
  }
  @Get('printPmtc/:id')
  async printPmtc(@Param('id', ParseIntPipe) idPmtc: number, @Response() res) {
    const buffer = await this.pmtCoursierService.printPmtCoursier(idPmtc);
    console.log(
      '🚀 ~ file: pmt-coursier.controller.ts ~ line 39 ~ PmtCoursierController ~ printPmtc ~ idPmtc',
      idPmtc,
    );
    const buf = Buffer.from(buffer);
    res.send(buf);
    return res;
  }

  @Get('getPaiementDetailsCoursier/:tracking')
  getPaiementDetailsCoursier(@Req() req, @Param('tracking') tracking) {
    return this.pmtCoursierService.getPaiementDetailsCoursier(req.user, tracking);
  }
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  @ApiQuery({ name: 'searchPmtcTerm', type: String, required: false })
  @Get('paginatePmtc')
  findPaginateCoursier(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit,
    @Query('searchPmtcTerm') searchPmtcTerm: string,
  ): Promise<Pagination<PmtCoursier>> {
    return this.pmtCoursierService.findPmtCoursier(
      {
        page,
        limit,
      },
      searchPmtcTerm,
    );
  }
  @Get('find-all-paginate-pmt-coursier')
  findAllPaginatePmtCoursier(
    @Req() req,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit,
    @Query('searchPmtTerm') searchPmtTerm: string,
  ) {
    return this.pmtCoursierService.findPaginatePmtCoursierforCoursier(
      {
        page,
        limit,
      },
      req.user,
      searchPmtTerm,
    );
  }
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.pmtCoursierService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePmtCoursierDto: UpdatePmtCoursierDto,
  ) {
    return this.pmtCoursierService.update(+id, updatePmtCoursierDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pmtCoursierService.remove(+id);
  }
}
