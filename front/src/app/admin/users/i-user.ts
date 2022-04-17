export interface IUser {
  id: number;
  email: string;
  isActive: boolean;
  //   lastIP: null;
  typeUser: number;
  createdAt: string;
  updatedAt: string;
  deleatedAt: string | null;
}
