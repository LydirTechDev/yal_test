import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SweetAlertService } from 'src/app/core/services/sweet-alert.service';
import { Echecs } from 'src/app/coursier/enums/echecs';
import { TentativesEchouer } from 'src/app/coursier/enums/tentatives-echouer';
import Swal from 'sweetalert2';
import { LivraisonService } from '../livraison.service';

@Component({
  selector: 'app-liste-shipment-livraison',
  templateUrl: './liste-shipment-livraison.component.html',
  styleUrls: ['./liste-shipment-livraison.component.scss']
})
export class ListeShipmentLivraisonComponent implements OnInit {
  searchText: string;
  selectedShipment: any;
  shipments: any;
  tantaivesEchec = Echecs;
  tantaiveEchouer = TentativesEchouer;
  listTantaivesEchec;
  listTantaiveEchouer;
  shippmentFormToDomicile: FormGroup

  constructor(
    private readonly livraisonService: LivraisonService,
    private modalService: NgbModal,
    public sweetalertService: SweetAlertService,
    public formBuilder: FormBuilder,
  ) {
    this.listTantaivesEchec = [];
    for (const key in this.tantaivesEchec) {
      this.listTantaivesEchec.push(this.tantaivesEchec[key]);
    }

    this.listTantaiveEchouer = [];
    for (const key in this.tantaiveEchouer) {
      this.listTantaiveEchouer.push(this.tantaiveEchouer[key]);
    }
  }

  ngOnInit(): void {

    this.getShipmentToBeDelivered();
    this.shippmentFormToDomicile = this.formBuilder.group({
      adresse: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(50)])],
    })
  }

  getShipmentToBeDelivered() {
    this.livraisonService.getShipmentToBeDelivered().subscribe(
      (response) => {
        console.log(
          '🚀 ~ file: list-shipments.component.ts ~ line 17 ~ ListShipmentsComponent ~ getShipmentToBeDelivered ~ response',
          response
        );
        this.shipments = response;
      },
      (error) => {
        console.log(
          '🚀 ~ file: list-shipments.component.ts ~ line 21 ~ ListShipmentsComponent ~ getShipmentToBeDelivered ~ error',
          error
        );
      }
    );
  }

  searchShipment() {
    this.searchText;
    console.log(
      '🚀 ~ file: list-shipments.component.ts ~ line 37 ~ ListShipmentsComponent ~ searchShipment ~ this.searchText',
      this.searchText
    );
  }
  closeModalsetStopToDomicile() {
    this.modalService.dismissAll()
    this.shippmentFormToDomicile.reset()
  }
  setStopToDomicile(stopToDomicile,tracking){
    console.log("🚀 ~ file: liste-shipment-livraison.component.ts ~ line 80 ~ ListeShipmentLivraisonComponent ~ setStopToDomicile ~ tracking", tracking)
    this.selectedShipment = tracking;
    this.modalService.open(stopToDomicile, { centered: true ,size: 'md'});
  }
  validateStopDeskToDomicile() {
    if (this.shippmentFormToDomicile.controls['adresse'].valid ) {
      this.modalService.dismissAll();
      return this.livraisonService
        .validateStopDeskToDomicile(this.selectedShipment, this.shippmentFormToDomicile.value['adresse'])
        .subscribe((resp) => {
          if (resp) {
            this.shippmentFormToDomicile.reset()
            this.getShipmentToBeDelivered();
            this.selectedShipment = ''
            this.sweetalertService.creationSucces('Colis modifié avec succes')
          }
        });
    } 
  }

  setStatusShipmentLivre(tracking: string) {
    const title = `Livrer le colis ${tracking}`;
    const alertMessage = 'Voulez vous confirmer la livraison de ce colis!'
    const successTitle = 'Livré avec succés'
    const errorTitle = "Livraison echouée"
    const action = this.livraisonService
      .setStatusShipmentLivre(tracking)
    this.sweetalertService.confirmStandard(title, alertMessage, successTitle, '', null).then(
      (result) => {
        if (result.value) {
          action.toPromise().then(
            () => {
              Swal.fire(successTitle, '', 'success')
              this.selectedShipment = ''
              this.getShipmentToBeDelivered();
            },
            (error) => Swal.fire(errorTitle, 'Erreur confirmation', 'error')
          )
          return result.value
        }
      });
  }

  setShipmentLivraisonNonAccomplie(content: any, tracking: string) {
    this.selectedShipment = tracking;
    this.modalService.open(content, { centered: true });
  }

  setEnTantativeEc(msg: string) {
    this.modalService.dismissAll();
    return this.livraisonService
      .setStatusShipmentEnAlert(this.selectedShipment, msg)
      .subscribe(
        (data) => {
          if (data) {
            this.selectedShipment = ''
            this.getShipmentToBeDelivered();
          }
          console.log(
            '🚀 ~ file: liste-package-slip.component.ts ~ line 121 ~ ListePackageSlipComponent ~ setEnTantativeEc ~ data',
            data
          );
        },
        (erro) => {
          console.log(
            '🚀 ~ file: liste-package-slip.component.ts ~ line 124 ~ ListePackageSlipComponent ~ setEerriveEc ~ erro',
            erro
          );
        }
      );
  }
  SetEchecLivraison(msg: string) {
    this.modalService.dismissAll();
    return this.livraisonService
      .setStatusShipmentEchec(this.selectedShipment, msg)
      .subscribe((resp) => {
        if (resp) {
          this.selectedShipment = ''
          this.getShipmentToBeDelivered();
        }
      });
  }
}
