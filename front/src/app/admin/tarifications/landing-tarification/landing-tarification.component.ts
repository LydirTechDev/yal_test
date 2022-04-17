import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SweetAlertService } from 'src/app/core/services/sweet-alert.service';
import { CodeTarifService } from '../code-tarif.service';
import { ServiceService } from '../service.service';
import { TarificationService } from '../tarification.service';

@Component({
  selector: 'app-landing-tarification',
  templateUrl: './landing-tarification.component.html',
  styleUrls: ['./landing-tarification.component.scss'],
})
export class LandingTarificationComponent implements OnInit {
  /**
   * card title
   */
  cardTitle: string;

  /**
   * count of code tarif
   */
  nbCodeTarif: number;

  /**
   * count of services
   */
  nbServices: number;

  /**
   * loading data in componant
   */
  isloadingData: boolean;

  constructor(
    public tarificationService: TarificationService,
    private codeTarifService: CodeTarifService,
    private serviceService: ServiceService,
    private router: Router
  ) {
    if (this.tarificationService.checkIfCreatingService()) {
      this.router.navigateByUrl('admin/tarifications/create-new-service');
    }
    /**
     * init isloadingData to false
     */
    this.isloadingData = false;
  }

  ngOnInit(): void {
    this.cardTitle = 'Informations globales des tarifications';

    /**
     * load nb of code tarif
     */
    this._getNbCodeTarif();

    /**
     * load nb of services
     */
    this._getNbServices();
  }

  /**
   * private function to get count nb code trafi from api
   */
  private _getNbCodeTarif() {
    this.isloadingData = true;
    setTimeout(() => {
      this.codeTarifService.getNbCodeTarif().subscribe(
        (response) => {
          this.nbCodeTarif = response;
          this.isloadingData = false;
        },
        (error) => {
          console.log(
            '🚀 ~ file: landing-tarification.component.ts ~ line 53 ~ LandingTarificationComponent ~ setTimeout ~ error',
            error
          );
          this.isloadingData = false;
        }
      );
    }, 330);
  }

  /**
   * private function to get nb service from api
   */
  private _getNbServices() {
    this.serviceService.getNbServices().subscribe(
      (response) => {
        this.nbServices = response;
      },
      (error) => {
        console.log(
          '🚀 ~ file: landing-tarification.component.ts ~ line 74 ~ LandingTarificationComponent ~ _getNbServices ~ error',
          error
        );
      }
    );
  }
}
