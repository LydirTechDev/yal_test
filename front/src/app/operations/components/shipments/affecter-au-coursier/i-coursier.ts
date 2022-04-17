import { IAgence } from "src/app/admin/agence/i-agence";
import { IUser } from "src/app/admin/users/i-user";

export interface ICoursier {
  id: number;
  nom: string;
  prenom: string;
  dateNaissance: Date;
  lieuNaissance: string;
  adresse: string;
  numTelephone: string;
  dateRecrutement: Date;
  agence: IAgence;
  montantRamassage: number;
  montantLivraison: number;
  MarqueVehicule: string;
  immatriculationVehicule: string;
  user:IUser
}
