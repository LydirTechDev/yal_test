import { JourSemaineEnum } from "src/app/core/models/JourSemaineEnum";
import { IAgence } from "../agence/i-agence";
import { ICommune } from "../commune/i-commune";
import { IUser } from "../users/i-user";


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
  moyenPayment: string;
  jourPayement: JourSemaineEnum;
  tarifRetour: number;
  communeResidence: ICommune;
  communeDepart:ICommune;
  agenceRetour:IAgence;
  caisseAgence:IAgence;
  user:IUser
}
