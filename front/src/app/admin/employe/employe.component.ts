import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IPaginationMeta,
  IPaginationLinks,
} from 'src/app/core/interfaces/paginations';
import { Pagination } from 'src/app/core/interfaces/paginations/pagination';
import { SweetAlertService } from 'src/app/core/services/sweet-alert.service';
import { EmployeService } from './employe.service';
import { IEmploye } from './i-employe';

@Component({
  selector: 'app-employe',
  templateUrl: './employe.component.html',
  styleUrls: ['./employe.component.scss'],
})
export class EmployeComponent implements OnInit {
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private employeService:EmployeService,
    private sweetAlertService:SweetAlertService
     ) {
    /**
     * init isLoading to false
     */
    this.isLoading = false;

    /**
     * init mataData to 0
     * init metaLinks to 0
     */
    this._employesErrorAndInitialis();
  }

  breadCrumbItems: Array<{}>;

  data = [];
  isLoading: boolean;
  metaData: IPaginationMeta;
  metaLinks: IPaginationLinks;
  searchEmployeTerm: string;
  employeData: IEmploye[];
  btnSpinner: boolean = false;

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Gestion des utilisateurs' },
      { label: 'Liste Employers', active: true },
    ];
    this.getPaginationEmploye()
  }

  ajouterEmploye() {
    this.router.navigateByUrl(`admin/employé/ajouter_employé`);
  }

  detailEmploye(id:number) {
    this.router.navigateByUrl(`admin/employé/detail_employé/${id}`);
  }

  getPaginationEmploye() {
    this.isLoading = true;
      this.employeService.getPaginateEmploye().subscribe(
        (response) => {
          this._employesResponse(response);
        },
        (error) => {
          this._employesErrorAndInitialis(error);
          this.sweetAlertService.sipmleAlertConfirme(
            'warning',
            'cannot load employés',
            error.message,
            true
          );
        }
      );
  }
  searchTermUpdate(searchEmployeTerm: string): void {
    this.isLoading = true;
    setTimeout(() => {
      this.employeService.searchEmploye(searchEmployeTerm).subscribe(
        (response) => {
          this._employesResponse(response);
        },
        (error) => {
          this._employesErrorAndInitialis(error);
        }
      );
    }, 330);
  }

  funcPaginate(link: string, page?: number): void {
    this.isLoading = true;
      this.employeService.funcPaginate(link, page, this.searchEmployeTerm).subscribe(
        (response) => {
          this._employesResponse(response);
        },
        (error) => {
          this._employesErrorAndInitialis(error);
        }
    );
  }

  private _employesResponse(response: Pagination<IEmploye>) {
    this.employeData = response.items;
    this.metaData = response.meta;
    this.metaLinks = response.links;
    this.isLoading = false;
  }
  private _employesErrorAndInitialis(error?: any) {
    this.employeData = [];
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

  ActiveDesactive(id: number, valueSwitch: any, params?: number, searchEmployeTerm?: any) {
    let req: any;
    if (valueSwitch == true) {
      req = { "isActive": "true" }
      const alertTitle = 'Confirmation des modifications';
      const alertMessage = 'voulez vous activer cet employé!';
      this.sweetAlertService
        .confirmStandard(alertTitle, alertMessage, '', '', null)
        .then((result) => {
          if (result.isConfirmed) {

            this.employeService.updateActivityEmploye(id, req).subscribe(
              (response) => {
                this.sweetAlertService.modificationSucces("employé activé avec succès")
              },
              (error) => {
                this.sweetAlertService.modificationFailure("employé non modifié!")
              }
            )
          } else {
            if (searchEmployeTerm) {
              this.employeData = [];
              this.getPaginationEmploye();
              this.funcPaginate('', params)
            } else {
              this.employeData = [];
              this.getPaginationEmploye();
              this.funcPaginate('', params)
            }
          }

        });
    } else {
      req = { "isActive": "false" }
      const alertTitle = 'Confirmation des modifications';
      const alertMessage = 'voulez vous désactiver cet employé!';
      this.sweetAlertService
        .confirmStandard(alertTitle, alertMessage, '', '', null)
        .then((result) => {
          if (result.isConfirmed) {
            this.employeService.updateActivityEmploye(id, req).subscribe(
              (response) => {
                this.sweetAlertService.modificationSucces("employé désactivé avec succès")
              },
              (error) => {
                this.sweetAlertService.modificationFailure("employé non modifié!")
              }
            )
          }
          else {
            if (searchEmployeTerm) {
              this.employeData = [];
              this.getPaginationEmploye();
              this.funcPaginate('', params)
            } else {
              this.employeData = [];
              this.getPaginationEmploye();
              this.funcPaginate('', params)
            }
          }

        });
    }

  }
}
