import { Client } from 'src/resources/clients/entities/client.entity';
import { CodeTarif } from 'src/resources/code-tarif/entities/code-tarif.entity';
import { ManyToOne, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class ClientsTarif {
  @PrimaryColumn()
  clientId: number;
  @ManyToOne(() => Client, (client) => client.clientsTarifs, {
    primary: true,
  })
  client: Client;

  @PrimaryColumn()
  codeTarifId: number;

  @ManyToOne(() => CodeTarif, (codeTarif) => codeTarif.clientsTarifs, {
    primary: true,
  })
  codeTarif: CodeTarif;
}
