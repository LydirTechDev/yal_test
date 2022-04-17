import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IPaginationLinks, IPaginationMeta } from 'src/app/core/interfaces/paginations';
import { Pagination } from 'src/app/core/interfaces/paginations/pagination';
import { SweetAlertService } from 'src/app/core/services/sweet-alert.service';
import { ClientService } from './client.service';
import { IClient } from './i-client';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss']
})
export class ClientsComponent implements OnInit {

  constructor(
    private router: Router,
    private clientService:ClientService,
    private sweetAlertService:SweetAlertService) {
        /**
     * init isLoading to false
     */
         this.isLoading = false;

         /**
          * init mataData to 0
          * init metaLinks to 0
          */
         this._clientsErrorAndInitialis();
     }

  breadCrumbItems: Array<{}>;
  data = [];
  isLoading: boolean;
  metaData: IPaginationMeta;
  metaLinks: IPaginationLinks;
  searchClientTerm: string;
  clientData: IClient[];
  btnSpinner: boolean = false;
  ngOnInit(): void {

    this.breadCrumbItems = [
          { label: 'Gestion des utilisateurs' },
          { label: 'Liste Clients', active: true },
        ];
        this.getPaginationClient()
  }

  ajouterClient(){
    this.router.navigateByUrl(`admin/client/ajouter_client`)
  }

  detailClient(id:number) {
    this.router.navigateByUrl(`admin/client/detail_client/${id}`);
  }

  getPaginationClient() {
    this.isLoading=true;
      this.clientService.getPaginateClient().subscribe(
        (response)=>{
          this._clientsResponse(response);
        },
        (error)=>{
          this._clientsErrorAndInitialis(error);
          this.sweetAlertService.sipmleAlertConfirme(
            'warning',
            'cannot load clients',
            error.messase,
            true
          );
        }
      );
  }

  searchTermUpdate(searchclientTerm: string): void {
    this.isLoading = true;
    setTimeout(() => {
      this.clientService.searchClient(searchclientTerm).subscribe(
        (response) => {
          this._clientsResponse(response);
        },
        (error) => {
          this._clientsErrorAndInitialis(error);
        }
      );
    },330)
  }

  funcPaginate(link: string, page?: number): void {
    this.isLoading = true;
    setTimeout(() => {
      this.clientService.funcPaginate(link, page,this.searchClientTerm).subscribe(
        (response) => {
          this._clientsResponse(response);
        },
        (error) => {
          this._clientsErrorAndInitialis(error);
        }
      );
    }, 330);
  }

  private _clientsResponse(response: Pagination<IClient>) {
    this.clientData = response.items;
    this.metaData = response.meta;
    this.metaLinks = response.links;
    this.isLoading = false;
  }

  private _clientsErrorAndInitialis(error?: any) {
    this.clientData = [];
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


  ActiveDesactive(id:number, valueSwitch:any,params?: number,searchCoursierTerm?:any) {
     let req:any;
    if(valueSwitch==true){
      req={"isActive":"true"}
      const alertTitle = 'Confirmation des modifications';
      const alertMessage = 'voulez vous activer cet utilisateur!';
      this.sweetAlertService
        .confirmStandard(alertTitle, alertMessage, '', '', null)
        .then((result) => {
          if (result.isConfirmed) {

            this.clientService.updateActivityClient(id,req).subscribe(
              (response)=>{
                this.sweetAlertService.modificationSucces("client activé avec succès")
              },
            (error)=>{
              this.sweetAlertService.modificationFailure("client non modifié!")
            }
            )
          }else{
            if(searchCoursierTerm){
              this.clientData = [];
              this.getPaginationClient();
              this.funcPaginate('', params)
            } else{
              this.clientData = [];
              this.getPaginationClient();
              this.funcPaginate('', params)
            }
          }

        });
  }else{
    req={"isActive":"false"}
    const alertTitle = 'Confirmation des modifications';
    const alertMessage = 'voulez vous désactiver ce client!';
    this.sweetAlertService
      .confirmStandard(alertTitle, alertMessage, '', '', null)
      .then((result) => {
        if (result.isConfirmed) {
          this.clientService.updateActivityClient(id,req).subscribe(
            (response)=>{
              this.sweetAlertService.modificationSucces("Client désactivé avec succès")
            },
          (error)=>{
            this.sweetAlertService.modificationFailure("Client non modifié!")
          }
          )
        } else{
          if(searchCoursierTerm){
            this.clientData = [];
            this.getPaginationClient();
            this.funcPaginate('', params)
          } else{
            this.clientData = [];
            this.getPaginationClient();
            this.funcPaginate('', params)
          }
        }

      });
  }

  }

  printContrat(id: number) {
    return this.clientService.printContrat(id).subscribe({
      next: (response) => {
        this.openFile(response, 'application/pdf');
      },
      error: (error) => { this.sweetAlertService.basicWarning(error.message) }
    });
  }
  printCarte(id: number) {
    return this.clientService.printCarte(id).subscribe({
      next: (response) => {
        this.openFile(response, 'application/pdf');
      },
      error: (error) => { this.sweetAlertService.basicWarning(error.message) }
    });
  }
  openFile(data: any, type: string) {
    let blob = new Blob([data], { type: type });
    let url = window.URL.createObjectURL(blob);
    let pwa = window.open(url);
    if (!pwa || pwa.closed || typeof pwa.closed == 'undefined') {
      alert('Please disable your pop-up blocker and try again!')
    }
  }
  exportClient(termToSearch: string) {
    if (!termToSearch) {
      termToSearch = '';
    }
    this.clientService.ExportToExcel(termToSearch).subscribe(
      (response) => {
        FileSaver.saveAs(response, "liste des clients.xlsx");
      }
    )
  }

}
