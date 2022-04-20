import { Component, OnInit } from '@angular/core';
import {
  IPaginationLinks,
  IPaginationMeta,
} from 'src/app/core/interfaces/paginations';
import { Pagination } from 'src/app/core/interfaces/paginations/pagination';
import { User } from 'src/app/core/models/user';
import { SweetAlertService } from 'src/app/core/services/sweet-alert.service';
import { UsersService } from './users.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  breadCrumbItems: Array<{}>;
  userData: User[];
  metaData: IPaginationMeta;
  metaLinks: IPaginationLinks;
  isLoading: boolean;
  searchUserTerm: string;
  typeEmploye = {
    1976729: { text: 'client' },
    236359: { text: 'employe' },
    236429359: { text: 'operations' },
    42659985: { text: 'coursier' },
    963734: { text: 'admin' },
    548965156: { text: 'Caissier central' },
    1548965156: { text: 'Caissier regional' },
    2548965156: { text: 'Caissier agence' },
    2363594520: { text: 'Service client' },
  };

  constructor(
    private readonly usersService: UsersService,
    private sweetAlertService: SweetAlertService
  ) {
    this.isLoading = false;
    /**
     * initialis metaData to 0
     * initialis metaLik to 0
     */
    this._usersErrorAndInitialis();

    /**
     * load and intialise userData from Api
     */
    this.getAllUsers();
  }

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Utilisateurs' },
      { label: 'Liste', active: true },
    ];
  }

  searchTermUpdate(searchUserTerm: string): void {
    this.isLoading = true;
    setTimeout(() => {
      this.usersService.searchUsers(searchUserTerm).subscribe(
        (response) => {
          this._usersResponse(response);
        },
        (error) => {
          this._usersErrorAndInitialis(error);
        }
      );
    }, 330);
  }

  getAllUsers() {
    this.isLoading = true;
    this.usersService.getAllUsers().subscribe(
      (response) => {
        this._usersResponse(response);
      },
      (error) => {
        this._usersErrorAndInitialis(error);
      }
    );
  }

  funcPaginate(link: string, params?: number) {
    this.isLoading = true;
    setTimeout(() => {
      this.usersService
        .funcPaginate(link, params, this.searchUserTerm)
        .subscribe(
          (response) => {
            this._usersResponse(response);
          },
          (error) => {
            this._usersErrorAndInitialis(error);
          }
        );
    }, 330);
  }

  private _usersResponse(response: Pagination<User>) {
    this.userData = response.items;
    this.metaData = response.meta;
    this.metaLinks = response.links;
    this.isLoading = false;
  }

  private _usersErrorAndInitialis(error?: any) {
    this.userData = [];
    this.metaData = {
      itemCount: 0,
      totalItems: 0,
      itemsPerPage: 0,
      totalPages: 0,
      currentPage: 0,
    };
    this.metaLinks = {
      first: '',
      previous: '',
      next: '',
      last: '',
    };
    this.isLoading = false;
  }

  ActiveDesactive(id, valueSwitch, params?: number, searchUserTerm?: any) {
    const req = { isActive: valueSwitch };
    if (valueSwitch == true) {
      const alertTitle = 'Confirmation des modifications';
      const alertMessage = 'voulez vous activer cet utilisateur!';
      this.sweetAlertService
        .confirmStandard(alertTitle, alertMessage, '', '', null)
        .then((result) => {
          if (result.isConfirmed) {
            this.usersService.updateActvivityUser(id, req).subscribe(
              (response) => {
                this.sweetAlertService.modificationSucces(
                  'utilisateur activé avec succès'
                );
              },
              (error) => {
                this.sweetAlertService.modificationFailure(
                  'utilisateur non modifié!'
                );
              }
            );
          } else {
            if (searchUserTerm) {
              this.userData = [];
              this.getAllUsers();
              this.funcPaginate('', params);
            } else {
              this.userData = [];
              this.getAllUsers();
              this.funcPaginate('', params);
            }
          }
        });
    } else {
      const alertTitle = 'Confirmation des modifications';
      const alertMessage = 'voulez vous désactiver cet utilisateur!';
      this.sweetAlertService
        .confirmStandard(alertTitle, alertMessage, '', '', null)
        .then((result) => {
          if (result.isConfirmed) {
            this.usersService.updateActvivityUser(id, req).subscribe(
              (response) => {
                this.sweetAlertService.modificationSucces(
                  'utilisateur désactivé avec succès'
                );
              },
              (error) => {
                this.sweetAlertService.modificationFailure(
                  'utilisateur non modifié!'
                );
              }
            );
          } else {
            if (searchUserTerm) {
              this.userData = [];
              this.getAllUsers();
              this.funcPaginate('', params);
            } else {
              this.userData = [];
              this.getAllUsers();
              this.funcPaginate('', params);
            }
          }
        });
    }
  }
}
