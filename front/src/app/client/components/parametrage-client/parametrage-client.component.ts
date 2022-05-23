import { Component, OnInit } from '@angular/core';
import * as FileSaver from 'file-saver';
import { PaiementsClientService } from '../paiements-client.service';

@Component({
  selector: 'app-parametrage-client',
  templateUrl: './parametrage-client.component.html',
  styleUrls: ['./parametrage-client.component.scss']
})
export class ParametrageClientComponent implements OnInit {

  constructor(
    private paiementClientService:PaiementsClientService
  ) { }

  ngOnInit(): void {
  }


  
downloadBorderauAspirer(){
  this.paiementClientService.downloadBorderauAspirer().subscribe(
    (response) => {
      FileSaver.saveAs(response, "borderau à aspirer.xlsx");
    }
  )
}


downloadWilayas(){
  this.paiementClientService.downloadWilayas().subscribe(
    (response) => {
      FileSaver.saveAs(response, "wilayas.xlsx");
    }
  )
}

  downloadCommunes() {
    this.paiementClientService.downloadCommunes().subscribe(
      (response) => {
        FileSaver.saveAs(response, "communes.xlsx");
      }
    )
  }


}
