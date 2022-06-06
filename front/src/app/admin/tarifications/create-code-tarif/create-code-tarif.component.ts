import { Component, Input, OnInit } from '@angular/core';
import {
  Form,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Options } from 'ng5-slider';
import { findIndex } from 'rxjs/operators';
import { SweetAlertService } from 'src/app/core/services/sweet-alert.service';
import { IZone } from '../../zone/i-zone';
import { ICreateService } from '../i-create-service';
import { IPoid } from '../i-poid';
import { ICodeTarifsZone } from '../icode-tarifs-zone';
import { ServiceService } from '../service.service';
import { TarificationService } from '../tarification.service';

@Component({
  selector: 'app-create-code-tarif',
  templateUrl: './create-code-tarif.component.html',
  styleUrls: ['./create-code-tarif.component.scss'],
})
export class CreateCodeTarifComponent implements OnInit {
  @Input() zones: IZone[];
  @Input() newService: ICreateService;
  poids: IPoid[];

  prevalidate = false;
  codeTarifsZones: ICodeTarifsZone[];
  allTarifZone = [];
  constructor(
    private readonly serviceService: ServiceService,
    private fb: FormBuilder,
    private readonly sweetAlertService: SweetAlertService,
    public tarificationService: TarificationService,
    private readonly router: Router
  ) {
    this.serviceService.getAllPoids().subscribe((response) => {
      console.log(
        '🚀 ~ file: create-code-tarif.component.ts ~ line 42 ~ CreateCodeTarifComponent ~ this.serviceService.getAllPoids ~ response',
        response
      );
      this.poids = response;
    });
  }

  form = this.fb.group({
    tarifStopDesk: [, Validators.required],
    tarifDomicile: [, Validators.required],
    poidTarif: this.fb.array([
      this.fb.group({
        tarif: [, Validators.compose([Validators.required])],
      }),
    ]),
  });

  ngOnInit(): void { }

  get poidTarif() {
    return this.form.get('poidTarif') as FormArray;
  }

  newPoidTarif(): FormGroup {
    return this.fb.group({
      tarif: [, Validators.required],
    });
  }

  addPoidTarif() {
    this.poidTarif.push(this.newPoidTarif());
  }

  removePoidTarif(i: number) {
    this.poidTarif.removeAt(i);
  }

  test(zone: IZone): string {
    if (this.form.valid) {
      console.log(
        '🚀 ~ file: create-code-tarif.component.ts ~ line 65 ~ CreateCodeTarifComponent ~ test ~ zoneId',
        zone.id
      );
      console.log(
        '🚀 ~ file: create-code-tarif.component.ts ~ line 44 ~ CreateCodeTarifComponent ~ test ~ this.zonesPoids.value',
        this.form.value
      );
      let i = 0;
      for (const tarif of this.form.get('poidTarif').value) {
        console.log(
          '🚀 ~ file: create-code-tarif.component.ts ~ line 90 ~ CreateCodeTarifComponent ~ test ~ tarif',
          tarif
        );
        this.newService.codeTarif[0].codeTarifZone.push({
          zone: zone,
          tarifDomicile: this.form.get('tarifDomicile').value,
          tarifStopDesk: this.form.get('tarifStopDesk').value,
          poids: this.poids[i],
          tarifPoidsParKg: tarif['tarif'],
        });
        i++;
      }

      console.log(
        '🚀 ~ file: create-code-tarif.component.ts ~ line 88 ~ CreateCodeTarifComponent ~ test ~  this.newService',
        this.newService
      );
      this.form.reset();

      if (
        this.newService.codeTarif[0].codeTarifZone.length ==
        this.poids.length * this.zones.length
      ) {
        this.form.disable();
        this.prevalidate = true;
      }

      return 'awNextStep';
    } else {
      this.sweetAlertService.sipmleAlert(
        'error',
        zone.codeZone
          .slice(0, 1)
          .concat(
            zone.codeZone.slice(zone.codeZone.length - 2, zone.codeZone.length)
          )
          .toLocaleUpperCase(),
        'Invalide'
      );
      return '';
    }
  }

  save() {
    this.newService;
    console.log(
      '🚀 ~ file: create-code-tarif.component.ts ~ line 129 ~ CreateCodeTarifComponent ~ save ~ this.newService',
      this.newService
    );
    this.serviceService
      .createNewTarification(this.newService)
      .subscribe((responce) => {
        this.tarificationService.redirecteAfterCreate();
        console.log(
          '🚀 ~ file: create-code-tarif.component.ts ~ line 132 ~ CreateCodeTarifComponent ~ this.serviceService.createNewTarification ~ responce',
          responce
        );
      });
  }
}
