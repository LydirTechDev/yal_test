import { IAgence } from '../agence/i-agence';
import { IUser } from '../users/i-user';
import { IBanque } from './i-banque';
import { IFonction } from './i-fonction';

export interface IEmploye {
  id: number;
  nom: string;
  prenom: string;
  dateNaissance: Date;
  lieuNaissance: string;
  adresse: string;
  numTelephone: string;
  dateRecrutement: Date;
  agence: IAgence;
  nss:number;
  numCompteBancaire:number;
  genre:string;
  groupeSanguin:string;
  typeContrat:string;
  fonction:IFonction;
  banque:IBanque;
  user:IUser
}
