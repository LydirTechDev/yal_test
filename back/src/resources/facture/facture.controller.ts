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
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { FactureService } from './facture.service';
import { CreateFactureDto } from './dto/create-facture.dto';
import { UpdateFactureDto } from './dto/update-facture.dto';
import { Facture } from './entities/facture.entity';
import { Pagination } from 'nestjs-typeorm-paginate';
import { ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RoleGuard } from 'src/auth/guards/role.guard';

@UseGuards(JwtAuthGuard, RoleGuard)
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

  @Get('printFactureClassique/:id')
  async printFactureClassique(@Param('id') idFacture, @Response() res) {
    const buffer = await this.factureService.prinFactureClassique(idFacture);
    const buf = Buffer.from(buffer);
    res.send(buf);
    return res;
  }

  @Get('printFactureEcommerceDetail/:id')
  async printFactureEcommerceDetail(@Param('id') idFacture, @Response() res) {
    const buffer = await this.factureService.prinFactureEcommerceDetail(idFacture);
    const buf = Buffer.from(buffer);
    res.send(buf);
    return res;
  }

  @Get('printFactureEcommerceSimplifier/:id')
  async printFactureEcommerceSimplifier(@Param('id') idFacture, @Response() res) {
    const buffer = await this.factureService.prinFactureEcommerceSimplifie(idFacture);
    const buf = Buffer.from(buffer);
    res.send(buf);
    return res;
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
    @Query('type') type: string,
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
      type,
    );
  }
  @Get('getFactureEspeceNonRecolter')
  getFactureEspeceNonRecolter(@Req() req) {
    return this.factureService.getFactureEspeceNonRecolter(req.user.id);
  }

  @Get('factureClassique/:id')
  findOneFactureClassique(@Param('id') id: string) {
    return this.factureService.findOneFactureClassique(+id);
  }

  @Get('factureEcommerce/:id')
  findOneFactureEcommerce(@Param('id') id: string) {
    return this.factureService.findOneFactureEcommerce(+id);
  }

  @Get('statistique')
  getStatistique() {
    return this.factureService.getStatistique();
  }

  
  @Patch('recolterFacture')
  async recolterFacture(@Req() req,@Res() res ) {
    const buffer = await this.factureService.recolterFacture(req.user.id);
    const buf = Buffer.from(buffer);
    res.send(buf);
    return res;
  }

  @Patch('payer/:id')
  payer(
    @Param('id') id: string,
    @Body() paiementInfo: any,
  ) {
    return this.factureService.payerFacture(+id, paiementInfo);    
  }

  

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.factureService.remove(+id);
  }
}
