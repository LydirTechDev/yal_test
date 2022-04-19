import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  Res,
  Response,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { PmtService } from './pmt.service';
import { CreatePmtDto } from './dto/create-pmt.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { stringify } from 'querystring';

@UseGuards(JwtAuthGuard, RoleGuard)
@Controller('pmt')
export class PmtController {
  constructor(private readonly pmtService: PmtService) {}

  @Post()
  create(@Body() createPmtDto: CreatePmtDto) {
    return this.pmtService.create(createPmtDto);
  }
  @Get('find-all-paginate-pmt-client')
  findAllPaginatePmtClient(
    @Req() req,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit,
    @Query('searchPmtTerm') searchPmtTerm: string,
  ) {
    console.log('snfvejnvjenjrne');
    return this.pmtService.findAllPaginatePmtClient(
      {
        page,
        limit,
      },
      req.user,
      searchPmtTerm,
    );
  }

  @Get('print-pmt-client/:pmtTraking')
  printPmtClient(@Req() req, @Param() pmtTraking, @Res() res: Response) {
    return this.pmtService.printPmtCLientById(
      pmtTraking.pmtTraking,
      req.user,
      res,
    );
  }
  @Get('getPaiementDetails/:tracking')
  getPaiementDetails(@Param('tracking') tracking) {
    return this.pmtService.getPaiementDetails(tracking);
  }

  @Get('find-all-paginate-pmt')
  findAllPaginatePmt(
    @Req() req,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit,
    @Query('searchPmtTerm') searchPmtTerm: string,
  ) {
    console.log('hbsdyubyubu');
    return this.pmtService.findAllPaginatePmt(
      {
        page,
        limit,
      },
      req.user,
      searchPmtTerm,
    );
  }

  @Get('payerClient/:id')
  payerClient(@Req() req, @Param() clientId, @Res() res: Response) {
    return this.pmtService.payerClient(req.user, clientId, res);
  }

  @Get('print-pmt/:pmtTraking')
  printPmt(@Req() req, @Param() pmtTraking, @Res() res: Response) {
    console.log(
      '🚀 ~ file: pmt.controller.ts ~ line 57 ~ PmtController ~ printPmt ~ pmtTraking',
      pmtTraking.pmtTraking,
    );
    console.log(
      '🚀 ~ file: pmt.controller.ts ~ line 57 ~ PmtController ~ printPmt ~ req',
      req.user,
    );
    return this.pmtService.printPmtById(pmtTraking.pmtTraking, req.user, res);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pmtService.findOne(+id);
  }

  //
}
