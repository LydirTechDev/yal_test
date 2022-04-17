import {
  forwardRef,
  Inject,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityNotFoundError, Repository } from 'typeorm';
import { ClientsService } from '../clients/clients.service';
import { CodeTarifService } from '../code-tarif/code-tarif.service';
import { CreateClientsTarifDto } from './dto/create-clients-tarif.dto';
import { UpdateClientsTarifDto } from './dto/update-clients-tarif.dto';
import { ClientsTarif } from './entities/clients-tarif.entity';

/**
 *
 */
@Injectable()
export class ClientsTarifsService {
  constructor(
    @InjectRepository(ClientsTarif)
    private clientTarifRepository: Repository<ClientsTarif>,
    @Inject(forwardRef(() => ClientsService))
    private clientService: ClientsService,
    @Inject(forwardRef(() => CodeTarifService))
    private codeTarifService: CodeTarifService,
  ) {}

  async create(createClientsTarifDto: CreateClientsTarifDto) {
    const clientTarif = await this.findOneTarifByCodeTarifId_ClientId(
      createClientsTarifDto.codeTarifId,
      createClientsTarifDto.clientId,
    );
    if (clientTarif) {
      throw new UnprocessableEntityException(
        ClientsTarif,
        'ce client contient déja ce type de tarif',
      );
    } else {
      const client = await this.clientService.findOneClientById(
        createClientsTarifDto.clientId,
      );
      const codeTarif = await this.codeTarifService.findOne(
        createClientsTarifDto.codeTarifId,
      );
      const clientTarif = this.clientTarifRepository.create(
        createClientsTarifDto,
      );
      clientTarif.client = client;
      clientTarif.codeTarif = codeTarif;
      return await this.clientTarifRepository.save(clientTarif);
    }
  }
  async findOneTarifByCodeTarifId_ClientId(
    codeTarifId: number,
    clientId: number,
  ): Promise<ClientsTarif> {
    const tarifClient = await this.clientTarifRepository.findOne({
      where: {
        codeTarif: {
          id: codeTarifId,
        },
        client: {
          id: clientId,
        },
      },
    });
    return tarifClient;
  }

  findAll() {
    return `This action returns all clientsTarifs`;
  }

  async getCodeTarif(serviceId: number, clientId: number) {
    const codeTarif = await this.clientTarifRepository
      .createQueryBuilder('clientsTarif')
      .leftJoinAndSelect('clientsTarif.codeTarif', 'codeTarif')
      .leftJoinAndSelect('clientsTarif.client', 'client')
      .leftJoinAndSelect('codeTarif.service', 'service')
      .select('codeTarif.id')
      .where(`service.id = '${serviceId}'`)
      .andWhere(`client.id = '${clientId}'`)
      .getRawOne();

    if (codeTarif) {
      return codeTarif;
    } else {
      throw new EntityNotFoundError(ClientsTarif, { serviceId, clientId });
    }
  }

  update(id: number, updateClientsTarifDto: UpdateClientsTarifDto) {
    return `This action updates a #${id} clientsTarif`;
  }

  remove(id: number) {
    return `This action removes a #${id} clientsTarif`;
  }
}
