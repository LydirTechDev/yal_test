import { TypeUserEnum } from "src/enums/TypeUserEnum";

export interface IUserResponse {
    id: number;
    email: string;
    password: string;
    isActive: boolean;
    typeUser: TypeUserEnum;
}