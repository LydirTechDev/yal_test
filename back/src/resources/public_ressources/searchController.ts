import { Controller, Get, Param, Request } from '@nestjs/common';
import { ShipmentsService } from '../shipments/shipments.service';

@Controller('PublicRessources')
export class PublicRessourcesController {
  constructor(private readonly shipmentsService: ShipmentsService) {}
  @Get('searchTracking/:tracking')
  serchTracking(@Request() req, @Param('tracking') tracking: string) {
    console.log(tracking);
    const express_reg = new RegExp(/^\d{8}$/, 'i');
    if (express_reg.test(tracking)) {
      return this.shipmentsService.searchTrackingPublic(tracking.toLowerCase());
    }
  }
}
