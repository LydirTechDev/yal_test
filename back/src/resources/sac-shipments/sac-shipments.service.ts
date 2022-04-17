import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SacService } from '../sac/sac.service';
import { ShipmentsService } from '../shipments/shipments.service';
import { CreateSacShipmentDto } from './dto/create-sac-shipment.dto';
import { UpdateSacShipmentDto } from './dto/update-sac-shipment.dto';
import { SacShipment } from './entities/sac-shipment.entity';

/**
 *
 */
@Injectable()
export class SacShipmentsService {
  constructor(
    @InjectRepository(SacShipment)
    private sacShipmentRepository: Repository<SacShipment>,
    private shipmentService: ShipmentsService,
    @Inject(forwardRef(() => SacService))
    private sacService: SacService,
  ) {}

  async create(createSacShipmentDto: CreateSacShipmentDto) {
    const createdSacShipment = this.sacShipmentRepository.create();
    createdSacShipment.shipment = await this.shipmentService.findOneById(
      createSacShipmentDto.shipmentId,
    );
    createdSacShipment.sac = await this.sacService.findOneById(
      createSacShipmentDto.sacId,
    );
    return await this.sacShipmentRepository.save(createdSacShipment);
  }

  findAll() {
    return `This action returns all sacShipments`;
  }

  findOne(id: number) {
    return `This action returns a #${id} sacShipment`;
  }

  update(id: number, updateSacShipmentDto: UpdateSacShipmentDto) {
    return `This action updates a #${id} sacShipment`;
  }

  remove(id: number) {
    return `This action removes a #${id} sacShipment`;
  }
}
