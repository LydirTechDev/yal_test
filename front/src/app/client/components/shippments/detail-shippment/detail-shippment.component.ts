import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { ShippmentsClientService } from '../shippments-client.service';

@Component({
  selector: 'app-detail-shippment',
  templateUrl: './detail-shippment.component.html',
  styleUrls: ['./detail-shippment.component.scss']
})
export class DetailShippmentComponent implements OnInit, OnDestroy {

  route: ActivatedRouteSnapshot
  shipment: any
  shippmentForm: FormGroup;
  wilayasData: any;
  communesData: any;
  serviceData: any;
  shipmenId: number;
  numCommande: number;
  formEdited = false;
  constructor(
    private shippmentsClientService: ShippmentsClientService,
    _activatedRoute: ActivatedRoute,
    private router: Router,
    public formBuilder: FormBuilder,
  ) {
    this.route = _activatedRoute.snapshot;
    console.log("🚀 ~ file: detail-shippment.component.ts ~ line 28 ~ DetailShippmentComponent ~ this.route", this.route)
    this.shipmenId = parseInt(this.route.params.id)
    this.shippmentForm = this.formBuilder.group({
      raisonSociale: ['', Validators.compose([Validators.minLength(3), Validators.maxLength(30), Validators.pattern('[a-zA-Z0-9]+')])],
      nom: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(50), Validators.pattern('[a-zA-Z]+')])],
      prenom: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(50), Validators.pattern('[a-zA-Z]+')])],
      telephone: ['', Validators.compose([Validators.required, Validators.maxLength(10)])],
      wilayaId: [, Validators.compose([Validators.required])],
      communeId: [, Validators.compose([Validators.required])],
      adresse: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      serviceId: [, Validators.compose([Validators.required])],
      numCommande: ['', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(15), Validators.pattern('[a-zA-Z0-9]+')])],
      /**
       * , Validators.pattern('[a-zA-Z0-9]+')
       */
      designationProduit: ['', Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(50)])],
      prixVente: [0, Validators.compose([Validators.required, Validators.pattern('[0-9]+')])],
      prixEstimer: [1000, Validators.compose([Validators.required])],
      poids: [0, Validators.compose([Validators.required, Validators.pattern('[0-9]+')])],
      longueur: [0, Validators.compose([Validators.required, Validators.pattern('[0-9]+')])],
      largeur: [0, Validators.compose([Validators.required, Validators.pattern('[0-9]+')])],
      hauteur: [0, Validators.compose([Validators.required, Validators.pattern('[0-9]+')])],
      livraisonGratuite: [false, Validators.required],
      ouvrireColis: [false, Validators.required],
      livraisonStopDesck: [true, Validators.required],
      livraisonDomicile: [false, Validators.required],
    })

  }
  ngOnDestroy(): void {
    this.shippmentForm.reset();
  }

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

   
        
    

    this.shippmentsClientService.getShipment(this.shipmenId).then(
      (responce) => {
        this.shippmentForm.get('raisonSociale').setValue(responce.raisonSociale),
          this.shippmentForm.get('nom').setValue(responce.nom),
          this.shippmentForm.get('prenom').setValue(responce.prenom),
          this.shippmentForm.get('telephone').setValue(responce.telephone),
          this.shippmentForm.get('wilayaId').setValue(responce.commune.wilaya.id),
          this.shippmentForm.get('communeId').setValue(responce.commune.id),
          this.shippmentForm.get('adresse').setValue(responce.adresse),
          this.shippmentForm.get('serviceId').setValue(responce.service.id),
          this.shippmentForm.get('numCommande').setValue(responce.numCommande)

        this.shippmentForm.get('designationProduit').setValue(responce.designationProduit),
          this.shippmentForm.get('prixVente').setValue(responce.prixVente),
          this.shippmentForm.get('prixEstimer').setValue(responce.prixEstimer),
          this.shippmentForm.get('poids').setValue(responce.poids),
          this.shippmentForm.get('longueur').setValue(responce.longueur),
          this.shippmentForm.get('largeur').setValue(responce.largeur),
          this.shippmentForm.get('hauteur').setValue(responce.hauteur),
          this.shippmentForm.get('livraisonGratuite').setValue(responce.livraisonGratuite),
          this.shippmentForm.get('ouvrireColis').setValue(responce.ouvrireColis),
          this.shippmentForm.get('livraisonStopDesck').setValue(responce.livraisonStopDesck),
          this.shippmentForm.get('livraisonDomicile').setValue(responce.livraisonDomicile),
          /**
           * init num commande
           */
          this.numCommande = this.shippmentForm.get('numCommande').value;
          
      this.shippmentsClientService
        .getCommunsByWilayaId(this.shippmentForm.get('wilayaId').value)
        .subscribe((resp) => (this.communesData = resp));},
          
      (error) => {
        console.log("🚀 ~ file: detail-shippment.component.ts ~ line 108 ~ DetailShippmentComponent ~ ngOnInit ~ error", error)
      }
    );

    /**
* survey change form
*/
    this.shippmentForm.valueChanges.subscribe(
      (d) => {
        if (this.shippmentForm.dirty) {
          this.formEdited = true
        }
      }
    )
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

  onChangeWilaya() {
    this.shippmentForm.controls['communeId'].reset()
    this.shippmentsClientService.findCommunByWilayaTypeLivraison(this.shippmentForm.controls['wilayaId'].value, this.shippmentForm.controls['livraisonStopDesck'].value).then(
      (data) => {
        this.communesData = data;
      }
    )
  }

  updateShipment(shipmenId: number) {
    console.log("🚀 ~ file: detail-shippment.component.ts ~ line 155 ~ DetailShippmentComponent ~ updateShipment ~ shipmenId", typeof(shipmenId))
    console.log("🚀 ~ file: detail-shippment.component.ts ~ line 156 ~ DetailShippmentComponent ~ updateShipment ~ this.shippmentForm", this.shippmentForm.value)

    if (this.shippmentForm.controls['livraisonStopDesck'].value === true) {
      this.shippmentForm.get('adresse').clearValidators();
      this.shippmentForm.get('adresse').updateValueAndValidity()
    } else {
      this.shippmentForm.get('adresse').setValidators([Validators.required, Validators.minLength(3), Validators.maxLength(50)]);
      this.shippmentForm.get('adresse').updateValueAndValidity();
    }

    if (this.shippmentForm.valid) {
      console.log("🚀 ~ file: detail-shippment.component.ts ~ line 159 ~ DetailShippmentComponent ~ updateShipment ~ this.shippmentForm", this.shippmentForm.value)

      this.shippmentsClientService.updateShipment(shipmenId, this.shippmentForm.value).subscribe(
        (response) => {
        console.log("🚀 ~ file: detail-shippment.component.ts ~ line 172 ~ DetailShippmentComponent ~ updateShipment ~ response", response)
          this.router.navigateByUrl('client/colis')
        },
        (error) => {
          console.log("🚀 ~ file: detail-shippment.component.ts ~ line 175 ~ DetailShippmentComponent ~ updateShipment ~ error", error)

        }
      )

    }
  }
  setValuePrixEstimer() {
    if (this.shippmentForm.get('prixVente').value >= 1000) {

      this.shippmentForm.patchValue({
        prixEstimer: this.shippmentForm.get('prixVente').value
      })

    } else {
      this.shippmentForm.patchValue({
        prixEstimer: 1000
      })
    }
  }
}
