import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MDBModalRef, MDBModalService } from 'angular-bootstrap-md';
import { max } from 'rxjs/operators';
import { ShippmentsClientService } from '../shippments-client.service';

@Component({
  selector: 'app-add-one-shippmnet',
  templateUrl: './add-one-shippmnet.component.html',
  styleUrls: ['./add-one-shippmnet.component.scss']
})
export class AddOneShippmnetComponent implements OnInit {

  shippmentForm: FormGroup;
  rangesubmit: boolean;
  wilayasData: any;
  communesData: any;
  serviceData: any;


  constructor(
    public formBuilder: FormBuilder,
    public modalRef: MDBModalRef,
    private modalService: MDBModalService,
    private shippmentsClientService: ShippmentsClientService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    /**
     * init service for curent user
     */
    this.shippmentsClientService.findServicesOfUser().then(
      (data) => {
        this.serviceData = data;
      }
    )

    /**
     * init wilayas data
     */
    this.shippmentsClientService.findAllWilaya().then(
      (data) => {
        this.wilayasData = data;
      }
    )
    /**
     * init shippmentForm
     */
    this.shippmentForm = this.formBuilder.group({
      raisonSociale: ['', Validators.compose([Validators.minLength(3), Validators.maxLength(50)])],
      nom: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(35), ])],
      prenom: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(35),])],
      telephone: ['', Validators.compose([Validators.required, Validators.maxLength(10)])],
      wilayaId: [, Validators.compose([Validators.required])],
      communeId: [, Validators.compose([Validators.required])],
      adresse: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      serviceId: [, Validators.compose([Validators.required])],
      numCommande: ['', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(15),])],
      /**
       * , Validators.pattern('[a-zA-Z0-9]+')
       */
      designationProduit: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(50)])],
      prixVente: [0, Validators.compose([Validators.required])],
      poids: [0, Validators.compose([Validators.required, Validators.min(0), Validators.max(150)])],
      longueur: [0, Validators.compose([Validators.required, Validators.min(0), Validators.max(2)])],
      largeur: [0, Validators.compose([Validators.required, Validators.min(0), Validators.max(2)])],
      hauteur: [0, Validators.compose([Validators.required, Validators.min(0), Validators.max(2)])],
      livraisonGratuite: [false, Validators.required],
      ouvrireColis: [false, Validators.required],
      echange: [false, Validators.required],
      objetRecuperer: [''],
      livraisonStopDesck: [true, Validators.required],
      livraisonDomicile: [false, Validators.required],
    })
    this.rangesubmit = false;
  }

  /**
 * Returns form
 */
  get form() {
    return this.shippmentForm.controls;
  }

  /**
   * Returns the type validation form
   */
  get type() {
    return this.shippmentForm.controls;
  }

  /**
 * Returns the range validation form
 */
  get range() {
    return this.shippmentForm.controls;
  }

  close() {
    this.modalService.hide(1)
  }

  onChangeShippmentTypeDesk(value: boolean) {
    this.shippmentForm.controls['communeId'].reset()
    this.shippmentForm.controls['wilayaId'].reset()
    if (value === true) {
      this.shippmentForm.controls['livraisonDomicile'].setValue(false)
    } else {
      this.shippmentForm.controls['livraisonDomicile'].setValue(true)
    }
  }

  onChangeShippmentTypeHome(value: boolean) {
    this.shippmentForm.controls['communeId'].reset()
    this.shippmentForm.controls['wilayaId'].reset()
    if (value === true) {
      this.shippmentForm.controls['livraisonStopDesck'].setValue(false)

    } else {
      this.shippmentForm.controls['livraisonStopDesck'].setValue(true)
    }
  }

  onChangeShippmentEchange(value: boolean) {
    if (value === true) {
      this.shippmentForm.get('objetRecuperer').setValidators([Validators.required, Validators.minLength(1), Validators.maxLength(50)])
      this.shippmentForm.get('objetRecuperer').updateValueAndValidity();

    } else {
      this.shippmentForm.get('objetRecuperer').clearValidators();
      this.shippmentForm.get('objetRecuperer').updateValueAndValidity() 
    }
  }

  stepOneValide(): boolean {
    if (
      (this.shippmentForm.controls['nom'].valid && this.shippmentForm.controls['prenom'] && this.shippmentForm.controls['telephone'].valid && this.shippmentForm.controls['raisonSociale'].valid) &&
      (this.shippmentForm.controls['livraisonStopDesck'].valid || this.shippmentForm.controls['livraisonDomicile'].valid)
    ) {
      return true;
    }
    return false;
  }

  stepTwoValide(): boolean {
    if (this.shippmentForm.controls['livraisonStopDesck'].value === true) {
      this.shippmentForm.get('adresse').clearValidators();
      this.shippmentForm.get('adresse').updateValueAndValidity()
    } else {
      this.shippmentForm.get('adresse').setValidators([Validators.required, Validators.minLength(3), Validators.maxLength(50)]);
      this.shippmentForm.get('adresse').updateValueAndValidity();
    }
    if (this.shippmentForm.controls['echange'].value === true) {
      this.shippmentForm.get('objetRecuperer').setValidators([Validators.required, Validators.minLength(1), Validators.maxLength(50)])
      this.shippmentForm.get('objetRecuperer').updateValueAndValidity();
    }else {
      this.shippmentForm.get('objetRecuperer').clearValidators();
      this.shippmentForm.get('objetRecuperer').updateValueAndValidity()
    }
    if (
      this.shippmentForm.controls['wilayaId'].valid && this.shippmentForm.controls['communeId'].valid &&
      this.shippmentForm.controls['serviceId'].valid && this.shippmentForm.controls['numCommande'].valid &&
      this.shippmentForm.controls['designationProduit'].valid && this.shippmentForm.controls['prixVente'].valid &&
      this.shippmentForm.controls['livraisonGratuite'].valid && this.shippmentForm.controls['adresse'].valid &&
      this.shippmentForm.controls['objetRecuperer'].valid

    ) {
      return true;
    }
    return false;
  }

  stepThreeValide(): boolean {
    if (
      this.shippmentForm.controls['poids'].valid && this.shippmentForm.controls['longueur'].valid &&
      this.shippmentForm.controls['largeur'].valid && this.shippmentForm.controls['hauteur'].valid
    ) {
      return true;
    }
    return false;
  }

  onChangeWilaya() {
    this.shippmentForm.controls['communeId'].reset()
    this.shippmentsClientService.findCommunByWilayaTypeLivraison(this.shippmentForm.controls['wilayaId'].value, this.shippmentForm.controls['livraisonStopDesck'].value).then(
      (data) => {
        this.communesData = data;
      }
    )
  }

  createShipment(value?: string) {
    if (this.shippmentForm.valid) {
      console.log(this.shippmentForm.value)
      this.shippmentsClientService.creatShippment(this.shippmentForm.value).subscribe(
        (data) => {
          this.shippmentsClientService.observAddShipments.next(+1)
          this.shippmentForm.reset();
          this.modalRef.hide()
          this.router.navigate(['client/colis']);

        },
        (error) => {
          console.log("🚀 ~ file: add-one-shippmnet.component.ts ~ line 179 ~ AddOneShippmnetComponent ~ createShipment ~ error", error)
        }
      );
    }
  }
}
