import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  Router,
} from '@angular/router';
import { WilayaService } from '../../wilaya/wilaya.service';
import { ZoneService } from '../../zone/zone.service';
import { RotationService } from '../rotation.service';
import { Location } from '@angular/common';
import { SweetAlertService } from 'src/app/core/services/sweet-alert.service';

@Component({
  selector: 'app-detail-rotation',
  templateUrl: './detail-rotation.component.html',
  styleUrls: ['./detail-rotation.component.scss'],
})
export class DetailRotationComponent implements OnInit {
  breadCrumbItems: Array<{}>;
  route: ActivatedRouteSnapshot;
  listWilaya = [];
  listZone = [];
  rotations: any;
  hidden: boolean = true;

  constructor(
    private rotationService: RotationService,
    private wilayaService: WilayaService,
    private zoneService: ZoneService,
    _route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private location: Location,
    private sweetalertService: SweetAlertService,
    private router: Router
  ) {
    this.route = _route.snapshot;
  }

  rotationForm = this.formBuilder.group({
    numero: [],
    wilayaDepartId: ['', Validators.compose([Validators.required])],
    wilayaDestinationId: ['', Validators.compose([Validators.required])],
    zoneId: ['', Validators.compose([Validators.required])],
  });

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Gestion des zones' },
      { label: 'Zones' },
      { label: 'Detail zone', active: true },
    ];
    this.getAllWilaya();
    this.getAllZone();

    this.rotationService
      .getRotationById(this.route.params.id)
      .subscribe((rotations) => {
        this.rotations = rotations;
        this.rotationForm.patchValue({
          numero: this.rotations.id,
          wilayaDepartId: rotations.wilayaDepart.id,
          wilayaDestinationId: rotations.wilayaDestination.id,
          zoneId: rotations.zone.id,
        });
        this.rotationForm.disable();
      });
  }

  getAllWilaya() {
    this.wilayaService
      .getAllWilaya()
      .subscribe((resp) => (this.listWilaya = resp));
  }

  getAllZone() {
    this.zoneService.getAllZones().subscribe((resp) => (this.listZone = resp));
  }

  goBack(): void {
    this.location.back();
  }

  enableRotationForm() {
    this.rotationForm.enable();
    this.hidden = false;
  }

  updateRotation() {

    return this.rotationService
      .updateRotation(this.route.params.id, this.rotationForm.value)
      .subscribe(
        (response) => {
          this.sweetalertService.modificationSucces(
            'Rotation modifiée avec succés'
          );
          this.router.navigateByUrl(`admin/rotations`);
        },
        (error) => {
          this.sweetalertService.modificationFailure(error.message)
        }
      );
  }

  Confirm() {
    const alertTitle = 'Confirmation des modifications';
    const alertMessage = 'voulez vous confirmez vos modification !';
    this.sweetalertService
      .confirmStandard(alertTitle, alertMessage,'','',null)
      .then((result) => {
        if (result.isConfirmed) {
          this.updateRotation();
        }
      });
  }

}
