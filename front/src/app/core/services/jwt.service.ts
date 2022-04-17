import { Injectable } from '@angular/core';
import jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class JWTTokenService {

    jwtToken!: string;
    decodedToken!: { [key: string]: string };

    constructor() {
    }

    setToken(token: string) {
      if (token) {
        this.jwtToken = token;
        localStorage.setItem('access_token', token)
      }
    }

    decodeToken() {
      if (this.jwtToken) {
      this.decodedToken = jwt_decode(this.jwtToken);
      // console.log(this.decodedToken);
      }
    }

    getDecodeToken() {
      return jwt_decode(this.jwtToken);
    }

    getUserId() {
      this.decodeToken();
      // return this.decodedToken ? this.decodedToken.Id : null;
      return this.decodedToken.id;
    }

    getUserEmail() {
      this.decodeToken();
      return this.decodedToken.email ;
      // return this.decodedToken ? this.decodedToken.userEmail : null;
    }

    getUserName() {
      this.decodeToken();
      return this.decodedToken.username;
      // return this.decodedToken ? this.decodedToken.userName : null;
    }

    getTypeUser() {
      this.decodeToken();
      return this.decodedToken.typeUser;
      // return this.decodedToken ? this.decodedToken.userType : null;
    }

    getUserRole() {
      this.decodeToken();
      return this.decodedToken ? this.decodedToken.userRole : null;
    }

    getUserActive() {
      this.decodeToken();
      return this.decodedToken.isActive;
      // return this.decodedToken ? this.decodedToken.userActive : null;
    }

    getExpiryTime() {
      this.decodeToken();
      // return this.decodedToken ? this.decodedToken.exp : null;
      return this.decodedToken.exp ;
    }

    isTokenExpired(): boolean {
      const expiryTime: number = +this.getExpiryTime();
      if (expiryTime) {
        return ((1000 * expiryTime) - (new Date()).getTime()) < 5000;
      } else {
        return false;
      }
    }
}

