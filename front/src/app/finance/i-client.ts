import { JourSemaineEnum } from '../core/models/JourSemaineEnum';
import { User } from '../core/models/user';

export interface IClient {
  id: number;

  numClient: string;

  raisonSociale: string;

  nomCommercial: string;

  adresse: string;

  telephone: string;

  nomGerant: string;

  prenomGerant: string;

  nrc: string;

  nif: string;

  nis: string;

  nbEnvoiMin: number;

  nbEnvoiMax: number;

  nbTentative: number;

  poidsBase: number;

  tauxCOD: number;

  typeTarif: string;

  moyenPayment: string;

  jourPayement: JourSemaineEnum;

  tarifRetour: number;

  createdAt: Date;

  updatedAt: Date;

  latitude: number;

  longitude: number;

  communeResidence: any;

  communeDepart: any;

  user: User;

  caisseAgence: any;

  clientsTarifs: any;
}
