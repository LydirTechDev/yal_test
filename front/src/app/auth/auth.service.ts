import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Route, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { DBkeys } from '../core/models/db-keys';
import { User } from '../core/models/user';
import { JWTTokenService } from '../core/services/jwt.service';
import { LocalStoreManager } from '../core/services/local-store-manager.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private previousIsLoggedInCheck = false;
  public loginStatus = new Subject<boolean>();

  constructor(
    private http: HttpClient,
    private jwtTokenService: JWTTokenService,
    private localStorage: LocalStoreManager,
    private router: Router
  ) {
    this.initializeLoginStatus();
  }

  /**
   * function
   */
  private initializeLoginStatus() {
    this.localStorage.getInitEvent().subscribe(() => {
      this.reevaluateLoginStatus();
    });
  }

  /**
   * login Function
   * @param email
   * @param password
   * @param rememberMe
   * @returns
   */
  async login(email: string, password: string, rememberMe: boolean) {
    return this.http
      .post<{ access_token: string }>(`${environment.apiV1}auth/login`, {
        email: email,
        password: password,
      })
      .pipe(
        map((response) => {
          console.log(
            '🚀 ~ file: auth.service.ts ~ line 52 ~ AuthService ~ map ~ response',
            response
          );
          this.processLogin(response, rememberMe);
        })
      );
  }

  async processLogin(resp: { access_token: string }, rememberMe: boolean) {
    const accessToken = resp.access_token;
    // console.log("acces : " + accessToken)
    if (accessToken == null) {
      throw new Error('accessToken cannot be null');
    }
    this.jwtTokenService.setToken(accessToken);
    const decodedAccessToken = this.jwtTokenService.getDecodeToken();
    const expiresIn = +this.jwtTokenService.getExpiryTime();
    const tokenExpiryDate = new Date(0);
    tokenExpiryDate.setUTCSeconds(expiresIn);
    const accessTokenExpiry = tokenExpiryDate;
    const user = new User();
    user.id = +this.jwtTokenService.getUserId();
    user.email = this.jwtTokenService.getUserEmail();
    user.typeUser = this.jwtTokenService.getTypeUser();

    this.saveUserDetails(
      user,
      accessToken,
      /*refreshToken,*/ accessTokenExpiry,
      rememberMe
    );

    this.reevaluateLoginStatus(user);
    return user;
  }

  private saveUserDetails(
    user: User,
    accessToken: string,
    /*refreshToken: string,*/ expiresIn: Date,
    rememberMe: boolean
  ) {
    if (rememberMe) {
      this.localStorage.savePermanentData(accessToken, DBkeys.ACCESS_TOKEN);
      //this.localStorage.savePermanentData(refreshToken, DBkeys.REFRESH_TOKEN);
      this.localStorage.savePermanentData(expiresIn, DBkeys.TOKEN_EXPIRES_IN);
      //this.localStorage.savePermanentData(permissions, DBkeys.USER_PERMISSIONS);
      this.localStorage.savePermanentData(user, DBkeys.CURRENT_USER);
    } else {
      this.localStorage.saveSyncedSessionData(accessToken, DBkeys.ACCESS_TOKEN);
      //this.localStorage.saveSyncedSessionData(refreshToken, DBkeys.REFRESH_TOKEN);
      this.localStorage.saveSyncedSessionData(
        expiresIn,
        DBkeys.TOKEN_EXPIRES_IN
      );
      //this.localStorage.saveSyncedSessionData(permissions, DBkeys.USER_PERMISSIONS);
      this.localStorage.saveSyncedSessionData(user, DBkeys.CURRENT_USER);
    }
    this.localStorage.savePermanentData(rememberMe, DBkeys.REMEMBER_ME);
  }

  /**
   *
   */
  logout() {
    // console.log("logout")
    this.localStorage.deleteData(DBkeys.ACCESS_TOKEN);
    this.localStorage.deleteData(DBkeys.REFRESH_TOKEN);
    this.localStorage.deleteData(DBkeys.TOKEN_EXPIRES_IN);
    this.localStorage.deleteData(DBkeys.USER_PERMISSIONS);
    this.localStorage.deleteData(DBkeys.CURRENT_USER);

    //this.configurations.clearLocalChanges();

    this.reevaluateLoginStatus();
    this.router.navigate(['/auth/login']);
  }

  private reevaluateLoginStatus(currentUser?: User) {
    const user =
      currentUser || this.localStorage.getDataObject<User>(DBkeys.CURRENT_USER);
    const isLoggedIn = user != null;

    if (this.previousIsLoggedInCheck !== isLoggedIn) {
      setTimeout(() => {
        this.loginStatus.next(isLoggedIn);
      }, 5000);
    }
    this.previousIsLoggedInCheck = isLoggedIn;
  }

  /**
   *
   * @returns
   */
  getLoginStatusEvent(): Observable<boolean> {
    return this.loginStatus.asObservable();
  }

  get currentUser(): User {
    const accessToken = this.getJWTToken();
    if (accessToken) {
      this.jwtTokenService.setToken(accessToken);
      const decodedAccessToken = this.jwtTokenService.getDecodeToken();
      const user = new User();
      user.id = +this.jwtTokenService.getUserId();
      user.email = this.jwtTokenService.getUserEmail();
      user.typeUser = this.jwtTokenService.getTypeUser();

      //const user = this.localStorage.getDataObject<User>(DBkeys.CURRENT_USER);  faille de sécurité !
      this.reevaluateLoginStatus(user);

      return user;
    }
  }

  get rememberMe(): boolean {
    return (
      this.localStorage.getDataObject<boolean>(DBkeys.REMEMBER_ME) === true
    );
  }

  getJWTToken() {
    return this.localStorage.getDataObject<string>(DBkeys.ACCESS_TOKEN);
  }

  get isLoggedIn(): boolean {
    return this.currentUser != null;
  }

  redirectLoggedUser(user: User): Boolean {
    let isRedirected: boolean = false;
    switch (user.typeUser) {
      case '963734':
        this.router.navigate(['/admin']);
        isRedirected = true;
        break;
      case '1976729':
        this.router.navigate(['/client']);
        isRedirected = true;
        break;
      case '236429359':
        this.router.navigate(['/operations']);
        isRedirected = true;
        break;
      case '42659985':
        this.router.navigate(['/coursier']);
        isRedirected = true;
        break;
      case '548965156':
        this.router.navigate(['/finance']);
        isRedirected = true;
        break;
      case '1548965156':
        this.router.navigate(['/finance']);
        isRedirected = true;
        break;
      case '2548965156':
        this.router.navigate(['/finance']);
        isRedirected = true;
        break;
      default:
        break;
    }
    return isRedirected;
  }
}
