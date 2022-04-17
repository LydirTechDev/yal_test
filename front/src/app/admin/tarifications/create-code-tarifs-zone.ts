export class CreateCodeTarifZone {
  zoneId: number;
  tarifDomicile: number;
  tarifStopDesk: number;
  tarifSurpoids: [
    {
      plageId: number;
      tarif: number;
    }
  ];
}
