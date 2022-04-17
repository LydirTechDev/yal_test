import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Pagination } from 'src/app/core/interfaces/paginations/pagination';
import { User } from 'src/app/core/models/user';
import { environment } from 'src/environments/environment';
import { IUser } from './i-user';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(
    private readonly http: HttpClient
  ) { }

  getAllUsers(): Observable<Pagination<User>>{
    return this.http.get<Pagination<User>>(`${environment.apiV1}users`)
  }

  funcPaginate(
    link?: string,
    page?: number,
    search?: string
  ): Observable<Pagination<User>> {
    if (page && search == undefined) {
      link = `${environment.apiV1}users?page=${page}`;
      return this.http.get<Pagination<User>>(link)
    }
    if (page && search) {
      link = `${environment.apiV1}users?searchUserTerm=${search}&page=${page}`;
      return this.http.get<Pagination<User>>(link)
    }
    if (search) {
      return this.http.get<Pagination<User>>(`${link}&searchUserTerm=${search}`);
    }
    return this.http.get<Pagination<User>>(link);
  }

  searchUsers(searchUserTerm: string){
    return this.http.get<Pagination<User>>(`${environment.apiV1}users?searchUserTerm=${searchUserTerm}`)
  }
  updateUser(id, valueActive): Observable<IUser> {
    return this.http.patch<IUser>(`${environment.apiV1}users/${id}`, valueActive)
  }

  updateActvivityUser(id, valueActive): Observable<IUser> {
    return this.http.patch<IUser>(
      `${environment.apiV1}users/${id}/setActivity`,
      valueActive
    );
  }
}
