import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  DefaultValuePipe,
  Query,
  Response,
} from '@nestjs/common';
import { FactureService } from './facture.service';
import { CreateFactureDto } from './dto/create-facture.dto';
import { UpdateFactureDto } from './dto/update-facture.dto';
import { Facture } from './entities/facture.entity';
import { Pagination } from 'nestjs-typeorm-paginate';
import { ApiQuery } from '@nestjs/swagger';

@Controller('facture')
export class FactureController {
  constructor(private readonly factureService: FactureService) {}

  @Post()
  create(@Body() createFactureDto: CreateFactureDto) {
    return this.factureService.create(createFactureDto);
  }

  @Get()
  findAll() {
    return this.factureService.findAll();
  }

  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  @ApiQuery({ name: 'searchFactureTerm', type: String, required: false })
  @Get('paginateFacture')
  findPaginateFacture(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit,
    @Query('searchFactureTerm') searchFactureTerm: string,
    @Query('payer') payer: string,
  ): Promise<Pagination<Facture>> {
    let paiement: boolean;
    if (payer == 'oui') {
      paiement = true;
    } else if (payer == 'non') {
      paiement = false;
    }
    return this.factureService.findPaginateFacture(
      {
        page,
        limit,
      },
      searchFactureTerm,
      paiement,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.factureService.findOne(+id);
  }

  @Patch('payer/:id')
  async payer(
    @Param('id') id: string,
    @Body() paiementInfo: any,
    @Response() res,
  ) {
    const buffer = await this.factureService.payerFacture(+id, paiementInfo);
    const buf = Buffer.from(buffer);
    res.send(buf);
    return res;
    
  }

  

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.factureService.remove(+id);
  }
}
