import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ServiceClientService } from '../service-client.service';

@Component({
  selector: 'app-create-soumission-shipment',
  templateUrl: './create-soumission-shipment.component.html',
  styleUrls: ['./create-soumission-shipment.component.scss'],
})
export class CreateSoumissionShipmentComponent implements OnInit {
  classiqueShippmentForm: FormGroup;
  wilayasData: any;
  communesData: any;
  estimateTarif: number;
  typeShipment: string;
  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly shippmentsServiceClient: ServiceClientService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.typeShipment = '';
    /**
     * init wilayas data
     */
    this.shippmentsServiceClient.findAllWilaya().then((data) => {
      this.wilayasData = data;
    });
    /**
     * init classiqueShippmentForm
     */
    this.classiqueShippmentForm = this.formBuilder.group({
      
      raisonSociale: [
        '',
        Validators.compose([Validators.minLength(3), Validators.maxLength(50)]),
      ],
      telephone: [
        '',
        Validators.compose([Validators.required, Validators.maxLength(10)]),
      ],
      nom: [
        '*-*',
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(35),
        ]),
      ],
      prenom: [
        '*-*',
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(35),
        ]),
      ],
      numIdentite: [
        '',
        Validators.compose([Validators.required, Validators.maxLength(9)]),
      ],
      raisonSocialeExp: [
        '',
        Validators.compose([Validators.minLength(3), Validators.maxLength(50)]),
      ],
      nomExp: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(35),
        ]),
      ],
      prenomExp: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(35),
        ]),
      ],
      telephoneExp: [
        '',
        Validators.compose([Validators.required, Validators.maxLength(10)]),
      ],
      adresseExp: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
        ],
      ],
      wilayaId: [, Validators.compose([Validators.required])],
      communeId: [, Validators.compose([Validators.required])],
      adresse: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
        ],
      ],
      designationProduit: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(50),
        ]),
      ],
      poids: [0
        ,
        Validators.compose([
          Validators.required,
          Validators.min(0),
          Validators.max(150),
        ]),
      ],
      longueur: [0
        ,
        Validators.compose([
          Validators.required,
          Validators.min(0),
          Validators.max(2),
        ]),
      ],
      largeur: [0
        ,
        Validators.compose([
          Validators.required,
          Validators.min(0),
          Validators.max(2),
        ]),
      ],
      hauteur: [0
        ,
        Validators.compose([
          Validators.required,
          Validators.min(0),
          Validators.max(2),
        ]),
      ],
      livraisonStopDesck: [false, Validators.required],
      livraisonDomicile: [true, Validators.required],
      service: ['soumission', Validators.required]
    });
  }

  selectTypeShipments(typeShipment: string) {
    this.typeShipment = typeShipment;
    if (typeShipment === 'document') {
      this.classiqueShippmentForm.controls['poids'].setValue(0);
      this.classiqueShippmentForm.controls['longueur'].setValue(0);
      this.classiqueShippmentForm.controls['largeur'].setValue(0);
      this.classiqueShippmentForm.controls['hauteur'].setValue(0);
      this.classiqueShippmentForm.controls['prixEstimer'].setValue(0);
    }
  }
  onChangeShippmentTypeDesk(value: boolean) {
    this.classiqueShippmentForm.controls['communeId'].reset();
    this.classiqueShippmentForm.controls['wilayaId'].reset();
    if (value === true) {
      this.classiqueShippmentForm.controls['livraisonDomicile'].setValue(false);
    } else {
      this.classiqueShippmentForm.controls['livraisonDomicile'].setValue(true);
    }
    this.getEstimateTarif();
  }

  onChangeShippmentTypeHome(value: boolean) {
    this.classiqueShippmentForm.controls['communeId'].reset();
    this.classiqueShippmentForm.controls['wilayaId'].reset();
    if (value === true) {
      this.classiqueShippmentForm.controls['livraisonStopDesck'].setValue(
        false
      );
    } else {
      this.classiqueShippmentForm.controls['livraisonStopDesck'].setValue(true);
    }
    this.getEstimateTarif();
  }

  onChangeWilaya() {
    this.classiqueShippmentForm.controls['communeId'].reset();
    this.shippmentsServiceClient
      .findCommunByWilayaTypeLivraison(
        this.classiqueShippmentForm.controls['wilayaId'].value
      )
      .then((data) => {
        this.communesData = data;
        this.getEstimateTarif();
      });
  }

  getEstimateTarif() {
    if (
      this.classiqueShippmentForm.controls['wilayaId'].valid &&
      this.classiqueShippmentForm.controls['communeId'].valid &&
      this.classiqueShippmentForm.controls['poids'].valid &&
      this.classiqueShippmentForm.controls['longueur'].valid &&
      this.classiqueShippmentForm.controls['largeur'].valid &&
      this.classiqueShippmentForm.controls['hauteur'].valid
    ) {
      this.shippmentsServiceClient
        .getEstimateTarif(this.classiqueShippmentForm.value)
        .subscribe((resp) => {
          console.log(
            '🚀 ~ file: create-classique-shipment.component.ts ~ line 201 ~ CreateClassiqueShipmentComponent ~ ).subscribe ~ resp',
            resp
          );
          this.estimateTarif = resp;
        });
      console.log(
        '🚀 ~ file: create-classique-shipment.component.ts ~ line 202 ~ CreateClassiqueShipmentComponent ~ this.classiqueShippmentForm.value',
        this.classiqueShippmentForm.value
      );
    }
  }

  createShipment() {
    console.log(
      '🚀 ~ file: create-classique-shipment.component.ts ~ line 190 ~ CreateClassiqueShipmentComponent ~ createShipment ~ this.classiqueShippmentForm.value',
      this.classiqueShippmentForm.value
    );
    console.log(
      '🚀 ~ file: create-classique-shipment.component.ts ~ line 190 ~ CreateClassiqueShipmentComponent ~ createShipment ~ this.classiqueShippmentForm.value',
      this.classiqueShippmentForm.valid
    );
    if (this.classiqueShippmentForm.valid) {
      console.log(
        '🚀 ~ file: create-classique-shipment.component.ts ~ line 236 ~ CreateClassiqueShipmentComponent ~ createShipment ~ this.classiqueShippmentForm.valid',
        this.classiqueShippmentForm.valid
      );
      console.log(
        '🚀 ~ file: create-classique-shipment.component.ts ~ line 236 ~ CreateClassiqueShipmentComponent ~ createShipment ~ this.classiqueShippmentForm.valid',
        this.classiqueShippmentForm.valid
      );
      console.log(
        '🚀 ~ file: create-classique-shipment.component.ts ~ line 236 ~ CreateClassiqueShipmentComponent ~ createShipment ~ this.classiqueShippmentForm.valid',
        this.classiqueShippmentForm.valid
      );
      console.log(
        '🚀 ~ file: create-classique-shipment.component.ts ~ line 236 ~ CreateClassiqueShipmentComponent ~ createShipment ~ this.classiqueShippmentForm.valid',
        this.classiqueShippmentForm.valid
      );
      this.shippmentsServiceClient
        .createShipmentSoumission(this.classiqueShippmentForm.value)
        .subscribe(
          (data) => {
            this.classiqueShippmentForm.reset();
            this.openFile(data, 'application/pdf');
            this.estimateTarif = null;
            this.router.navigate(['service-client/soumission']);
          },
          (error) => {
            console.log(
              '🚀 ~ file: create-classique-shipment.component.ts ~ line 242 ~ CreateClassiqueShipmentComponent ~ createShipment ~ error',
              error
            );
          }
        );
    }
  }

  openFile(data: any, type: string) {
    let blob = new Blob([data], { type: type });
    let url = window.URL.createObjectURL(blob);
    let pwa = window.open(url);
    if (!pwa || pwa.closed || typeof pwa.closed == 'undefined') {
      alert('Please disable your pop-up blocker and try again!');
    }
  }
  cancel() {
    this.classiqueShippmentForm.reset();
    this.typeShipment = '';
  }
}
