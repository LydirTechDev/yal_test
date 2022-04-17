import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { IPaginationLinks, IPaginationMeta } from 'src/app/core/interfaces/paginations';
import { Pagination } from 'src/app/core/interfaces/paginations/pagination';
import { SweetAlertService } from 'src/app/core/services/sweet-alert.service';
import { ICoursier } from 'src/app/operations/components/shipments/affecter-au-coursier/i-coursier';
import { CoursierService } from './coursier.service';

@Component({
  selector: 'app-coursier',
  templateUrl: './coursier.component.html',
  styleUrls: ['./coursier.component.scss'],
})
export class CoursierComponent implements OnInit {
  constructor(
    private formBuilder: FormBuilder,
    private coursierService: CoursierService,
    private sweetAlertService: SweetAlertService,
    private router: Router
  ) {
    /**
    * init isLoading to false
    */
    this.isLoading = false;

    /**
     * init mataData to 0
     * init metaLinks to 0
     */
    this._coursiersErrorAndInitialis();
  }

  breadCrumbItems: Array<{}>;
  data = [];
  isLoading: boolean;
  metaData: IPaginationMeta;
  metaLinks: IPaginationLinks;
  searchCoursierTerm: string;
  coursierData: ICoursier[];
  btnSpinner: boolean = false;

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Gestion des utilisateurs' },
      { label: 'Liste coursiers', active: true },
    ];
    this.getPaginationCoursier();
  }

  ajouterCoursier() {
    this.router.navigateByUrl(`admin/coursier/ajouter_coursier`);
  }

  detailCoursier(id: number) {
    this.router.navigateByUrl(`admin/coursier/detail_coursier/${id}`);
  }


  getPaginationCoursier() {
    this.isLoading = true;
    this.coursierService.getPaginateCoursier().subscribe(
      (response) => {
        this._coursiersResponse(response);
      },
      (error) => {
        this._coursiersErrorAndInitialis(error);
        this.sweetAlertService.sipmleAlertConfirme(
          'warning',
          'cannot load coursiers',
          error.message,
          true
        );
      }
    );
  }

  searchTermUpdate(searchCoursierTerm: string): void {
    this.isLoading = true;
    setTimeout(() => {
      this.coursierService.searchCoursier(searchCoursierTerm).subscribe(
        (response) => {
          this._coursiersResponse(response);
        },
        (error) => {
          this._coursiersErrorAndInitialis(error);
        }
      );
    }, 330)
  }

  funcPaginate(link: string, page?: number): void {
    this.isLoading = true;
    setTimeout(() => {
      this.coursierService.funcPaginate(link, page, this.searchCoursierTerm).subscribe(
        (response) => {
          this._coursiersResponse(response);
        },
        (error) => {
          this._coursiersErrorAndInitialis(error);
        }
      );
    }, 330);
  }

  private _coursiersResponse(response: Pagination<ICoursier>) {
    this.coursierData = response.items;
    this.metaData = response.meta;
    this.metaLinks = response.links;
    this.isLoading = false;
  }

  private _coursiersErrorAndInitialis(error?: any) {
    this.coursierData = [];
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

  ActiveDesactive(id: number, valueSwitch: any, params?: number, searchCoursierTerm?: any) {
    let req: any;
    if (valueSwitch == true) {
      req = { "isActive": "true" }
      const alertTitle = 'Confirmation des modifications';
      const alertMessage = 'voulez vous activer ce coursier!';
      this.sweetAlertService
        .confirmStandard(alertTitle, alertMessage, '', '', null)
        .then((result) => {
          if (result.isConfirmed) {

            this.coursierService.updateActivityCoursier(id, req).subscribe(
              (response) => {
                this.sweetAlertService.modificationSucces("coursier activé avec succès")
              },
              (error) => {
                this.sweetAlertService.modificationFailure("coursier non modifié!")
              }
            )
          } else {
            if (searchCoursierTerm) {
              this.coursierData = [];
              this.getPaginationCoursier();
              this.funcPaginate('', params)
            } else {
              this.coursierData = [];
              this.getPaginationCoursier();
              this.funcPaginate('', params)
            }
          }

        });
    } else {
      req = { "isActive": "false" }
      const alertTitle = 'Confirmation des modifications';
      const alertMessage = 'voulez vous désactiver ce coursier!';
      this.sweetAlertService
        .confirmStandard(alertTitle, alertMessage,'','',null)
        .then((result) => {
          if (result.isConfirmed) {
            this.coursierService.updateActivityCoursier(id, req).subscribe(
              (response) => {
                this.sweetAlertService.modificationSucces("coursier désactivé avec succès")
              },
              (error) => {
                this.sweetAlertService.modificationFailure("coursier non modifié!")
              }
            )
          }
          else {
            if (searchCoursierTerm) {
              this.coursierData = [];
              this.getPaginationCoursier();
              this.funcPaginate('', params)
            } else {
              this.coursierData = [];
              this.getPaginationCoursier();
              this.funcPaginate('', params)
            }
          }

        });
    }

  }
}
