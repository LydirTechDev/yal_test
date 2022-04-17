import { IDepartement } from "./i-departement";

export interface IFonction {
  id:number;
  nom:string;
  dureeEssai:number;
  departement:IDepartement;
}
