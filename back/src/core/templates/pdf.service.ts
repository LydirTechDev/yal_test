import { forwardRef, Inject, Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as QRCode from 'qrcode';
import * as bwipjs from 'bwip-js';
import {
  degrees,
  grayscale,
  PDFDocument,
  PDFFont,
  rgb,
  StandardFonts,
} from 'pdf-lib';
import { NotFoundError } from 'rxjs';
import { SacTypeEnum } from 'src/enums/sacTypeEnum';
import { Client } from 'src/resources/clients/entities/client.entity';
import { Pmt } from 'src/resources/pmt/entities/pmt.entity';
import { EntityNotFoundError } from 'typeorm';
import { PmtCoursier } from 'src/resources/pmt-coursier/entities/pmt-coursier.entity';
import { delaiPaiementEnum } from 'src/enums/delaiPaiementEnum';
import { Shipment } from 'src/resources/shipments/entities/shipment.entity';
import { ExpiditeurPublic } from 'src/resources/expiditeur-public/entities/expiditeur-public.entity';
import { StatusShipmentEnum } from 'src/enums/status.shipment.enum';
import { ClientsService } from 'src/resources/clients/clients.service';
import { User } from 'src/resources/users/entities/user.entity';
import { Recolte } from 'src/resources/recoltes/entities/recolte.entity';
import { ShipmentsService } from 'src/resources/shipments/shipments.service';
import { CodeTarifsZonesService } from 'src/resources/code-tarifs-zones/code-tarifs-zones.service';
@Injectable()
export class PdfService {

  constructor(
    @Inject(forwardRef(() => ClientsService))
    private clientService: ClientsService,
    @Inject(forwardRef(() => ShipmentsService))
    private shipmentService: ShipmentsService,
    private codeTarifsZonesService: CodeTarifsZonesService,
  ) {}

  async  generateShipmentAgenceAccuser(shipmentInfo: Shipment, tarifLivraison: number){
    let brd = null;
    console.log("🚀 ~ file: pdf.service.ts ~ line 36 ~ PdfService ~ generateShipmentAgenceAccuser ~ brd", brd)
    const brdr1 = await this.generateShipmentAgence(shipmentInfo, tarifLivraison)
    const pdfBytes = await brdr1.save();
    if (shipmentInfo.accShipment == null ) {
      fs.writeFileSync('dest', pdfBytes);
      return pdfBytes;
    }else {
      const brdr2 = await this.generateShipmentAgence(shipmentInfo.accShipment[0], 0)
      brd = brdr2
      const allbrd = await brd.copyPages(brdr1, [0])
      brd.addPage(allbrd[0])
      const pdfBytes = await brd.save();
      fs.writeFileSync('dest', pdfBytes);
      return pdfBytes;
    }
  }

  async generateShipmentAgence(shipmentInfo: Shipment, tarifLivraison: number) {
    console.log(
      '🚀 ~ file: pdf.service.ts ~ line 25 ~ PdfService ~ generateShipmentAgence ~ tarifLivraison',
      tarifLivraison,
    );
    let packageSlipTemplatePath = '';
    packageSlipTemplatePath = 'src/assets/newBordereau.pdf';
    const pdfTemplateBytes = fs.readFileSync(packageSlipTemplatePath);
    const dest = 'src/testpdf/bordereau.pdf';
    const pdfDoc = await PDFDocument.load(pdfTemplateBytes);

    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

    const pages = pdfDoc.getPages();
    const firstPage = pages[0];

    const { width, height } = firstPage.getSize();
    
    //infoPackageSliprmation service

    const text = shipmentInfo.service.nom.toUpperCase();
    const textSize = 16;
    const textWidth = helveticaFont.widthOfTextAtSize(text, textSize);
    const textHeight = helveticaFont.heightAtSize(textSize);
    firstPage.drawText(text, {
      // x: 24.5 + textHeight / 2,
      // y: height - 133 - textWidth / 2,
      x: 155,
      y: 795,
      size: textSize,
      // color: rgb(1, 1, 1),
    });

    // --------------------- Expéditeur -----------------
    firstPage.drawText('Expéditeur', {
      x: 95,
      y: height - 62,
      size: 8,
    });

    firstPage.drawText(shipmentInfo.expiditeurPublic.raisonSocialeExp, {
      x: 95,
      y: height - 72,
      size: 8,
    });

    firstPage.drawText(shipmentInfo.expiditeurPublic.adresseExp, {
      x: 95,
      y: height - 82,
      size: 8,
    });
    firstPage.drawText(shipmentInfo.commune.nomLatin, {
      x: 95,
      y: height - 92,
      size: 8,
    });
    firstPage.drawText(shipmentInfo.commune.wilaya.nomLatin, {
      x: 95,
      y: height - 102,
      size: 8,
    });
    firstPage.drawText(shipmentInfo.expiditeurPublic.telephoneExp, {
      x: 95,
      y: height - 112,
      size: 8,
    });
    firstPage.drawText(shipmentInfo.expiditeurPublic.numIdentite, {
      x: 95,
      y: height - 122,
      size: 8,
    });

    // --------------------- Destinataire -----------------

    // firstPage.drawText('Destinataire', {
    //   x: 95,
    //   y: height - 62,
    //   size: 8,
    // });

    firstPage.drawText('Destinataire', {
      x: 25,
      y: height - 130,
      size: 8,
    });
    firstPage.drawText(shipmentInfo.raisonSociale, {
      x: 25,
      y: height - 140,
      size: 8,
    });
    firstPage.drawText(shipmentInfo.nom + ' ' + shipmentInfo.prenom, {
      x: 25,
      y: height - 170.6,
      size: 8,
    });

    firstPage.drawText(shipmentInfo.adresse, {
      x: 25,
      y: height - 150,
      size: 8,
    });

    firstPage.drawText(
      shipmentInfo.commune.wilaya.nomLatin +
        ' ' +
        shipmentInfo.commune.nomLatin,
      {
        x: 25,
        y: height - 160,
        size: 8,
      },
    );

    firstPage.drawText(shipmentInfo.telephone, {
      x: 25,
      y: height - 180,
      size: 8,
    });

    let jpgUrl = '';
    if (
      shipmentInfo.service.nom.toLowerCase() == 'classique entreprise' ||
      shipmentInfo.service.nom.toLowerCase() == 'classique divers'
    ) {
      jpgUrl = 'src/assets/img/classique.png';
    }else if ( shipmentInfo.service.nom.toLowerCase() == "soumission"){
      jpgUrl = 'src/assets/img/soumission.png';
    }else if (shipmentInfo.service.nom.toLowerCase() == "cahier de charge") {
      if (shipmentInfo.parentShipment != null) {
        jpgUrl = 'src/assets/img/cahier_des_charge.png'
      }else{
        jpgUrl = 'src/assets/img/retrait_cahier_de_charge.png'
      }
    }

    const jpgImage = await pdfDoc.embedPng(fs.readFileSync(jpgUrl));

    firstPage.drawImage(jpgImage, {
      x: 165,
      y: 563,
      width: 120,
      height: 33,
    });

    const textWilayaCode = '' + shipmentInfo.commune.wilaya.codeWilaya;
    const textSizeWilayaCode = 67;
    const textWidthWilayaCode = helveticaFont.widthOfTextAtSize(
      textWilayaCode,
      textSize,
    );
    const textHeightWilayaCode = helveticaFont.heightAtSize(textSize);
    firstPage.drawText(textWilayaCode, {
      x: 180 - textWidthWilayaCode / 2,
      y: height - 140 - textHeightWilayaCode / 2,
      size: textSizeWilayaCode,
    });

    const textWilayaLatin = shipmentInfo.commune.wilaya.nomLatin;
    const textSizeWilayaLatin = 12;
    const textWidthWilayaLatin = helveticaFont.widthOfTextAtSize(
      textWilayaLatin,
      textSizeWilayaLatin,
    );

    const textHeightWilayaLatin =
      helveticaFont.heightAtSize(textSizeWilayaLatin);
    firstPage.drawText(textWilayaLatin, {
      x: 210 - textWidthWilayaLatin / 2,
      y: height - 155 - textHeightWilayaLatin / 2,
      size: textSizeWilayaLatin,
    });

    const textCommuneLatin = shipmentInfo.commune.wilaya.nomLatin;
    const textSizeCommuneLatin = 10;
    const textWidthCommuneLatin = helveticaFont.widthOfTextAtSize(
      textCommuneLatin,
      textSizeCommuneLatin,
    );

    const textHeightCommuneLatin =
      helveticaFont.heightAtSize(textSizeCommuneLatin);
    firstPage.drawText(textCommuneLatin, {
      x: 210 - textWidthCommuneLatin / 2,
      y: height - 168 - textHeightCommuneLatin / 2,
      size: textSizeCommuneLatin,
    });

    firstPage.drawText(shipmentInfo.designationProduit, {
      x: 30,
      y: height - 310,
      size: 8,
    });

    // ########################### condition si document #################################
    if (
      shipmentInfo.poids == 0 &&
      shipmentInfo.largeur == 0 &&
      shipmentInfo.hauteur == 0 &&
      shipmentInfo.longueur == 0 &&
      shipmentInfo.prixEstimer == 0
    ) {
      firstPage.drawText('Documents', {
        x: 27,
        y: 286,
        size: 8,
      });
    } else {
      firstPage.drawText('Poid: ' + shipmentInfo.poids + ' Kg', {
        x: 27,
        y: 286,
        size: 8,
      });

      firstPage.drawText(
        'Dimension: (' +
          shipmentInfo.longueur +
          ' x ' +
          shipmentInfo.largeur +
          ' x ' +
          shipmentInfo.hauteur +
          ') en (m)',
        { x: 70, y: 286, size: 8 },
      );
    }

    const textRetour =
      shipmentInfo.createdBy.employe.agence.commune.codePostal.toString();
    const textSizeRetour = 10;
    const textWidthRetour = helveticaFont.widthOfTextAtSize(
      textRetour,
      textSizeRetour,
    );

    const textHeightRetour = helveticaFont.heightAtSize(textSizeRetour);

    firstPage.drawText('RT:' + textRetour, {
      x: 240,
      y: height - 185 - textHeightRetour / 2,
      size: textSizeRetour,
    });

    const textAgent = shipmentInfo.createdBy.employe.codeEmploye.toString();
    const textWidthAgent = helveticaFont.widthOfTextAtSize(
      textRetour,
      textSizeRetour,
    );

    const textHeightAgent = helveticaFont.heightAtSize(textSizeRetour);

    firstPage.drawText('AG:' + textRetour, {
      x: 170,
      y: height - 185 - textHeightRetour / 2,
      size: textSizeRetour,
    });

    firstPage.drawText(shipmentInfo.createdAt.toISOString().split('T')[0], {
      x: 210,
      y: 262,
      size: 8,
    });

    if (shipmentInfo.livraisonGratuite == null) {
      const textSizeRecouvrement = 14;
      firstPage.drawText(
        'Tarif Livraison:' + tarifLivraison.toString() + ' DA',
        {
          x: 50,
          y: 413,
          size: textSizeRecouvrement,
          color: rgb(0, 0, 0),
        },
      );
    } else {
      const textSizeRecouvrement = 25;
      firstPage.drawText('Rec: ' + shipmentInfo.prixVente.toString() + ' DA', {
        x: 50,
        y: 410,
        size: textSizeRecouvrement,
        color: rgb(1, 1, 1),
      });
    }

    // firstPage.drawRectangle({
    //   x: 20,
    //   y: 405,
    //   width: 265,
    //   height: 27,
    // rotate: degrees(-15),
    //   borderWidth: 0,
    //   borderColor: grayscale(0.5),
    //   color: rgb(0.75, 0.2, 0.2),
    //   opacity: 0.5,
    //   borderOpacity: 0.75,
    // });

    const textSizePrixEstime = 10;
    if (shipmentInfo.prixEstimer == 0) {
      firstPage.drawText('--', {
        x: 210,
        y: height - 310,
        size: textSizePrixEstime,
        // color: rgb(1, 1, 1),
      });
    } else {
      firstPage.drawText(shipmentInfo.prixEstimer.toString() + ' DA', {
        x: 210,
        y: height - 310,
        size: textSizePrixEstime,
        // color: rgb(1, 1, 1),
      });
    }

    // ########## QR-CODE #########
    const qrcodeBuffer = await QRCode.toBuffer(
      shipmentInfo.tracking +
        '*' +
        shipmentInfo.expiditeurPublic.raisonSocialeExp +
        '*' +
        shipmentInfo.createdBy.employe.agence.commune.wilaya.nomLatin +
        '*' +
        shipmentInfo.nom +
        ' ' +
        shipmentInfo.prenom +
        '*' +
        shipmentInfo.commune.wilaya.nomLatin +
        '*' +
        shipmentInfo.telephone +
        '*' +
        shipmentInfo.designationProduit +
        '*' +
        shipmentInfo.poids +
        '*' +
        shipmentInfo.nom +
        '*' +
        shipmentInfo.livraisonDomicile +
        '*' +
        shipmentInfo.adresse +
        '*' +
        shipmentInfo.livraisonGratuite +
        '*',
      {
        color: {
          dark: '#000', // Blue dots
          light: '#0000', // Transparent background
        },
        errorCorrectionLevel: 'H',
        margin: 0,
      },
    );

    const qrcodeImage = await pdfDoc.embedPng(qrcodeBuffer);
    const qrcodeDims = qrcodeImage.scaleToFit(63, 63);

    firstPage.drawImage(qrcodeImage, {
      x: 55 - qrcodeDims.width / 2,
      y: height - 85 - qrcodeDims.height / 2,
      width: qrcodeDims.width,
      height: qrcodeDims.height,
    });

    //################## CODE BARRE ################
    let barcodeBuffer = null;
    barcodeBuffer = await bwipjs.toBuffer({
      bcid: 'code128', // Barcode type
      text: shipmentInfo.tracking, // Text to encode
      scale: 3, // 3x scaling factor
      height: 5, // Bar height, in millimeters
      paddingheight: 2,
      includetext: true, // Show human-readable text
      textsize: 7,
      textyoffset: 1,
      textxalign: 'center', // Always good to set this
    });

    const barcodeImage = await pdfDoc.embedPng(barcodeBuffer);
    const barcodeDims = barcodeImage.scaleToFit(210, 75);

    firstPage.drawImage(barcodeImage, {
      x: 160 - barcodeDims.width / 2,
      y: height - 250.3 - barcodeDims.height / 2,
      width: barcodeDims.width,
      height: barcodeDims.height,
    });

   // pdfDoc.addPage(this.generateShipmentAgence(shipmentInfo.accShipment[0],0))

  //  const pdfBytes = await pdfDoc.save();
 //   fs.writeFileSync('dest', pdfBytes);
    return pdfDoc;
  }

  async generateInterneShipment(
    shipmentInfo,
    employeInfo,
    detinataireInfo,
    datePresExpedition,
  ) {
    let packageSlipTemplatePath = '';

    packageSlipTemplatePath = 'src/assets/bordereau_interne.pdf';

    const pdfTemplateBytes = fs.readFileSync(packageSlipTemplatePath);
    const dest = 'src/testpdf/bordereauInterne.pdf';
    const pdfDoc = await PDFDocument.load(pdfTemplateBytes);

    // Embed the Helvetica font
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

    // Get the first page of the document
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];

    const { width, height } = firstPage.getSize();
    firstPage.drawText(
      'Crée le ' + (await this.formatDate(datePresExpedition)),
      {
        x: 17,
        y: height - 56,
        size: 10,
      },
    );
    firstPage.drawText(employeInfo.nom + ' ' + employeInfo.prenom, {
      x: 40,
      y: height - 86,
      size: 12,
    });
    firstPage.drawText(
      employeInfo.agence.nom + ' / ' + employeInfo.agence.commune.nomLatin,
      {
        x: 57,
        y: height - 103,
        size: 10,
      },
    );

    firstPage.drawText(employeInfo.numTelephone, {
      x: 40,
      y: height - 122,
      size: 12,
    });

    //shipment info

    firstPage.drawText(
      shipmentInfo.shipment_nom + ' ' + shipmentInfo.shipment_prenom,
      { x: 38, y: height - 151, size: 13 },
    );
    firstPage.drawText(
      detinataireInfo.agence.type.toString() + ' ' + detinataireInfo.agence.nom,
      {
        x: 50,
        y: height - 166.8,
        size: 10,
      },
    );
    //designation
    firstPage.drawText(shipmentInfo.shipment_designationProduit, {
      x: 90,
      y: height - 252,
      size: 10,
    });
    //wilaya code
    const textWilayaCode = '' + shipmentInfo.wilaya_codeWilaya;
    const textSizeWilayaCode = 78;
    const textWidthWilayaCode = helveticaFont.widthOfTextAtSize(
      textWilayaCode,
      20,
    );
    const textHeightWilayaCode = helveticaFont.heightAtSize(20);
    firstPage.drawText(textWilayaCode, {
      x: 243,
      y: height - 220,
      size: textSizeWilayaCode,
    });
    //wilaya nom latin
    const textWilayaLatin = shipmentInfo.wilaya_nomLatin;
    const textSizeWilayaLatin = 18;

    firstPage.drawText(textWilayaLatin, {
      x: 368,
      y: height - 180,
      size: textSizeWilayaLatin,
    });

    //commune
    const textCommune = shipmentInfo.commune_nomLatin.toString();

    firstPage.drawText(textCommune, {
      x: 368,
      y: height - 215,
      size: 18,
    });
    //tracking
    firstPage.drawText(
      shipmentInfo.shipment_tracking.toString().toUpperCase(),
      {
        x: 330,
        y: height - 70,
        size: 28,
        font: helveticaFont,
      },
    );
    //CODE BARRE
    const barcodeBuffer = await bwipjs.toBuffer({
      bcid: 'code128', // Barcode type
      text: shipmentInfo.shipment_tracking, // Text to encode
      scale: 3, // 3x scaling factor
      height: 8, // Bar height, in millimeters
      paddingheight: 2,
      includetext: false, // Show human-readable text
      textxalign: 'center', // Always good to set this
    });

    const barcodeImage = await pdfDoc.embedPng(barcodeBuffer);
    const barcodeDims = barcodeImage.scaleToFit(230, 85);

    firstPage.drawImage(barcodeImage, {
      x: 293,
      y: height - 150,
      width: barcodeDims.width,
      height: barcodeDims.height,
    });
    //QR CODE
    const qrcodeBuffer = await QRCode.toBuffer(
      datePresExpedition +
        '*' +
        employeInfo.nom +
        '*' +
        employeInfo.prenom +
        '*' +
        employeInfo.agence.nom +
        '*' +
        employeInfo.agence.commune.nomLatin +
        '*' +
        employeInfo.numTelephone +
        '*' +
        shipmentInfo.shipment_nom +
        '*' +
        shipmentInfo.shipment_prenom +
        '*' +
        detinataireInfo.agence.type.toString() +
        '*' +
        detinataireInfo.agence.nom +
        '*' +
        shipmentInfo.shipment_designationProduit +
        '*' +
        shipmentInfo.wilaya_codeWilaya +
        '*' +
        shipmentInfo.wilaya_nomLatin +
        '*' +
        shipmentInfo.commune_nomLatin.toString() +
        '*' +
        shipmentInfo.shipment_tracking.toString(),
      {
        color: {
          dark: '#000', // Blue dots
          light: '#0000', // Transparent background
        },
        errorCorrectionLevel: 'H',
        margin: 0,
      },
    );

    const qrcodeImage = await pdfDoc.embedPng(qrcodeBuffer);
    const qrcodeDims = qrcodeImage.scaleToFit(55, 55);

    firstPage.drawImage(qrcodeImage, {
      x: 17,
      y: height - 230,
      width: qrcodeDims.width,
      height: qrcodeDims.height,
    });

    const pdfBytes = await pdfDoc.save();
    fs.writeFileSync(dest, pdfBytes);
    return pdfDoc;
  }
  
  async generatePackageSlip(
    infoPackageSlip,
    infoClient,
    tarifLivraison,
    recouvrement,
    datePresExpedition,
    otherStatus?,
  ) {
    let packageSlipTemplatePath = '';
    console.log(infoPackageSlip, tarifLivraison);
    // if (infoClient.client_nbTentative == 3) {
    packageSlipTemplatePath = 'src/assets/newBordereau.pdf';
    // } else {
    //   packageSlipTemplatePath = ''
    // }

    const pdfTemplateBytes = fs.readFileSync(packageSlipTemplatePath);
    const dest = 'src/testpdf/bordereau.pdf';
    const pdfDoc = await PDFDocument.load(pdfTemplateBytes);

    // Embed the Helvetica font
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

    // Get the first page of the document
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];

    const { width, height } = firstPage.getSize();

    //infoPackageSliprmation service
    const text = infoPackageSlip.service_nom.toUpperCase();
    const textSize = 16;
    const textWidth = helveticaFont.widthOfTextAtSize(text, textSize);
    const textHeight = helveticaFont.heightAtSize(textSize);
    firstPage.drawText(text, {
      // x: 24.5 + textHeight / 2,
      // y: height - 133 - textWidth / 2,
      x: 155,
      y: 795,
      size: textSize,
      // color: rgb(1, 1, 1),
    });

    //Remplissage infoPackageSliprmations expéditeur
    if (otherStatus) {
      firstPage.drawText('Destinataire', {
        x: 95,
        y: height - 62,
        size: 8,
      });
    } else {
      firstPage.drawText('Expéditeur', {
        x: 95,
        y: height - 62,
        size: 8,
      });
    }

    firstPage.drawText(infoClient.client_raisonSociale, {
      x: 95,
      y: height - 72,
      size: 8,
    });
    firstPage.drawText(infoClient.client_adresse, {
      x: 95,
      y: height - 82,
      size: 8,
    });
    firstPage.drawText(infoClient.commune_nomLatin, {
      x: 95,
      y: height - 92,
      size: 8,
    });
    firstPage.drawText(infoClient.wilaya_nomLatin, {
      x: 95,
      y: height - 102,
      size: 8,
    });
    firstPage.drawText(infoClient.client_telephone, {
      x: 95,
      y: height - 112,
      size: 8,
    });

    //Remplissage infoPackageSliprmations
    if (otherStatus) {
      firstPage.drawText('Expéditeur', {
        x: 25,
        y: height - 130,
        size: 8,
      });
    } else {
      firstPage.drawText('Destinataire', {
        x: 25,
        y: height - 130,
        size: 8,
      });
    }

    firstPage.drawText(infoPackageSlip.shipment_raisonSociale, {
      x: 25,
      y: height - 140,
      size: 8,
    });
    firstPage.drawText(
      infoPackageSlip.shipment_nom + ' ' + infoPackageSlip.shipment_prenom,
      { x: 25, y: height - 170.6, size: 8 },
    );
    if (infoPackageSlip.shipment_adresse) {
      firstPage.drawText(infoPackageSlip.shipment_adresse, {
        x: 25,
        y: height - 150,
        size: 8,
      });
    } else {
      firstPage.drawText('Stop Desk', { x: 25, y: height - 150, size: 8 });
    }
    firstPage.drawText(
      infoPackageSlip.wilaya_nomLatin + ' ' + infoPackageSlip.commune_nomLatin,
      {
        x: 25,
        y: height - 160,
        size: 8,
      },
    );

    firstPage.drawText(infoPackageSlip.shipment_telephone, {
      x: 25,
      y: height - 180,
      size: 8,
    });

    let jpgUrl = '';

    if (
      infoPackageSlip.service_nom.toLowerCase() ==
        'e-commerce express divers' ||
      infoPackageSlip.service_nom.toLowerCase() ==
        'e-commerce express entreprise'
    ) {
      jpgUrl = 'src/assets/img/e_comerce.png';
    }
    if (
      infoPackageSlip.service_nom.toLowerCase() ==
        'e-commerce economy entreprise' ||
      infoPackageSlip.service_nom.toLowerCase() == 'e-Commerce economy divers'
    ) {
      jpgUrl = 'src/assets/img/economie.png';
    }

    if (
      infoPackageSlip.service_nom.toLowerCase() == 'classique entreprise' ||
      infoPackageSlip.service_nom.toLowerCase() == 'classique divers'
    ) {
      jpgUrl = 'src/assets/img/classique.png';
    }

    const jpgImage = await pdfDoc.embedPng(fs.readFileSync(jpgUrl));

    firstPage.drawImage(jpgImage, {
      x: 165,
      y: 563,
      width: 120,
      height: 33,
    });
    //infoPackageSliprmations destination

    const textWilayaCode = '' + infoPackageSlip.wilaya_codeWilaya;
    const textSizeWilayaCode = 67;
    const textWidthWilayaCode = helveticaFont.widthOfTextAtSize(
      textWilayaCode,
      textSize,
    );
    const textHeightWilayaCode = helveticaFont.heightAtSize(textSize);
    firstPage.drawText(textWilayaCode, {
      x: 180 - textWidthWilayaCode / 2,
      y: height - 140 - textHeightWilayaCode / 2,
      size: textSizeWilayaCode,
    });

    const textWilayaLatin = infoPackageSlip.wilaya_nomLatin;
    const textSizeWilayaLatin = 12;
    const textWidthWilayaLatin = helveticaFont.widthOfTextAtSize(
      textWilayaLatin,
      textSizeWilayaLatin,
    );

    const textHeightWilayaLatin =
      helveticaFont.heightAtSize(textSizeWilayaLatin);
    firstPage.drawText(textWilayaLatin, {
      x: 210 - textWidthWilayaLatin / 2,
      y: height - 155 - textHeightWilayaLatin / 2,
      size: textSizeWilayaLatin,
    });
    //
    const textCommuneLatin = infoPackageSlip.wilaya_nomLatin;
    const textSizeCommuneLatin = 10;
    const textWidthCommuneLatin = helveticaFont.widthOfTextAtSize(
      textCommuneLatin,
      textSizeCommuneLatin,
    );

    const textHeightCommuneLatin =
      helveticaFont.heightAtSize(textSizeCommuneLatin);
    firstPage.drawText(textCommuneLatin, {
      x: 210 - textWidthCommuneLatin / 2,
      y: height - 168 - textHeightCommuneLatin / 2,
      size: textSizeCommuneLatin,
    });
    //Ouverture Colis
    let textOvrir: string;
    if (infoPackageSlip.shipment_ouvrireColis) {
      textOvrir = 'OUI';
    } else {
      textOvrir = 'NON';
    }
    const textSizeOvrir = 18;
    const textWidthOvrir = helveticaFont.widthOfTextAtSize(
      textOvrir,
      textSizeOvrir,
    );
    const textHeightOvrir = helveticaFont.heightAtSize(textSizeOvrir);
    firstPage.drawText(textOvrir, {
      x: 203 - textWidthOvrir / 2,
      y: height - 223.2 - textHeightOvrir / 2,
      size: textSizeOvrir,
      color: rgb(1, 1, 1),
    });
    //infoPackageSliprmations colis
    if (otherStatus && otherStatus == 'ECH') {
      firstPage.drawText(infoPackageSlip.shipment_objetRecuperer, {
        x: 30,
        y: height - 310,
        size: 8,
      });
    } else {
      firstPage.drawText(infoPackageSlip.shipment_designationProduit, {
        x: 30,
        y: height - 310,
        size: 8,
      });
    }

    firstPage.drawText('# ' + infoPackageSlip.shipment_numCommande, {
      x: 25,
      y: height - 380,
      size: 8,
    });

    firstPage.drawText('Poid: ' + infoPackageSlip.shipment_poids + ' Kg', {
      x: 27,
      y: 286,
      size: 8,
    });

    firstPage.drawText(
      'Dimension: (' +
        infoPackageSlip.shipment_longueur +
        ' x ' +
        infoPackageSlip.shipment_largeur +
        ' x ' +
        infoPackageSlip.shipment_hauteur +
        ') en (m)',
      { x: 75, y: 286, size: 8 },
    );

    // firstPage.drawText(
    //   (infoPackageSlip.shipment_poids - infoClient.client_poidsBase >= 0
    //     ? infoPackageSlip.shipment_poids - infoClient.client_poidsBase
    //     : 0) + ' Kg',
    //   {
    //     x: 286.6,
    //     y: height - 262.1,
    //     size: 8,
    //   },
    // );

    //     //infoPackageSliprmations date

    //     firstPage.drawText(client.wilayaDepart.nomLatin, {
    //       x: 524.2,
    //       y: height - 64.8,
    //       size: 8,
    //     });
    //     firstPage.drawText(packageSlip.dateExpedition.toISOString().split('T')[0], {
    //       x: 535,
    //       y: height - 76.3,
    //       size: 8,
    //     });
    //     firstPage.drawText(packageSlip.dateLivraison.toISOString().split('T')[0], {
    //       x: 531.4,
    //       y: height - 87.1,
    //       size: 8,
    //     });

    //infoPackageSliprmations Retour
    // console.log(infoClient)
    const textRetour = infoClient.communeRetour_codePostal.toString();
    const textSizeRetour = 10;
    const textWidthRetour = helveticaFont.widthOfTextAtSize(
      textRetour,
      textSizeRetour,
    );

    const textHeightRetour = helveticaFont.heightAtSize(textSizeRetour);

    firstPage.drawText('RT:' + textRetour, {
      x: 240,
      y: height - 185 - textHeightRetour / 2,
      size: textSizeRetour,
    });

    /**
    datePresExpedition
     * 
     */

    firstPage.drawText(datePresExpedition.toISOString().split('T')[0], {
      x: 210,
      y: 262,
      size: 8,
    });
    const textSizeRecouvrement = 20;
    if (infoPackageSlip.shipment_livraisonGratuite) {
      firstPage.drawText('Montant à récolter:', {
        x: 25,
        y: 415,
        size: 14,
        // color: rgb(0, 0, 0),
      });
      firstPage.drawText(
        infoPackageSlip.shipment_prixVente
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' DA',
        {
          x: 145,
          y: 412,
          size: textSizeRecouvrement,
          // color: rgb(0, 0, 0),
        },
      );
    } else {
      firstPage.drawText('Montant à récolter:', {
        x: 25,
        y: 415,
        size: 14,
        // color: rgb(1, 1, 1),
      });
      firstPage.drawText(
        recouvrement.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' DA',
        {
          x: 145,
          y: 412,
          size: textSizeRecouvrement,
          // color: rgb(1, 1, 1),
        },
      );
    }
    //
    const textSizePrixEstime = 10;
    firstPage.drawText(
      infoPackageSlip.shipment_prixEstimer
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' DA',
      {
        x: 210,
        y: height - 310,
        size: textSizePrixEstime,
        // color: rgb(1, 1, 1),
      },
    );
    //

    firstPage.drawRectangle({
      x: 20,
      y: 405,
      width: 265,
      height: 27,
      // rotate: degrees(-15),
      borderWidth: 0,
      borderColor: grayscale(0.5),
      color: rgb(0.75, 0.2, 0.2),
      opacity: 0.5,
      borderOpacity: 0.75,
    });

    //infoPackageSliprmations livraison
    if (!infoPackageSlip.shipment_livraisonDomicile) {
      const jpgUrl1 = 'src/assets/img/sd.png';

      const jpgImage1 = await pdfDoc.embedPng(fs.readFileSync(jpgUrl1));

      firstPage.drawImage(jpgImage1, {
        x: 245,
        y: 530,
        width: 40,
        height: 28,
      });
    }
    if (otherStatus == 'ECH') {
      const jpgUrlech = 'src/assets/img/avec-echange.png';
      const jpgImage1 = await pdfDoc.embedPng(fs.readFileSync(jpgUrlech));
      firstPage.drawImage(jpgImage1, {
        x: 165,
        y: 590,
        width: 90,
        height: 13,
      });
    }

    //CR CODE
    const qrcodeBuffer = await QRCode.toBuffer(
      infoPackageSlip.shipment_tracking +
        '*' +
        infoClient.client_nomCommercial +
        '*' +
        infoClient.wilaya_nomLatin +
        '*' +
        infoPackageSlip.shipment_nom +
        ' ' +
        infoPackageSlip.shipment_prenom +
        '*' +
        infoPackageSlip.wilaya_nomLatin +
        '*' +
        infoPackageSlip.shipment_telephone +
        '*' +
        infoPackageSlip.shipment_designationProduit +
        '*' +
        recouvrement +
        '*' +
        infoPackageSlip.shipment_poids +
        '*' +
        infoPackageSlip.service_nom +
        '*' +
        infoPackageSlip.shipment_livraisonDomicile +
        '*' +
        infoPackageSlip.shipment_adresse +
        '*' +
        infoPackageSlip.shipment_livraisonGratuite +
        '*',
      {
        color: {
          dark: '#000', // Blue dots
          light: '#0000', // Transparent background
        },
        errorCorrectionLevel: 'H',
        margin: 0,
      },
    );

    const qrcodeImage = await pdfDoc.embedPng(qrcodeBuffer);
    const qrcodeDims = qrcodeImage.scaleToFit(63, 63);

    firstPage.drawImage(qrcodeImage, {
      x: 55 - qrcodeDims.width / 2,
      y: height - 85 - qrcodeDims.height / 2,
      width: qrcodeDims.width,
      height: qrcodeDims.height,
    });

    //CODE BARRE
    let barcodeBuffer = null;

    if (otherStatus == 'ECH') {
      barcodeBuffer = await bwipjs.toBuffer({
        bcid: 'code128', // Barcode type
        text: infoPackageSlip.shipmentRelation_tracking, // Text to encode
        scale: 3, // 3x scaling factor
        height: 5, // Bar height, in millimeters
        paddingheight: 2,
        includetext: true, // Show human-readable text
        textsize: 7,
        textyoffset: 1,

        textxalign: 'center', // Always good to set this
      });
    } else {
      barcodeBuffer = await bwipjs.toBuffer({
        bcid: 'code128', // Barcode type
        text: infoPackageSlip.shipment_tracking, // Text to encode
        scale: 3, // 3x scaling factor
        height: 5, // Bar height, in millimeters
        paddingheight: 2,
        includetext: true, // Show human-readable text
        textsize: 7,
        textyoffset: 1,
        textxalign: 'center', // Always good to set this
      });
    }
    const barcodeImage = await pdfDoc.embedPng(barcodeBuffer);
    const barcodeDims = barcodeImage.scaleToFit(210, 75);

    firstPage.drawImage(barcodeImage, {
      x: 160 - barcodeDims.width / 2,
      y: height - 250.3 - barcodeDims.height / 2,
      width: barcodeDims.width,
      height: barcodeDims.height,
    });

    const barcodeCommandeBuffer = await bwipjs.toBuffer({
      bcid: 'code128', // Barcode type
      text: infoPackageSlip.shipment_numCommande, // Text to encode
      scale: 3, // 3x scaling factor
      height: 10, // Bar height, in millimeters
      paddingheight: 2,
      includetext: false, // Show human-readable text
      textxalign: 'center', // Always good to set this
    });

    const barcodeCommandeImage = await pdfDoc.embedPng(barcodeCommandeBuffer);
    const barcodeCommandeDims = barcodeCommandeImage.scaleToFit(138, 22);

    firstPage.drawImage(barcodeCommandeImage, {
      x: 90 - barcodeCommandeDims.width / 2,
      y: height - 360 - barcodeCommandeDims.height / 2,
      width: barcodeCommandeDims.width,
      height: barcodeCommandeDims.height,
    });
    // const factureDoc = await this.generateFacture(
    //   infoPackageSlip,
    //   infoClient,
    //   tarifLivraison,
    //   datePresExpedition,
    // );
    // const facturePage = await pdfDoc.copyPages(factureDoc, [0]);
    // pdfDoc.addPage(facturePage[0]);

    // RETURN BUFFER
    // let color: Color;
    // if ((infoPackageSlip.service_nom == 'CLASSIQUE DIVERS')) {
    //   color = rgb(0, 0.25, 0);
    // } else {
    //   color = rgb(0, 1, 0);
    // }

    // firstPage.drawRectangle({
    //   x: 153,
    //   y: 783,
    //   width: 125,
    //   height: 35,
    //   borderWidth: 1,
    //   borderColor: color,
    //   color: color,

    // });
    // const pdfBytes = await pdfDoc.save();
    // fs.writeFileSync(dest, pdfBytes);

    return pdfDoc;
  }

  async generateFacture(
    infoPackageSlip,
    infoClient,
    tarifLivraison,
    datePresExpedition,
  ) {
    const packageSlipTemplatePath = 'src/assets/facture.pdf';
    const pdfTemplateBytes = fs.readFileSync(packageSlipTemplatePath);
    const dest = 'src/testpdf/factureFR.pdf';
    const pdfDoc = await PDFDocument.load(pdfTemplateBytes);

    // Embed the Helvetica font
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

    // Get the first page of the document
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];

    const { width, height } = firstPage.getSize();

    //date
    firstPage.drawText(datePresExpedition.toISOString().split('T')[0], {
      x: 69.8,
      y: height - 31.7,
      size: 10,
    });
    // firstPage.drawText(
    //   'packageSlip.dateExpedition'.toISOString().split('T')[0],
    //   {
    //     x: 69.8,
    //     y: height - 31.7,
    //     size: 10,
    //   },
    // );
    //Numero Facture
    firstPage.drawText(infoPackageSlip.shipment_tracking, {
      x: 290.2,
      y: height - 157,
      size: 13,
    });
    firstPage.drawText(infoClient.client_raisonSociale, {
      x: 107.3,
      y: height - 242.6,
      size: 8,
    });
    firstPage.drawText(
      infoClient.client_nomGerant + '' + infoClient.client_prenomGerant,
      {
        x: 105.1,
        y: height - 261.4,
        size: 8,
      },
    );
    firstPage.drawText(infoClient.client_adresse, {
      x: 78.5,
      y: height - 278.6,
      size: 8,
    });
    firstPage.drawText(infoClient.commune_nomLatin, {
      x: 86.4,
      y: height - 295.9,
      size: 8,
    });
    firstPage.drawText(infoClient.wilaya_nomLatin, {
      x: 72.7,
      y: height - 313.9,
      size: 8,
    });
    firstPage.drawText(infoClient.client_telephone, {
      x: 134.6,
      y: height - 332.6,
      size: 8,
    });

    //Remplissage infoPackageSliprmations

    firstPage.drawText('raisonSociale', { x: 468, y: height - 242.6, size: 8 });
    firstPage.drawText(
      infoPackageSlip.shipment_nom + ' ' + infoPackageSlip.shipment_prenom,
      {
        x: 466.6,
        y: height - 261.4,
        size: 8,
      },
    );

    if (infoPackageSlip.shipment_adresse) {
      firstPage.drawText(infoPackageSlip.shipment_adresse, {
        x: 437.8,
        y: height - 278.6,
        size: 8,
      });
    } else {
      firstPage.drawText('Stop Desk', {
        x: 437.8,
        y: height - 278.6,
        size: 8,
      });
    }

    firstPage.drawText(infoPackageSlip.commune_nomLatin, {
      x: 445.7,
      y: height - 295.9,
      size: 8,
    });
    firstPage.drawText(infoPackageSlip.wilaya_nomLatin, {
      x: 432.7,
      y: height - 313.9,
      size: 8,
    });
    firstPage.drawText(infoPackageSlip.shipment_telephone, {
      x: 493.9,
      y: height - 332.6,
      size: 8,
    });

    //infoinfoPackageSliprmations marchandise
    firstPage.drawText(infoPackageSlip.shipment_designationProduit, {
      x: 159.8,
      y: height - 386.6,
      size: 9,
    });

    //Details
    firstPage.drawText(infoPackageSlip.shipment_designationProduit, {
      x: 46.1,
      y: height - 439.9,
      size: 10,
    });
    firstPage.drawText(
      infoPackageSlip.shipment_prixVente
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' DA',
      { x: 474.5, y: height - 439.9, size: 10 },
    );
    if (!infoPackageSlip.shipment_livraisonGratuite) {
      firstPage.drawText('Livraison', { x: 46.1, y: height - 470, size: 10 });
      firstPage.drawText(
        tarifLivraison.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' DA',
        { x: 474.5, y: height - 470, size: 10 },
      );
    }

    //CR CODE
    const qrcodeBuffer = await QRCode.toBuffer(
      infoPackageSlip.tracking +
        '*' +
        infoClient.client_nomCommercial +
        '*' +
        infoClient.wilaya_nomLatin +
        '*' +
        infoPackageSlip.nom +
        ' ' +
        infoPackageSlip.prenom +
        '*' +
        infoPackageSlip.wilaya +
        '*' +
        infoPackageSlip.telephone +
        '*' +
        infoPackageSlip.nomProduit +
        '*' +
        infoPackageSlip.recouvrement +
        '*' +
        infoPackageSlip.poidsFacture +
        '*' +
        infoPackageSlip.serviceId +
        '*' +
        infoPackageSlip.stopDesk +
        '*' +
        infoPackageSlip.adresse +
        '*' +
        infoPackageSlip.livraisonGratuite +
        '*',
      {
        color: {
          dark: '#000', // Blue dots
          light: '#0000', // Transparent background
        },
        errorCorrectionLevel: 'H',
        margin: 0,
      },
    );

    const qrcodeImage = await pdfDoc.embedPng(qrcodeBuffer);
    const qrcodeDims = qrcodeImage.scaleToFit(100, 100);

    firstPage.drawImage(qrcodeImage, {
      x: 530 - qrcodeDims.width / 2,
      y: height - 58 - qrcodeDims.height / 2,
      width: qrcodeDims.width,
      height: qrcodeDims.height,
    });

    //CODE BARRE
    const barcodeBuffer = await bwipjs.toBuffer({
      bcid: 'code128', // Barcode type
      text: infoPackageSlip.shipment_tracking, // Text to encode
      scale: 3, // 3x scaling factor
      height: 10, // Bar height, in millimeters
      paddingheight: 2,
      includetext: true, // Show human-readable text
      textxalign: 'center', // Always good to set this
    });

    const barcodeImage = await pdfDoc.embedPng(barcodeBuffer);
    const barcodeDims = barcodeImage.scaleToFit(190, 95);

    firstPage.drawImage(barcodeImage, {
      x: width / 2 - barcodeDims.width / 2,
      y: height - 60 - barcodeDims.height / 2,
      width: barcodeDims.width,
      height: barcodeDims.height,
    });

    //RETURN BUFFER

    const pdfBytes = await pdfDoc.save();
    fs.writeFileSync(dest, pdfBytes);
    return pdfDoc;
  }

  async printCarteClient(client) {
    const conventionTemplatePath = 'src/assets/carte_client.pdf';
    const pdfTemplateBytes = fs.readFileSync(conventionTemplatePath);
    const dest = 'src/testpdf/carte_client.pdf';
    const pdfDoc = await PDFDocument.load(pdfTemplateBytes);

    // Embed the Helvetica font
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    // Get the first page of the document
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];
    const secondPage = pages[1];
    const lastPage = pages[pages.length - 1];

    const { width, height } = firstPage.getSize();
    // code de client et agence d'ouverture
    firstPage.drawText(client.numClient.toUpperCase(), {
      x: 156,
      y: height - 46.5,
      size: 14,
      color: rgb(1, 1, 1),
    });
    firstPage.drawText(client.raisonSociale.toUpperCase(), {
      x: 87,
      y: height - 60,
      size: 10,
    });
    firstPage.drawText(client.nomCommercial.toUpperCase(), {
      x: 90,
      y: height - 71,
      size: 10,
    });
    firstPage.drawText(
      client.nomGerant.toUpperCase() + ' ' + client.prenomGerant,
      {
        x: 73,
        y: height - 83,
        size: 10,
      },
    );
    firstPage.drawText(
      client.communeResidence.nomLatin.toUpperCase() +
        '/' +
        client.communeResidence.wilaya.nomLatin.toUpperCase(),
      {
        x: 55,
        y: height - 94,
        size: 10,
      },
    );
    firstPage.drawText(client.telephone, {
      x: 62,
      y: height - 117,
      size: 10,
    });
    firstPage.drawText(client.user.email.toLowerCase(), {
      x: 45,
      y: height - 128,
      size: 10,
    });
    firstPage.drawText(client.jourPayement.toString(), {
      x: 92,
      y: height - 140,
      size: 8,
    });
    //
    const pdfBytes = await pdfDoc.save();
    fs.writeFileSync('dest', pdfBytes);
    return pdfBytes;
  }

  async templateConventionFretORClassic(client, service, codeTarifId) {
    let conventionTemplatePath;
    let xFret;
    if (service == 'Classique Entreprise') {
      conventionTemplatePath = 'src/assets/convention/classiqueFr.pdf';
    } else if (service == 'Fret') {
      conventionTemplatePath = 'src/assets/convention/fretFr.pdf';
      xFret = 280;
    }
    const pdfTemplateBytes = fs.readFileSync(conventionTemplatePath);
    const dest = 'src/testpdf/convention.pdf';
    const pdfDoc = await PDFDocument.load(pdfTemplateBytes);

    const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    // Embed the Helvetica font
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

    // Get the first page of the document
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];
    const secondPage = pages[1];
    const lastPage = pages[pages.length - 1];

    const { width, height } = firstPage.getSize();

    if (service == 'Classique Entreprise') {
      firstPage.drawText(service, {
        x: 230,
        y: height - 200,
        size: 15,
      });
    }

    // code de client et agence d'ouverture
    firstPage.drawText(client.numClient, {
      x: 135,
      y: height - 230,
      size: 11,
    });

    // date d'ouverture de compte
    let month = '' + (client.createdAt.getMonth() + 1);
    let day = '' + client.createdAt.getDate();
    const year = client.createdAt.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    const date = [day, month, year].join('-');

    firstPage.drawText(date, {
      x: 150,
      y: height - 253.6,
      size: 11,
    });

    // informations de client
    firstPage.drawText(client.raisonSociale, {
      x: 83,
      y: height - 307,
      size: 11,
    });
    firstPage.drawText(client.nomCommercial, {
      x: 107,
      y: height - 330,
      size: 11,
    });
    firstPage.drawText(client.adresse, {
      x: 60,
      y: height - 353.5,
      size: 11,
    });
    firstPage.drawText(client.communeResidence.codePostal, {
      x: 72,
      y: height - 377,
      size: 11,
    });
    firstPage.drawText(client.communeResidence.nomLatin, {
      x: 228,
      y: height - 377,
      size: 11,
    });
    firstPage.drawText(client.communeResidence.wilaya.nomLatin, {
      x: 368,
      y: height - 377,
      size: 11,
    });
    firstPage.drawText(client.nrc, {
      x: 175,
      y: height - 399.5,
      size: 11,
    });
    firstPage.drawText(client.nif, {
      x: 410,
      y: height - 399.5,
      size: 11,
    });
    firstPage.drawText(client.nomGerant + ' ' + client.prenomGerant, {
      x: 93,
      y: height - 422.5,
      size: 11,
    });
    firstPage.drawText(client.telephone, {
      x: 390,
      y: height - 422.5,
      size: 11,
    });
    firstPage.drawText(client.user.email, {
      x: 78,
      y: height - 445.5,
      size: 11,
    });

    // condition de paiement
    if (client.moyenPayement == 'espece') {
      firstPage.drawText('X', {
        x: 249,
        y: height - 497.5,
        size: 11,
      });
    } else if (client.moyenPayement == 'cheque') {
      firstPage.drawText('X', {
        x: 380,
        y: height - 497.5,
        size: 11,
      });
    } else {
      firstPage.drawText('X', {
        x: 516,
        y: height - 497.5,
        size: 11,
      });
    }

    // jours de paiement

    if (client.delaiPaiement == delaiPaiementEnum.alenvoi) {
      firstPage.drawText('X', {
        x: 124,
        y: height - 551.5,
        size: 11,
      });
    }
    if (client.delaiPaiement == delaiPaiementEnum.aLaReceptionDeLaFacture) {
      firstPage.drawText('X', {
        x: 282,
        y: height - 551.5,
        size: 11,
      });
    }
    if (client.delaiPaiement == delaiPaiementEnum.a15Jours) {
      firstPage.drawText('X', {
        x: 358,
        y: height - 551.5,
        size: 11,
      });
    }
    if (client.delaiPaiement == delaiPaiementEnum.a30Jours) {
      firstPage.drawText('X', {
        x: 428,
        y: height - 551.5,
        size: 11,
      });
    }

    if (client.delaiPaiement == delaiPaiementEnum.a45Jours) {
      firstPage.drawText('X', {
        x: 500,
        y: height - 551.5,
        size: 11,
      });
    }

    // Engagement
    firstPage.drawText(client.nbEnvoiMin.toString(), {
      x: 235,
      y: height - 602.5,
      size: 11,
    });
    firstPage.drawText(client.nbEnvoiMax.toString(), {
      x: 327,
      y: height - 602.5,
      size: 11,
    });

    //pour le client
    firstPage.drawText(client.nomGerant + ' ' + client.prenomGerant, {
      x: 430,
      y: height - 749.5,
      size: 10,
    });

    // -----------------------last page----------------
    lastPage.drawText(service, {
      x: 230,
      y: height - 94,
      size: 12,
      color: rgb(1, 0, 0),
    });

    lastPage.drawText(
      client.nomGerant.toUpperCase() + ' ' + client.prenomGerant.toUpperCase(),
      {
        x: 57,
        y: height - 108.5,
        size: 9,
      },
    );
    lastPage.drawText(client.communeDepart.wilaya.nomLatin.toUpperCase(), {
      x: 60,
      y: height - 126.5,
      size: 9,
    });
    // -----------------------end last page----------------
    //RETURN BUFFER

    const tarifClient = await this.clientService.getTarifOfclient(
      client.communeDepart.wilaya.id,
      codeTarifId,
    );
    tarifClient.sort((a, b) => (a.zone > b.zone ? 1 : -1));


    let i = 1;
    let largeur = 0;
    let longueur = 0;
    lastPage.drawRectangle({
      x: 25,
      y: height - 160,
      width: 450,
      height: 15,
      borderColor: rgb(0, 0, 0),
      borderWidth: 0.6,
      color: rgb(1, 0, 0),
    });

    lastPage.drawRectangle({
      x: 25,
      y: height - 280,
      width: 360,
      height: 120,
      borderColor: rgb(0, 0, 0),
      borderWidth: 0.6,
      // color: rgb(0, 0, 0),
    });
    // wilaya 1----------------

    lastPage.drawText('Wilaya', {
      x: 30,
      y: height - 155,
      size: 7,
      color: rgb(1, 1, 1),
      font: bold,
    });

    lastPage.drawLine({
      start: { x: 95, y: height - 145 },
      end: { x: 95, y: height - 280 },
      thickness: 0.7,
      color: rgb(0, 0, 0),
    });

    // zonnne 1----------------

    lastPage.drawText('zone', {
      x: 96.5,
      y: height - 155,
      size: 7,
      color: rgb(1, 1, 1),
      font: bold,
    });

    lastPage.drawLine({
      start: { x: 115, y: height - 145 },
      end: { x: 115, y: height - 280 },
      thickness: 0.7,
      color: rgb(0, 0, 0),
    });

    // wilaya 2----------------

    lastPage.drawText('Wilaya', {
      x: 120,
      y: height - 155,
      size: 7,
      color: rgb(1, 1, 1),
      font: bold,
    });

    lastPage.drawLine({
      start: { x: 185, y: height - 145 },
      end: { x: 185, y: height - 280 },
      thickness: 0.7,
      color: rgb(0, 0, 0),
    });

    // zonnne 2----------------

    lastPage.drawText('zone', {
      x: 186.5,
      y: height - 155,
      size: 7,
      color: rgb(1, 1, 1),
      font: bold,
    });

    lastPage.drawLine({
      start: { x: 205, y: height - 145 },
      end: { x: 205, y: height - 280 },
      thickness: 0.7,
      color: rgb(0, 0, 0),
    });

    // wilaya 3----------------

    lastPage.drawText('Wilaya', {
      x: 210,
      y: height - 155,
      size: 7,
      color: rgb(1, 1, 1),
      font: bold,
    });

    lastPage.drawLine({
      start: { x: 275, y: height - 145 },
      end: { x: 275, y: height - 280 },
      thickness: 0.7,
      color: rgb(0, 0, 0),
    });

    // zonnne 3----------------

    lastPage.drawText('zone', {
      x: 276.5,
      y: height - 155,
      size: 7,
      color: rgb(1, 1, 1),
      font: bold,
    });

    lastPage.drawLine({
      start: { x: 295, y: height - 145 },
      end: { x: 295, y: height - 280 },
      thickness: 0.7,
      color: rgb(0, 0, 0),
    });

    // wilaya 4----------------

    lastPage.drawText('Wilaya', {
      x: 300,
      y: height - 155,
      size: 7,
      color: rgb(1, 1, 1),
      font: bold,
    });

    lastPage.drawLine({
      start: { x: 365, y: height - 145 },
      end: { x: 365, y: height - 280 },
      thickness: 0.7,
      color: rgb(0, 0, 0),
    });

    // zonnne 4----------------

    lastPage.drawText('zone', {
      x: 366.5,
      y: height - 155,
      size: 7,
      color: rgb(1, 1, 1),
      font: bold,
    });
    lastPage.drawLine({
      start: { x: 385, y: height - 145 },
      end: { x: 385, y: height - 160 },
      thickness: 0.7,
      color: rgb(0, 0, 0),
    });

    // wilaya 5----------------

    lastPage.drawText('Wilaya', {
      x: 390,
      y: height - 155,
      size: 7,
      color: rgb(1, 1, 1),
      font: bold,
    });

    lastPage.drawLine({
      start: { x: 455, y: height - 145 },
      end: { x: 455, y: height - 256 },
      thickness: 0.7,
      color: rgb(0, 0, 0),
    });

    // zonnne 5----------------
    lastPage.drawText('zone', {
      x: 456.5,
      y: height - 155,
      size: 7,
      color: rgb(1, 1, 1),
      font: bold,
    });
    lastPage.drawLine({
      start: { x: 475, y: height - 145 },
      end: { x: 475, y: height - 256 },
      thickness: 0.7,
      color: rgb(0, 0, 0),
    });

    for await (const tarif of tarifClient) {
      if (i <= 10) {
        lastPage.drawText(tarif.destination, {
          x: 30 + largeur,
          y: height - 169 - longueur,
          size: 7,
        });

        lastPage.drawText(tarif.zone.toString(), {
          x: 100 + largeur,
          y: height - 169 - longueur,
          size: 7,
        });
        lastPage.drawLine({
          start: { x: 25 + largeur, y: height - 172 - longueur },
          end: { x: 115 + largeur, y: height - 172 - longueur },
          thickness: 0.6,
          color: rgb(0, 0, 0),
        });
        i = i + 1;
        longueur = longueur + 12;
      } else {
        i = 1;
        largeur = largeur + 90;
        longueur = 0;
        lastPage.drawText(tarif.destination, {
          x: 30 + largeur,
          y: height - 169 - longueur,
          size: 7,
        });

        lastPage.drawText(tarif.zone.toString(), {
          x: 100 + largeur,
          y: height - 169 - longueur,
          size: 7,
        });
        lastPage.drawLine({
          start: { x: 25 + largeur, y: height - 172 - longueur },
          end: { x: 115 + largeur, y: height - 172 - longueur },
          thickness: 0.6,
          color: rgb(0, 0, 0),
        });
        longueur = longueur + 12;
        i = i + 1;
      }
    }

    const tarifParZone = await this.clientService.getTarifOfclientForClassic(
      client.communeDepart.wilaya.id,
      codeTarifId,
    );
    tarifParZone.sort((a, b) => (a.zone > b.zone ? 1 : -1));

    lastPage.drawRectangle({
      x: 75,
      y: height - 315,
      width: tarifParZone.length * 45,
      height: 15,
      borderColor: rgb(0, 0, 0),
      borderWidth: 0.6,
      color: rgb(1, 0, 0),
    });

    lastPage.drawRectangle({
      x: 25,
      y: height - 330,
      width: 50 + tarifParZone.length * 45,
      height: 15,
      borderColor: rgb(0, 0, 0),
      borderWidth: 0.6,
      color: rgb(1, 0, 0),
    });

    lastPage.drawRectangle({
      x: 25,
      y: height - 738,
      width: 50 + tarifParZone.length * 45,
      height: 408,
      borderColor: rgb(0, 0, 0),
      borderWidth: 0.6,
    });

    // -------------------- debut ligne verticale
    let ligneVertical = 0;
    let li = 1;
    let ligneLargeur = 0;

    // poids(kg)

    lastPage.drawText('Poids(Kg)', {
      x: 30,
      y: height - 325,
      size: 7,
      font: bold,
      color: rgb(1, 1, 1),
    });
    lastPage.drawLine({
      start: { x: 75 + ligneVertical, y: height - 315 },
      end: { x: 75 + ligneVertical, y: height - 738 },
      thickness: 0.6,
      color: rgb(0, 0, 0),
    });
    for await (const tarif of tarifParZone) {
      lastPage.drawText(`Zone ${tarif.zone}`, {
        x: 80 + ligneLargeur,
        y: height - 310,
        size: 7,
        font: bold,
        color: rgb(1, 1, 1),
      });
      lastPage.drawText('Livraison', {
        x: 80 + ligneLargeur,
        y: height - 325,
        size: 7,
        font: bold,
        color: rgb(1, 1, 1),
      });
      lastPage.drawLine({
        start: { x: 120 + ligneVertical, y: height - 300 },
        end: { x: 120 + ligneVertical, y: height - 738 },
        thickness: 0.6,
        color: rgb(0, 0, 0),
      });
      li = li + 1;
      ligneLargeur = ligneLargeur + 45;
      ligneVertical = ligneVertical + 45;
    }

    // --------------------fin ligne verticale

    // ----------------debut contenu classique---------------------

    let contenuLargeur = 0;
    let lineContenuHeight = 0;
    lastPage.drawText('0.5', {
      x: 30,
      y: height - 339,
      size: 8,
    });
    lastPage.drawLine({
      start: { x: 25, y: height - 342 },
      end: { x: 75, y: height - 342 },
      thickness: 0.6,
      color: rgb(0, 0, 0),
    });
    for (let i = 0; i <= 33; i++) {
      if (i <= 30) {
        if (i > 0) {
          lastPage.drawText(`${i}`, {
            x: 30,
            y: height - 339 - lineContenuHeight,
            size: 8,
          });
          lastPage.drawLine({
            start: { x: 25, y: height - 342 - lineContenuHeight },
            end: { x: 75, y: height - 342 - lineContenuHeight },
            thickness: 0.6,
            color: rgb(0, 0, 0),
          });
        }

        if (i <= 5) {
          for await (const tarif of tarifParZone) {
            lastPage.drawText(tarif.tarifLivraison.toFixed(2), {
              x: 80 + contenuLargeur,
              y: height - 339 - lineContenuHeight,
              size: 8,
            });

            lastPage.drawLine({
              start: {
                x: 75 + contenuLargeur,
                y: height - 342 - lineContenuHeight,
              },
              end: {
                x: 120 + contenuLargeur,
                y: height - 342 - lineContenuHeight,
              },
              thickness: 0.6,
              color: rgb(0, 0, 0),
            });

            contenuLargeur = contenuLargeur + 45;
          }
        } else {
          for await (const tarif of tarifParZone) {
            lastPage.drawText(
              (tarif.tarifLivraison + (i - 5) * tarif.tarifSurpoids).toFixed(2),
              {
                x: 80 + contenuLargeur,
                y: height - 339 - lineContenuHeight,
                size: 8,
              },
            );

            lastPage.drawLine({
              start: {
                x: 75 + contenuLargeur,
                y: height - 342 - lineContenuHeight,
              },
              end: {
                x: 120 + contenuLargeur,
                y: height - 342 - lineContenuHeight,
              },
              thickness: 0.6,
              color: rgb(0, 0, 0),
            });

            contenuLargeur = contenuLargeur + 45;
          }
        }
        contenuLargeur = 0;
        lineContenuHeight = lineContenuHeight + 12;
      } else if (i == 31) {
        lastPage.drawText(`31 à 60`, {
          x: 30,
          y: height - 339 - lineContenuHeight,
          size: 8,
          font: bold,
        });
        lastPage.drawLine({
          start: { x: 25, y: height - 342 - lineContenuHeight },
          end: { x: 75, y: height - 342 - lineContenuHeight },
          thickness: 0.6,
          color: rgb(0, 0, 0),
        });
        for await (const tarif of tarifParZone) {
          lastPage.drawText(
            (tarif.tarifLivraison + (45 - 5) * tarif.tarifSurpoids).toFixed(2),
            {
              x: 80 + contenuLargeur,
              y: height - 339 - lineContenuHeight,
              size: 8,
            },
          );

          lastPage.drawLine({
            start: {
              x: 75 + contenuLargeur,
              y: height - 342 - lineContenuHeight,
            },
            end: {
              x: 120 + contenuLargeur,
              y: height - 342 - lineContenuHeight,
            },
            thickness: 0.6,
            color: rgb(0, 0, 0),
          });

          contenuLargeur = contenuLargeur + 45;
        }
        contenuLargeur = 0;
        lineContenuHeight = lineContenuHeight + 12;
      } else if (i == 32) {
        lastPage.drawText(`61 à 100`, {
          x: 30,
          y: height - 339 - lineContenuHeight,
          size: 8,
          font: bold,
        });
        lastPage.drawLine({
          start: { x: 25, y: height - 342 - lineContenuHeight },
          end: { x: 75, y: height - 342 - lineContenuHeight },
          thickness: 0.6,
          color: rgb(0, 0, 0),
        });
        for await (const tarif of tarifParZone) {
          lastPage.drawText(
            (tarif.tarifLivraison + (80 - 5) * tarif.tarifSurpoids).toFixed(2),
            {
              x: 80 + contenuLargeur,
              y: height - 339 - lineContenuHeight,
              size: 8,
            },
          );

          lastPage.drawLine({
            start: {
              x: 75 + contenuLargeur,
              y: height - 342 - lineContenuHeight,
            },
            end: {
              x: 120 + contenuLargeur,
              y: height - 342 - lineContenuHeight,
            },
            thickness: 0.6,
            color: rgb(0, 0, 0),
          });

          contenuLargeur = contenuLargeur + 45;
        }
        contenuLargeur = 0;
        lineContenuHeight = lineContenuHeight + 12;
      } else {
        lastPage.drawText(`101 à 150`, {
          x: 30,
          y: height - 339 - lineContenuHeight,
          size: 8,
          font: bold,
        });
        lastPage.drawLine({
          start: { x: 25, y: height - 342 - lineContenuHeight },
          end: { x: 75, y: height - 342 - lineContenuHeight },
          thickness: 0.6,
          color: rgb(0, 0, 0),
        });
        for await (const tarif of tarifParZone) {
          lastPage.drawText(
            (tarif.tarifLivraison + (125 - 5) * tarif.tarifSurpoids).toFixed(2),
            {
              x: 80 + contenuLargeur,
              y: height - 339 - lineContenuHeight,
              size: 8,
            },
          );

          lastPage.drawLine({
            start: {
              x: 75 + contenuLargeur,
              y: height - 342 - lineContenuHeight,
            },
            end: {
              x: 120 + contenuLargeur,
              y: height - 342 - lineContenuHeight,
            },
            thickness: 0.6,
            color: rgb(0, 0, 0),
          });

          contenuLargeur = contenuLargeur + 45;
        }
        contenuLargeur = 0;
        lineContenuHeight = lineContenuHeight + 12;
      }
    }

    // ----------------fin contenu classique---------------------

    return pdfDoc;
  }

  async templateConventionExpressOREconomy(client, service, codeTarifId) {
    let conventionTemplatePath;
    if (
      service == 'E-Commerce Express Divers' ||
      service == 'E-Commerce Express Entreprise'
    ) {
      conventionTemplatePath = 'src/assets/convention/expressFr.pdf';
    } else if (
      service == 'E-Commerce Economy Divers' ||
      service == 'E-Commerce Economy Entreprise'
    ) {
      conventionTemplatePath = 'src/assets/convention/economiqueFr.pdf';
    }
    const pdfTemplateBytes = fs.readFileSync(conventionTemplatePath);
    const dest = 'src/testpdf/convention.pdf';
    const pdfDoc = await PDFDocument.load(pdfTemplateBytes);
    const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    // Embed the Helvetica font
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const normal = await pdfDoc.embedFont(StandardFonts.Helvetica);

    // Get the first page of the document
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];
    const secondPage = pages[1];
    const lastPage = pages[pages.length - 1];

    const { width, height } = firstPage.getSize();

    firstPage.drawText(service, {
      x: 200,
      y: height - 200,
      size: 15,
    });
    // code de client et agence d'ouverture
    firstPage.drawText(client.numClient, {
      x: 135,
      y: height - 230,
      size: 11,
    });

    // date d'ouverture de compte
    let month = '' + (client.createdAt.getMonth() + 1);
    let day = '' + client.createdAt.getDate();
    const year = client.createdAt.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    const date = [day, month, year].join('-');

    firstPage.drawText(date, {
      x: 150,
      y: height - 253.6,
      size: 11,
    });

    // informations de client
    firstPage.drawText(client.raisonSociale, {
      x: 83,
      y: height - 307,
      size: 11,
    });
    firstPage.drawText(client.nomCommercial, {
      x: 107,
      y: height - 330,
      size: 11,
    });
    firstPage.drawText(client.adresse, {
      x: 60,
      y: height - 353.5,
      size: 11,
    });
    firstPage.drawText(client.communeResidence.codePostal, {
      x: 72,
      y: height - 377,
      size: 11,
    });
    firstPage.drawText(client.communeResidence.nomLatin, {
      x: 228,
      y: height - 377,
      size: 11,
    });
    firstPage.drawText(client.communeResidence.wilaya.nomLatin, {
      x: 368,
      y: height - 377,
      size: 11,
    });
    firstPage.drawText(client.nrc, {
      x: 175,
      y: height - 399.5,
      size: 11,
    });
    firstPage.drawText(client.nif, {
      x: 410,
      y: height - 399.5,
      size: 11,
    });
    firstPage.drawText(client.nomGerant + ' ' + client.prenomGerant, {
      x: 93,
      y: height - 422.5,
      size: 11,
    });
    firstPage.drawText(client.telephone, {
      x: 390,
      y: height - 422.5,
      size: 11,
    });
    firstPage.drawText(client.user.email, {
      x: 78,
      y: height - 445.5,
      size: 11,
    });

    // condition de paiement
    if (client.moyenPayement == 'espece') {
      firstPage.drawText('X', {
        x: 249,
        y: height - 497.5,
        size: 11,
      });
    } else if (client.moyenPayement == 'cheque') {
      firstPage.drawText('X', {
        x: 380,
        y: height - 497.5,
        size: 11,
      });
    } else {
      firstPage.drawText('X', {
        x: 516,
        y: height - 497.5,
        size: 11,
      });
    }

    // jours de paiement
    for (const jour of client.jourPayement) {
      if (jour == 'Dimanche') {
        firstPage.drawText('X', {
          x: 114,
          y: height - 549.5,
          size: 11,
        });
      }
      if (jour == 'Lundi') {
        firstPage.drawText('X', {
          x: 208,
          y: height - 549.5,
          size: 11,
        });
      }
      if (jour == 'Mardi') {
        firstPage.drawText('X', {
          x: 307,
          y: height - 549.5,
          size: 11,
        });
      }
      if (jour == 'Mercredi') {
        firstPage.drawText('X', {
          x: 417,
          y: height - 549.5,
          size: 11,
        });
      }

      if (jour == 'Jeudi') {
        firstPage.drawText('X', {
          x: 515,
          y: height - 549.5,
          size: 11,
        });
      }
    }

    // Engagement
    firstPage.drawText(client.nbEnvoiMin.toString(), {
      x: 235,
      y: height - 602.5,
      size: 11,
    });
    firstPage.drawText(client.nbEnvoiMax.toString(), {
      x: 327,
      y: height - 602.5,
      size: 11,
    });

    //pour le client
    firstPage.drawText(client.nomGerant + ' ' + client.prenomGerant, {
      x: 430,
      y: height - 749.5,
      size: 10,
    });

    const tarifClient = await this.clientService.getTarifOfclient(
      client.communeDepart.wilaya.id,
      codeTarifId,
    );
    console.log("🚀 ~ file: pdf.service.ts ~ line 2389 ~ PdfService ~ templateConventionExpressOREconomy ~ tarifClient", tarifClient)

    tarifClient.sort((a, b) => (a.zone > b.zone ? 1 : -1));

    let hauteur = 0;
    let rectangleStart = 165;
    let lineStart = 150;

    lastPage.drawText(service, {
      x: 230,
      y: height - 94.5,
      size: 12,
      color: rgb(1, 0, 0),
    });

    lastPage.drawText(
      client.nomGerant.toUpperCase() + ' ' + client.prenomGerant.toUpperCase(),
      {
        x: 57,
        y: height - 121.8,
        size: 9,
      },
    );
    lastPage.drawText(client.communeDepart.wilaya.nomLatin.toUpperCase(), {
      x: 60,
      y: height - 139,
      size: 9,
    });

    //--------------------------------------------------- debut header----------------------
    lastPage.drawRectangle({
      x: 28,
      y: height - rectangleStart,
      width: 500,
      height: 15,
      borderColor: rgb(0, 0, 0),
      borderWidth: 0.6,
      color: rgb(1, 0, 0),
    });

    // -------------destination------------
    lastPage.drawText(`Destination`, {
      x: 31,
      y: height - rectangleStart + 5,
      size: 8.7,
      color: rgb(1, 1, 1),
      font: bold,
    });

    // -------------zone------------
    lastPage.drawLine({
      start: { x: 110, y: height - lineStart },
      end: { x: 110, y: height - rectangleStart },
      thickness: 0.7,
      color: rgb(0, 0, 0),
    });
    lastPage.drawText(`Zone`, {
      x: 113,
      y: height - rectangleStart + 5,
      size: 8.7,
      color: rgb(1, 1, 1),
      font: bold,
    });

    // -------------tarifLivraison------------
    lastPage.drawLine({
      start: { x: 188 - 20, y: height - lineStart },
      end: { x: 188 - 20, y: height - rectangleStart },
      thickness: 0.7,
      color: rgb(0, 0, 0),
    });
    lastPage.drawText(`Tarif Livraison`, {
      x: 191 - 20,
      y: height - rectangleStart + 5,
      size: 8.7,
      color: rgb(1, 1, 1),
      font: bold,
    });

    // ------------Tarif Stop Desk-------------
    lastPage.drawLine({
      start: { x: 312 - 20, y: height - lineStart },
      end: { x: 312 - 20, y: height - rectangleStart },
      thickness: 0.7,
      color: rgb(0, 0, 0),
    });
    lastPage.drawText(`Tarif Stop Desk`, {
      x: 315 - 20,
      y: height - rectangleStart + 5,
      size: 8.7,
      color: rgb(1, 1, 1),
      font: bold,
    });

    // ------------Tarif Retour-------------
    lastPage.drawLine({
      start: { x: 423 - 20, y: height - lineStart },
      end: { x: 423 - 20, y: height - rectangleStart },
      thickness: 0.7,
      color: rgb(0, 0, 0),
    });
    lastPage.drawText(`Tarif Retour`, {
      x: 426 - 20,
      y: height - rectangleStart + 5,
      size: 8.7,
      color: rgb(1, 1, 1),
      font: bold,
    });

    // ------------Tarif surpoids-------------
    lastPage.drawLine({
      start: { x: 485 - 20, y: height - lineStart },
      end: { x: 485 - 20, y: height - rectangleStart },
      thickness: 0.7,
      color: rgb(0, 0, 0),
    });
    lastPage.drawText(`Tarif Surpoids`, {
      x: 487 - 20,
      y: height - rectangleStart + 5,
      size: 8.7,
      color: rgb(1, 1, 1),
      font: bold,
    });

    //--------------------------------------------------- fin header----------------------

    //--------------------------------------------------- debut contenu table----------------------

    for await (const tarif of tarifClient) {
      const codeTarifZoneConv =
        await this.codeTarifsZonesService.findCodeTarifZone(
          tarif.zone,
          codeTarifId,
          2,
        );
      const surpoidsConventionne =
        await this.shipmentService.calculeSurpoidsConvention(
          client.poidsBase,
          client.poidsBase,
          codeTarifZoneConv.codeTarifZone_tarifPoidsParKg,
        );

      rectangleStart = rectangleStart + 12;
      lineStart = lineStart + 12;
      lastPage.drawRectangle({
        x: 28,
        y: height - rectangleStart,
        width: 500,
        height: 12,
        borderColor: rgb(0, 0, 0),
        borderWidth: 0.6,
      });

      // ------------destination-----------

      lastPage.drawText(tarif.destination, {
        x: 31,
        y: height - rectangleStart + 4,
        size: 8,
        font: normal,
      });

      // ------------zone----------
      lastPage.drawLine({
        start: { x: 110, y: height - lineStart },
        end: { x: 110, y: height - rectangleStart },
        thickness: 0.7,
        color: rgb(0, 0, 0),
      });
      lastPage.drawText(tarif.zone.toString(), {
        x: 112,
        y: height - rectangleStart + 4,
        size: 8,
        font: normal,
      });

      // ------------tarifLivraison----------
      lastPage.drawLine({
        start: { x: 188 - 20, y: height - lineStart },
        end: { x: 188 - 20, y: height - rectangleStart },
        thickness: 0.7,
        color: rgb(0, 0, 0),
      });

      lastPage.drawText(tarif.tarifLivraison.toFixed(2), {
        x: 190 - 20,
        y: height - rectangleStart + 4,
        size: 8,
        font: normal,
      });

      // -----------tarifStopDesk------------
      lastPage.drawLine({
        start: { x: 312 - 20, y: height - lineStart },
        end: { x: 312 - 20, y: height - rectangleStart },
        thickness: 0.7,
        color: rgb(0, 0, 0),
      });
      const tarifStopDesk =
        tarif.tarifStopDesk +
        surpoidsConventionne -
        (client.poidsBase * codeTarifZoneConv.codeTarifZone_tarifPoidsParKg) /
          5;
      if (client.poidsBase > 30) {
        lastPage.drawText(tarifStopDesk.toFixed(2), {
          x: 315 - 20,
          y: height - rectangleStart + 4,
          size: 8,
          font: normal,
        });
      } else {
        lastPage.drawText(tarif.tarifStopDesk.toFixed(2), {
          x: 315 - 20,
          y: height - rectangleStart + 4,
          size: 8,
          font: normal,
        });
      }

      // -----------tarifRetour----------
      lastPage.drawLine({
        start: { x: 423 - 20, y: height - lineStart },
        end: { x: 423 - 20, y: height - rectangleStart },
        thickness: 0.7,
        color: rgb(0, 0, 0),
      });
      lastPage.drawText(client.tarifRetour.toFixed(2), {
        x: 425.5 - 20,
        y: height - rectangleStart + 4,
        size: 8,
        font: normal,
      });

      // ------------Tarif surpoids-------------
      lastPage.drawLine({
        start: { x: 485 - 20, y: height - lineStart },
        end: { x: 485 - 20, y: height - rectangleStart },
        thickness: 0.7,
        color: rgb(0, 0, 0),
      });
      lastPage.drawText(tarif.tarifSurpoids.toFixed(2), {
        x: 487 - 20,
        y: height - rectangleStart + 4,
        size: 8,
        font: normal,
      });
    }
    //--------------------------------------------------- fin contenu table----------------------
    //RETURN BUFFER

    return pdfDoc;
  }
  //
  async printBordereauModel(
    infoPackageSlip,
    infoClient,
    tarifLivraison,
    recouvrement,
    datePresExpedition,
  ) {
    let brd = null;

    const brdI = await this.generatePackageSlip(
      infoPackageSlip,
      infoClient,
      tarifLivraison,
      recouvrement,
      datePresExpedition,
    );
    console.log(
      'aaaaaaaaaaaaaaaaaaaaaaaaainfoPackageSlip.shipment_echange',
      infoPackageSlip.shipment_echange,
    );
    const pdfBytes = await brdI.save();
    if (infoPackageSlip.shipment_echange == false) {
      console.log('qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq');
      fs.writeFileSync('dest', pdfBytes);
      return pdfBytes;
    } else {
      const brdII = await this.generatePackageSlip(
        infoPackageSlip,
        infoClient,
        tarifLivraison,
        recouvrement,
        datePresExpedition,
        'ECH',
      );

      brd = brdII;
      const allBRD = await brd.copyPages(brdI, [0]);
      brd.addPage(allBRD[0]);
      const pdfBytes = await brd.save();
      fs.writeFileSync('dest', pdfBytes);
      return pdfBytes;
    }
  }
  //
  async printConvention(client) {
    console.log("🚀 ~ file: pdf.service.ts ~ line 2726 ~ PdfService ~ printConvention ~ client", client)
    let test = null;
    for await (const clt of client.clientsTarifs) {
      console.log(clt.codeTarif.service.nom);
      if (
        clt.codeTarif.service.nom === 'E-Commerce Express Divers' ||
        clt.codeTarif.service.nom === 'E-Commerce Express Entreprise' ||
        clt.codeTarif.service.nom === 'E-Commerce Economy Entreprise' ||
        clt.codeTarif.service.nom === 'E-Commerce Economy Divers'
      ) {
        const serviceI = await this.templateConventionExpressOREconomy(
          client,
          clt.codeTarif.service.nom,
          clt.codeTarifId,
        );
        const pdfBytes = await serviceI.save();
        if (test == null) {
          fs.writeFileSync('dest', pdfBytes);
          test = serviceI;
        } else {
          console.log('ghiles');
          const service = await test.copyPages(serviceI, [0, 1, 2]);
          test.addPage(service[0]);
          test.addPage(service[1]);
          test.addPage(service[2]);
          const pdfBytes = await test.save();
          fs.writeFileSync('dest', pdfBytes);
        }
      } else if (
        clt.codeTarif.service.nom === 'Classique Entreprise' ||
        clt.codeTarif.service.nom === 'Fret'
      ) {
        const serviceI = await this.templateConventionFretORClassic(
          client,
          clt.codeTarif.service.nom,
          clt.codeTarifId,
        );
        const pdfBytes = await serviceI.save();
        if (test == null) {
          fs.writeFileSync('dest', pdfBytes);
          test = serviceI;
        } else {
          const service = await test.copyPages(serviceI, [0, 1, 2]);
          test.addPage(service[0]);
          test.addPage(service[1]);
          test.addPage(service[2]);
          const pdfBytes = await test.save();
          fs.writeFileSync('dest', pdfBytes);
        }
      }
    }
    // console.log(test);
    const pdfBytes = await test.save();
    fs.writeFileSync('dest', pdfBytes);
    return pdfBytes;
  }

  // async generateConventionFR(client: Client, zones: Zone[], tarifs: Tarif) {
  //   const conventionTemplatePath = 'src/assets/conventionFR.pdf';
  //   const pdfTemplateBytes = fs.readFileSync(conventionTemplatePath);
  //   const dest = 'src/testpdf/convention.pdf';
  //   const pdfDoc = await PDFDocument.load(pdfTemplateBytes);

  //   // Embed the Helvetica font
  //   const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

  //   // Get the first page of the document
  //   const pages = pdfDoc.getPages();
  //   const firstPage = pages[0];
  //   const lastPage = pages[pages.length - 1];

  //   const { width, height } = firstPage.getSize();

  //   //Remplissage des cellules infoPackageSliprmations client

  //   firstPage.drawText(client.codeClient, { x: 131, y: height - 230, size: 8 });
  //   firstPage.drawText(client.createdAt.toISOString().split('T')[0], {
  //     x: 144.7,
  //     y: height - 253.4,
  //     size: 8,
  //   });
  //   firstPage.drawText(client.raisonSociale, {
  //     x: 88.1,
  //     y: height - 307.4,
  //     size: 8,
  //   });
  //   firstPage.drawText(client.nomCommercial, {
  //     x: 108.2,
  //     y: height - 330.5,
  //     size: 8,
  //   });
  //   firstPage.drawText(client.adresse, { x: 64, y: height - 352.8, size: 8 });
  //   firstPage.drawText(client.commune.codePostal, {
  //     x: 77,
  //     y: height - 376.6,
  //     size: 8,
  //   });
  //   firstPage.drawText(client.commune.nomLatin, {
  //     x: 228,
  //     y: height - 376.6,
  //     size: 8,
  //   });
  //   firstPage.drawText(client.wilaya.nomLatin, {
  //     x: 369,
  //     y: height - 376.6,
  //     size: 8,
  //   });
  //   firstPage.drawText(client.telephone, {
  //     x: 389.5,
  //     y: height - 421.9,
  //     size: 8,
  //   });
  //   firstPage.drawText(client.mail, { x: 82.1, y: height - 445.7, size: 8 });
  //   firstPage.drawText(client.nRC, { x: 170.7, y: height - 399.6, size: 8 });
  //   firstPage.drawText(client.nNIF, { x: 409, y: height - 399.6, size: 8 });
  //   firstPage.drawText(client.nomGerant, {
  //     x: 98.6,
  //     y: height - 421.9,
  //     size: 8,
  //   });

  //   //remplissage des cellules conditions de paiement
  //   const mp: string = client.moyenPayment;
  //   let text = 'X';
  //   let textSize = 10;
  //   let textWidth = helveticaFont.widthOfTextAtSize(text, textSize);
  //   let textHeight = helveticaFont.heightAtSize(textSize);

  //   if (mp === 'Espèce') {
  //     firstPage.drawText(text, {
  //       x: 252.7 - textWidth / 2,
  //       y: height - 493.2 - textHeight / 2,
  //       size: textSize,
  //     });
  //   } else if (mp === 'Chèque') {
  //     firstPage.drawText(text, {
  //       x: 383.8 - textWidth / 2,
  //       y: height - 493.2 - textHeight / 2,
  //       size: textSize,
  //     });
  //   } else {
  //     firstPage.drawText(text, {
  //       x: 520.6 - textWidth / 2,
  //       y: height - 493.2 - textHeight / 2,
  //       size: textSize,
  //     });
  //   }

  //   //remplissage dse cellules jour de paiement
  //   const jp: string = client.jourPayement;
  //   if (jp === 'Dimanche') {
  //     firstPage.drawText(text, {
  //       x: 115.2 - textWidth / 2,
  //       y: height - 545 - textHeight / 2,
  //       size: textSize,
  //     });
  //   } else if (jp === 'Lundi') {
  //     firstPage.drawText(text, {
  //       x: 211 - textWidth / 2,
  //       y: height - 545 - textHeight / 2,
  //       size: textSize,
  //     });
  //   } else if (jp === 'Mardi') {
  //     firstPage.drawText(text, {
  //       x: 311 - textWidth / 2,
  //       y: height - 545 - textHeight / 2,
  //       size: textSize,
  //     });
  //   } else if (jp === 'Mercredi') {
  //     firstPage.drawText(text, {
  //       x: 421.2 - textWidth / 2,
  //       y: height - 545 - textHeight / 2,
  //       size: textSize,
  //     });
  //   } else {
  //     firstPage.drawText(text, {
  //       x: 519.1 - textWidth / 2,
  //       y: height - 545 - textHeight / 2,
  //       size: textSize,
  //     });
  //   }

  //   //Remplissage des cellules engagement
  //   text = client.nbEnvoiMin.toString();
  //   textSize = 10;
  //   textWidth = helveticaFont.widthOfTextAtSize(text, textSize);
  //   textHeight = helveticaFont.heightAtSize(textSize);

  //   firstPage.drawText(text, {
  //     x: 240.5 - textWidth / 2,
  //     y: height - 598.3 - textHeight / 2,
  //     size: textSize,
  //   });

  //   text = client.nbEnvoiMax.toString();
  //   textSize = 10;
  //   textWidth = helveticaFont.widthOfTextAtSize(text, textSize);
  //   textHeight = helveticaFont.heightAtSize(textSize);

  //   firstPage.drawText(text, {
  //     x: 333.5 - textWidth / 2,
  //     y: height - 598.3 - textHeight / 2,
  //     size: textSize,
  //   });

  //   //Remplissage signature
  //   firstPage.drawText('Nom du commercial', {
  //     x: 103,
  //     y: height - 749.5,
  //     size: 8,
  //   });
  //   firstPage.drawText(client.nomGerant, {
  //     x: 433.4,
  //     y: height - 748.8,
  //     size: 8,
  //   });

  //   //remplissage tarif
  //   zones.sort((a, b) => (a.zone < b.zone ? -1 : 1));

  //   const retour = client.tarifRetour;

  //   text = client.wilayaDepart.nomLatin;
  //   textSize = 9;
  //   textWidth = helveticaFont.widthOfTextAtSize(text, textSize);
  //   textHeight = helveticaFont.heightAtSize(textSize);

  //   lastPage.drawText(text, {
  //     x: 78.5 - textWidth / 2,
  //     y: height - 456.5 - textHeight / 2,
  //     size: textSize,
  //   });
  //   let d = 0;
  //   zones.forEach((z) => {
  //     lastPage.drawText(z.destination, {
  //       x: 133.9,
  //       y: height - 157 - d,
  //       size: 9,
  //     });

  //     text = z.zone.toString();
  //     textSize = 9;
  //     textWidth = helveticaFont.widthOfTextAtSize(text, textSize);
  //     textHeight = helveticaFont.heightAtSize(textSize);
  //     lastPage.drawText(text, {
  //       x: 226.8 - textWidth / 2,
  //       y: height - 154.1 - d - textHeight / 2,
  //       size: textSize,
  //     });

  //     text = z.delaiExpress.toString();
  //     textSize = 9;
  //     textWidth = helveticaFont.widthOfTextAtSize(text, textSize);
  //     textHeight = helveticaFont.heightAtSize(textSize);
  //     lastPage.drawText(text, {
  //       x: 258.5 - textWidth / 2,
  //       y: height - 154.1 - d - textHeight / 2,
  //       size: textSize,
  //     });

  //     text = tarifs['livZone' + z.zone].toString();
  //     textSize = 9;
  //     textWidth = helveticaFont.widthOfTextAtSize(text, textSize);
  //     textHeight = helveticaFont.heightAtSize(textSize);
  //     lastPage.drawText(text, {
  //       x: 319 - textWidth / 2,
  //       y: height - 154.1 - d - textHeight / 2,
  //       size: textSize,
  //     });

  //     text = tarifs['stopZone' + z.zone].toString();
  //     textSize = 9;
  //     textWidth = helveticaFont.widthOfTextAtSize(text, textSize);
  //     textHeight = helveticaFont.heightAtSize(textSize);
  //     lastPage.drawText(text, {
  //       x: 411.1 - textWidth / 2,
  //       y: height - 154.1 - d - textHeight / 2,
  //       size: textSize,
  //     });

  //     text = retour.toString();
  //     textSize = 9;
  //     textWidth = helveticaFont.widthOfTextAtSize(text, textSize);
  //     textHeight = helveticaFont.heightAtSize(textSize);
  //     lastPage.drawText(text, {
  //       x: 532.1 - textWidth,
  //       y: height - 154.1 - d - textHeight / 2,
  //       size: textSize,
  //     });

  //     d += 10.55;
  //   });

  //   const pdfBytes = await pdfDoc.save();
  //   fs.writeFileSync(dest, pdfBytes);
  //   return pdfBytes;
  // }

  /**
   *
   *
   *
   *
   *
   *
   */

  async printSac(sac, trackings) {
    const tracking = trackings.join(' ');
    const dateSac = await this.formatDate(sac.sacShipment_createdAt);
    let packageSlipTemplatePath;
    if (
      sac.sac_typeSac == SacTypeEnum.transfertRetour ||
      sac.sac_typeSac == SacTypeEnum.retourVersVendeur ||
      sac.sac_typeSac == SacTypeEnum.retourVersWilaya ||
      sac.sac_typeSac == SacTypeEnum.retourVersAgence
    ) {
      packageSlipTemplatePath = 'src/assets/sacTrackingRetour.pdf';
    } else {
      packageSlipTemplatePath = 'src/assets/sacTracking.pdf';
    }
    const pdfTemplateBytes = fs.readFileSync(packageSlipTemplatePath);
    const pdfDoc = await PDFDocument.load(pdfTemplateBytes);

    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

    const pages = pdfDoc.getPages();
    const firstPage = pages[0];
    const { width, height } = firstPage.getSize();

    firstPage.drawText(sac.sac_typeSac, {
      x: 20,
      y: height - 75,
      size: 9,
    });

    // firstPage.drawText(sac.sac_id.toString(), {
    //   x: 110,
    //   y: height - 33,
    //   size: 13,
    // });

    firstPage.drawText('Le ' + dateSac.toString(), {
      x: 20,
      y: height - 138,
      size: 11,
    });

    firstPage.drawText(trackings.length.toString() + ')', {
      x: 330,
      y: height - 195,
      size: 20,
    });

    // firstPage.drawText(
    //   sac.wilaya_depart_nomLatin +
    //     ' (' +
    //     sac.commune_nomLatin +
    //     ') ' +
    //     ' > ' +
    //     sac.wilaya_nomLatin,
    //   {
    //     x: 62,
    //     y: height - 86,
    //     size: 14,
    //   },
    // );
    if (
      sac.sac_typeSac !== SacTypeEnum.retourVersWilaya &&
      sac.sac_typeSac !== SacTypeEnum.versWilaya
    ) {
      firstPage.drawText(
        'De: ' +
          sac.wilaya_depart_nomLatin.toUpperCase() +
          ' (' +
          sac.commune_nomLatin.toUpperCase() +
          ') ',
        {
          x: 20,
          y: height - 96,
          size: 12,
        },
      );
      firstPage.drawText(
        'Vers: ' +
          sac.stationDestination_nom.toUpperCase() +
          '(' +
          sac.communeDestination_codePostal +
          ')',
        {
          x: 20,
          y: height - 120,
          size: 12,
        },
      );
    } else {
      firstPage.drawText(
        'De: ' +
          sac.wilaya_depart_nomLatin.toUpperCase() +
          ' (' +
          sac.commune_nomLatin.toUpperCase() +
          ') ',
        {
          x: 20,
          y: height - 96,
          size: 12,
        },
      );
      firstPage.drawText('Vers: ' + sac.wilaya_nomLatin.toUpperCase(), {
        x: 20,
        y: height - 120,
        size: 12,
      });
    }
    //CODE BARRE
    const barcodeBuffer = await bwipjs.toBuffer({
      bcid: 'code128', // Barcode type
      text: sac.sac_tracking, // Text to encode
      scale: 3, // 3x scaling factor
      height: 12, // Bar height, in millimeters
      paddingheight: 2,
      includetext: true, // Show human-readable text
      textxalign: 'center', // Always good to set this
    });

    const barcodeImage = await pdfDoc.embedPng(barcodeBuffer);
    const barcodeDims = barcodeImage.scaleToFit(230, 85);

    firstPage.drawImage(barcodeImage, {
      x: 450 - barcodeDims.width / 2,
      y: height - 70 - barcodeDims.height / 2,
      width: barcodeDims.width,
      height: barcodeDims.height,
    });

    const qrcodeBuffer = await QRCode.toBuffer(tracking);
    const qrcodeImage = await pdfDoc.embedPng(qrcodeBuffer);
    const qrcodeDims = qrcodeImage.scaleToFit(200, 200);

    firstPage.drawImage(qrcodeImage, {
      x: 310 - qrcodeDims.width / 2,
      y: height - 300 - qrcodeDims.height / 2,
      width: qrcodeDims.width,
      height: qrcodeDims.height,
    });

    const pdfBytes = await pdfDoc.save();

    fs.writeFileSync('dest', pdfBytes);
    return pdfBytes;
  }
  // date format
  async formatDate(date) {
    console.log(
      '🚀 ~ file: pdf.service.ts ~ line 970 ~ PdfService ~ formatDate ~ date',
      date,
    );
    const dateFormat =
      date.getDate() +
      '/' +
      (date.getMonth() + 1) +
      '/' +
      date.getFullYear() +
      '-' +
      +date.getHours() +
      ':' +
      date.getMinutes();
    console.log(dateFormat);
    return dateFormat;
  }

  async printRecolteManifest(recolte, trackings, userInfo, montant) {
    const tracking = trackings.join(' ');
    const dateRecolte = await this.formatDate(recolte.createdAt);

    const packageSlipTemplatePath = 'src/assets/recolteModelManifest.pdf';
    const pdfTemplateBytes = fs.readFileSync(packageSlipTemplatePath);
    const pdfDoc = await PDFDocument.load(pdfTemplateBytes);

    const helveticaFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const pages = pdfDoc.getPages();
    const firstPage = pages[0];
    const { width, height } = firstPage.getSize();
    console.log(userInfo);
    firstPage.drawText(
      userInfo.agence.nom.toUpperCase() +
        '-' +
        userInfo.agence.commune.nomLatin.toUpperCase() +
        '/' +
        userInfo.agence.commune.wilaya.nomLatin.toUpperCase(),
      {
        x: 30,
        y: height - 65,
        size: 10,
      },
    );

    firstPage.drawText(
      userInfo.nom.toUpperCase() +
        ' ' +
        userInfo.prenom.toUpperCase() +
        ' ' +
        userInfo.numTelephone,
      {
        x: 30,
        y: height - 80,
        size: 11,
      },
    );
    if (recolte.recolteCoursier == null) {
      firstPage.drawText('DESK', {
        x: 30,
        y: height - 115,
        size: 15,
      });
    }
    firstPage.drawText('Le ' + dateRecolte, {
      x: 30,
      y: height - 95,
      size: 11,
    });
    console.log('3');

    firstPage.drawText(
      trackings.length.toString().toString() +
        ' Colis ( ' +
        montant.toString() +
        'DA )',
      {
        x: 205,
        y: height - 200,
        size: 23,
        font: helveticaFont,
      },
    );
    // console.log('4');

    //CODE BARRE
    const barcodeBuffer = await bwipjs.toBuffer({
      bcid: 'code128', // Barcode type
      text: recolte.tracking, // Text to encode
      scale: 3, // 3x scaling factor
      height: 16, // Bar height, in millimeters
      paddingheight: 0,
      includetext: true, // Show human-readable text
      textxalign: 'center', // Always good to set this
    });

    const barcodeImage = await pdfDoc.embedPng(barcodeBuffer);
    const barcodeDims = barcodeImage.scaleToFit(180, 110);

    firstPage.drawImage(barcodeImage, {
      x: 490 - barcodeDims.width / 2,
      y: height - 70 - barcodeDims.height / 2,
      width: barcodeDims.width,
      height: barcodeDims.height,
    });
    const qrcodeBuffer = await QRCode.toBuffer(tracking);
    const qrcodeImage = await pdfDoc.embedPng(qrcodeBuffer);
    const qrcodeDims = qrcodeImage.scaleToFit(200, 200);

    firstPage.drawImage(qrcodeImage, {
      x: 290 - qrcodeDims.width / 2,
      y: height - 320 - qrcodeDims.height / 2,
      width: qrcodeDims.width,
      height: qrcodeDims.height,
    });

    const pdfBytes = await pdfDoc.save();
    console.log('5');
    fs.writeFileSync('dest', pdfBytes);
    return pdfBytes;
  }

  async printRecolteCsManifest(recolte: Recolte, trackings, userInfo: User, montant) {
    console.log("🚀 ~ file: pdf.service.ts ~ line 2321 ~ PdfService ~ printRecolteManifest ~ userInfo", userInfo)
    const tracking = trackings.join(' ');
    const dateRecolte = await this.formatDate(recolte.createdAt);
    console.log("🚀 ~ file: pdf.service.ts ~ line 2431 ~ PdfService ~ printRecolteCsManifest ~ dateRecolte", dateRecolte)

    const packageSlipTemplatePath = 'src/assets/recolteModelManifest.pdf';
    const pdfTemplateBytes = fs.readFileSync(packageSlipTemplatePath);
    const pdfDoc = await PDFDocument.load(pdfTemplateBytes);

    const helveticaFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const pages = pdfDoc.getPages();
    const firstPage = pages[0];
    const { width, height } = firstPage.getSize();
    console.log(userInfo);
    firstPage.drawText(
      userInfo.employe.agence.nom.toUpperCase() +
        '-' +
        userInfo.employe.agence.commune.nomLatin.toUpperCase() +
        '/' +
        userInfo.employe.agence.commune.wilaya.nomLatin.toUpperCase(),
      {
        x: 30,
        y: height - 65,
        size: 10,
      },
    );

    firstPage.drawText(
      userInfo.employe.nom.toUpperCase() +
        ' ' +
        userInfo.employe.prenom.toUpperCase() +
        ' ' +
        userInfo.employe.numTelephone,
      {
        x: 30,
        y: height - 80,
        size: 11,
      },
    );
    if (recolte.recolteCS != null) {
      firstPage.drawText('SERVICE CLIENTELE', {
        x: 30,
        y: height - 115,
        size: 15,
      });
    }
    firstPage.drawText('Le ' + dateRecolte, {
      x: 30,
      y: height - 95,
      size: 11,
    });
    console.log('3');

    firstPage.drawText(
      trackings.length.toString().toString() +
        ' Colis ( ' +
        montant.toString() +
        'DA )',
      {
        x: 205,
        y: height - 200,
        size: 23,
        font: helveticaFont,
      },
    );
    // console.log('4');

    //CODE BARRE
    const barcodeBuffer = await bwipjs.toBuffer({
      bcid: 'code128', // Barcode type
      text: recolte.tracking, // Text to encode
      scale: 3, // 3x scaling factor
      height: 16, // Bar height, in millimeters
      paddingheight: 0,
      includetext: true, // Show human-readable text
      textxalign: 'center', // Always good to set this
    });

    const barcodeImage = await pdfDoc.embedPng(barcodeBuffer);
    const barcodeDims = barcodeImage.scaleToFit(180, 110);

    firstPage.drawImage(barcodeImage, {
      x: 490 - barcodeDims.width / 2,
      y: height - 70 - barcodeDims.height / 2,
      width: barcodeDims.width,
      height: barcodeDims.height,
    });
    const qrcodeBuffer = await QRCode.toBuffer(tracking);
    const qrcodeImage = await pdfDoc.embedPng(qrcodeBuffer);
    const qrcodeDims = qrcodeImage.scaleToFit(200, 200);

    firstPage.drawImage(qrcodeImage, {
      x: 290 - qrcodeDims.width / 2,
      y: height - 320 - qrcodeDims.height / 2,
      width: qrcodeDims.width,
      height: qrcodeDims.height,
    });

    const pdfBytes = await pdfDoc.save();
    console.log('5');
    fs.writeFileSync('dest', pdfBytes);
    return pdfBytes;
  }

  async printSacVersVendeur(sac, trackings, clientInfo) {
    const tracking = trackings.join(' ');
    const dateSac = await this.formatDate(sac.sacShipment_createdAt);
    const packageSlipTemplatePath = 'src/assets/sacTrackingVersVendeur.pdf';
    const pdfTemplateBytes = fs.readFileSync(packageSlipTemplatePath);
    const pdfDoc = await PDFDocument.load(pdfTemplateBytes);

    // Embed the Helvetica font
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

    // Get the first page of the document
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];

    const { width, height } = firstPage.getSize();
    firstPage.drawText(sac.sac_typeSac, {
      x: 20,
      y: height - 75,
      size: 9,
    });

    // firstPage.drawText(sac.sac_id.toString(), {
    //   x: 110,
    //   y: height - 33,
    //   size: 13,
    // });
    firstPage.drawText('Le' + dateSac.toString(), {
      x: 20,
      y: height - 135,
      size: 11,
    });
    firstPage.drawText(trackings.length.toString() + ')', {
      x: 330,
      y: height - 198,
      size: 20,
    });
    firstPage.drawText('Station: ' + sac.agence_nom, {
      x: 20,
      y: height - 96,
      size: 14,
    });
    firstPage.drawText('Pour: ' + clientInfo.client_nomCommercial, {
      x: 20,
      y: height - 120,
      size: 14,
    });
    firstPage.drawText(sac.wilaya_codeWilaya.toString(), {
      x: 240,
      y: height - 120,
      size: 120,
    });
    //CODE BARRE
    const barcodeBuffer = await bwipjs.toBuffer({
      bcid: 'code128', // Barcode type
      text: sac.sac_tracking, // Text to encode
      scale: 3, // 3x scaling factor
      height: 12, // Bar height, in millimeters
      paddingheight: 2,
      includetext: true, // Show human-readable text
      textxalign: 'center', // Always good to set this
    });

    const barcodeImage = await pdfDoc.embedPng(barcodeBuffer);
    const barcodeDims = barcodeImage.scaleToFit(230, 85);

    firstPage.drawImage(barcodeImage, {
      x: 520 - barcodeDims.width / 2,
      y: height - 70 - barcodeDims.height / 2,
      width: 150,
      height: barcodeDims.height,
    });
    const qrcodeBuffer = await QRCode.toBuffer(tracking);
    const qrcodeImage = await pdfDoc.embedPng(qrcodeBuffer);
    const qrcodeDims = qrcodeImage.scaleToFit(200, 200);

    firstPage.drawImage(qrcodeImage, {
      x: 310 - qrcodeDims.width / 2,
      y: height - 340 - qrcodeDims.height / 2,
      width: qrcodeDims.width,
      height: qrcodeDims.height,
    });
    const pdfBytes = await pdfDoc.save();
    fs.writeFileSync('dest', pdfBytes);
    return pdfBytes;
  }

  async printManifestRetourClient(sac, trackings, clientInfo) {
    const tracking = trackings.join(' ');
    const dateSac = await this.formatDate(sac.sacShipment_createdAt);
    const packageSlipTemplatePath = 'src/assets/retour_manifest_client.pdf';
    const pdfTemplateBytes = fs.readFileSync(packageSlipTemplatePath);
    const pdfDoc = await PDFDocument.load(pdfTemplateBytes);
    // Embed the Helvetica font
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    // Get the first page of the document
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];
    const { width, height } = firstPage.getSize();
    // firstPage.drawText(sac.sac_typeSac, {
    //   x: 20,
    //   y: height - 75,
    //   size: 9,
    // });

    // firstPage.drawText('Accusé n# ' + sac.sac_id.toString(), {
    //   x: 40,
    //   y: height - 33,
    //   size: 9,
    // });
    firstPage.drawText('Le ' + dateSac.toString(), {
      x: 20,
      y: height - 135,
      size: 11,
    });
    firstPage.drawText(trackings.length.toString(), {
      x: 422,
      y: height - 260,
      size: 14,
    });
    firstPage.drawText(clientInfo.client_nomCommercial, {
      x: 225,
      y: height - 165,
      size: 28,
    });
    //CODE BARRE
    const barcodeBuffer = await bwipjs.toBuffer({
      bcid: 'code128', // Barcode type
      text: sac.sac_tracking, // Text to encode
      scale: 3, // 3x scaling factor
      height: 12, // Bar height, in millimeters
      paddingheight: 2,
      includetext: true, // Show human-readable text
      textxalign: 'center', // Always good to set this
    });
    const barcodeImage = await pdfDoc.embedPng(barcodeBuffer);
    const barcodeDims = barcodeImage.scaleToFit(230, 85);

    firstPage.drawImage(barcodeImage, {
      x: 520 - barcodeDims.width / 2,
      y: height - 70 - barcodeDims.height / 2,
      width: 150,
      height: barcodeDims.height,
    });
    const qrcodeBuffer = await QRCode.toBuffer(tracking);
    const qrcodeImage = await pdfDoc.embedPng(qrcodeBuffer);
    const qrcodeDims = qrcodeImage.scaleToFit(200, 200);

    firstPage.drawImage(qrcodeImage, {
      x: 310 - qrcodeDims.width / 2,
      y: height - 440 - qrcodeDims.height / 2,
      width: qrcodeDims.width,
      height: qrcodeDims.height,
    });
    const pdfBytes = await pdfDoc.save();
    console.log(pdfBytes);
    fs.writeFileSync('dest', pdfBytes);
    return pdfBytes;
  }

  async printPmt(client: Client, pmt: Pmt) {
    let pmtTemplatePath;
    if (pmt.type == 'régularisation') {
      pmtTemplatePath = 'src/assets/pmtRegularisation.pdf';
    } else {
      pmtTemplatePath = 'src/assets/pmt.pdf';
    }
    const pdfTemplateBytes = fs.readFileSync(pmtTemplatePath);
    const pdfDoc = await PDFDocument.load(pdfTemplateBytes);
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const pages = pdfDoc.getPages();
    const firstPage = pages[0];
    const { width, height } = firstPage.getSize();
    // firstPage.drawText('x:50, y:-100, s:9', {
    //   x: 50,
    //   y: height - 100,
    //   size: 10,
    // });

    // firstPage.drawText('x:100, y:-150, s:9', {
    //   x: 100,
    //   y: height - 150,
    //   size: 10,
    // });

    firstPage.drawText(client.id.toString(), {
      x: 110,
      y: height - 185,
      size: 12,
    });

    firstPage.drawText(client.raisonSociale, {
      x: 159,
      y: height - 200,
      size: 12,
    });

    firstPage.drawText(client.nomCommercial, {
      x: 172,
      y: height - 217,
      size: 12,
    });

    firstPage.drawText(pmt.createdBy.employe.codeEmploye, {
      x: 465,
      y: height - 185,
      size: 12,
    });

    firstPage.drawText(pmt.createdOn.code, {
      x: 439,
      y: height - 200,
      size: 12,
    });

    firstPage.drawText(
      pmt.createdAt.getDay().toString() +
        ' / ' +
        pmt.createdAt.getMonth().toString() +
        ' / ' +
        pmt.createdAt.getFullYear().toString(),
      {
        x: 425,
        y: height - 217,
        size: 12,
      },
    );

    firstPage.drawText(pmt.tauxC_O_D.toString() + ' %', {
      x: 102,
      y: height - 272,
      size: 12,
    });

    firstPage.drawText(pmt.tarifRetour.toString() + ' Da', {
      x: 149,
      y: height - 296,
      size: 12,
    });

    firstPage.drawText(pmt.wilayaDeparPmt.nomLatin, {
      x: 167,
      y: height - 320,
      size: 12,
    });

    firstPage.drawText(pmt.montantRamasser.toString() + ' Da', {
      x: 167,
      y: height - 385,
      size: 12,
    });

    firstPage.drawText(pmt.FraisD_envois.toString() + ' Da', {
      x: 147,
      y: height - 409,
      size: 12,
    });

    firstPage.drawText(pmt.montantC_O_D.toString() + ' Da', {
      x: 152,
      y: height - 433,
      size: 12,
    });

    firstPage.drawText(pmt.FraisRetour.toString() + ' Da', {
      x: 151,
      y: height - 457,
      size: 12,
    });

    if (pmt.type == 'régularisation') {
      const montantApayer = pmt.netClient * -1;
      firstPage.drawText(montantApayer.toString() + ' Da', {
        x: 65,
        y: height - 616,
        size: 16,
        font: helveticaFont,
      });
    } else {
      firstPage.drawText(pmt.netClient.toString() + ' Da', {
        x: 65,
        y: height - 616,
        size: 16,
        font: helveticaFont,
      });
    }

    firstPage.drawText(pmt.client.nomGerant + '  ' + pmt.client.prenomGerant, {
      x: 169,
      y: height - 649,
      size: 12,
      font: helveticaFont,
    });

    firstPage.drawText(pmt.client.nomCommercial, {
      x: 425,
      y: height - 648,
      size: 12,
      font: helveticaFont,
    });

    if (pmt.type == 'régularisation') {
      const montantApayer = pmt.netClient * -1;
      firstPage.drawText(montantApayer.toString() + ' Da', {
        x: 225,
        y: height - 668,
        size: 12,
        font: helveticaFont,
      });
    } else {
      firstPage.drawText(pmt.netClient.toString() + ' Da', {
        x: 225,
        y: height - 668,
        size: 12,
        font: helveticaFont,
      });
    }

    firstPage.drawText(pmt.nbShipmentLivrer.toString(), {
      x: 415,
      y: height - 668,
      size: 12,
      font: helveticaFont,
    });

    firstPage.drawText(pmt.nbShipmentRetour.toString(), {
      x: 515,
      y: height - 668,
      size: 12,
      font: helveticaFont,
    });

    firstPage.drawText(pmt.tracking.toUpperCase(), {
      x: 318,
      y: height - 720,
      size: 12,
      font: helveticaFont,
    });

    const qrcodeTarifBuffer = await QRCode.toBuffer(pmt.tarifs);

    const qrcodeTarifImage = await pdfDoc.embedPng(qrcodeTarifBuffer);
    const qrcodeTarifDims = qrcodeTarifImage.scaleToFit(100, 100);

    firstPage.drawImage(qrcodeTarifImage, {
      x: 425 - qrcodeTarifDims.width / 2,
      y: height - 450 - qrcodeTarifDims.height / 2,
      width: qrcodeTarifDims.width,
      height: qrcodeTarifDims.height,
    });

    //CODE BARRE
    const barcodeBuffer = await bwipjs.toBuffer({
      bcid: 'code128', // Barcode type
      text: pmt.tracking, // Text to encode
      scale: 3, // 3x scaling factor
      height: 13, // Bar height, in millimeters
      paddingheight: 2,
      includetext: false, // Show human-readable text
      textxalign: 'center', // Always good to set this
    });

    const barcodeImage = await pdfDoc.embedPng(barcodeBuffer);
    const barcodeDims = barcodeImage.scaleToFit(210, 65);

    firstPage.drawImage(barcodeImage, {
      x: 190,
      y: height - 130,
      width: barcodeDims.width,
      height: barcodeDims.height,
    });

    firstPage.drawText(pmt.tracking.toString().toUpperCase(), {
      x: 248,
      y: height - 150,
      size: 16,
      font: helveticaFont,
    });

    let pmtInfs = '';

    for (const pmtInfo in pmt) {
      if (typeof pmt[pmtInfo] != 'object') {
        pmtInfs += `${pmtInfo}: ${pmt[pmtInfo]} * \n`;
      }
    }
    console.log(
      '🚀 ~ file: pdf.service.ts ~ line 223 ~ PdfService ~ printPmt ~ pmtInfs',
      pmtInfs,
    );

    pmtInfs += 'validateOn: ' + pmt.validatedOn + ' * \n';
    pmtInfs +=
      'createdBy codeEmployer: ' + pmt.createdBy.employe.codeEmploye + ' * \n';
    pmtInfs += 'createdOn ' + pmt.createdOn.code + ' * \n';
    pmtInfs += 'nomCommercial: ' + pmt.client.nomCommercial + ' * \n';
    const qrcodePmtBuffer = await QRCode.toBuffer(pmtInfs);

    const qrcodePmtImage = await pdfDoc.embedPng(qrcodePmtBuffer);
    const qrcodePmtDims = qrcodePmtImage.scaleToFit(80, 80);
    firstPage.drawImage(qrcodePmtImage, {
      x: 500,
      y: 750,
      width: qrcodePmtDims.width,
      height: qrcodePmtDims.height,
    });
    const pdfBytes = await pdfDoc.save();
    fs.writeFileSync('dest', pdfBytes);
    return pdfBytes;
  }

  async printPmtCoursier(pmtCoursier) {
    if (pmtCoursier.shipments.length > 0) {
      console.log(
        '🚀 ~ file: pdf.service.ts ~ line 1099 ~ PdfService ~ printPmtCoursier ~ pmtCoursier',
        pmtCoursier,
      );
      const conventionTemplatePath = 'src/assets/paiementCoursier.pdf';
      const pdfTemplateBytes = fs.readFileSync(conventionTemplatePath);
      const dest = 'src/testpdf/paiementCoursier.pdf';
      const pdfDoc = await PDFDocument.load(pdfTemplateBytes);

      // Embed the Helvetica font
      const helveticaFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

      // Get the first page of the document
      const pages = pdfDoc.getPages();
      const firstPage = pages[0];
      const secondPage = pages[1];
      const lastPage = pages[pages.length - 1];

      const { width, height } = firstPage.getSize();

      //CODE BARRE
      const barcodeBuffer = await bwipjs.toBuffer({
        bcid: 'code128', // Barcode type
        text: pmtCoursier.tracking, // Text to encode
        scale: 3, // 3x scaling factor
        height: 13, // Bar height, in millimeters
        paddingheight: 2,
        includetext: false, // Show human-readable text
        textxalign: 'center', // Always good to set this
      });

      const barcodeImage = await pdfDoc.embedPng(barcodeBuffer);
      const barcodeDims = barcodeImage.scaleToFit(210, 65);

      firstPage.drawImage(barcodeImage, {
        x: 190,
        y: height - 130,
        width: barcodeDims.width,
        height: barcodeDims.height,
      });

      firstPage.drawText(pmtCoursier.tracking.toString().toUpperCase(), {
        x: 248,
        y: height - 150,
        size: 16,
        font: helveticaFont,
      });

      // code QR
      let trackings = '';
      for (const colis of pmtCoursier.shipments) {
        trackings = trackings + '  ' + colis.tracking + '  ';
      }
      const qrcodeBuffer = await QRCode.toBuffer(trackings);
      const qrcodeImage = await pdfDoc.embedPng(qrcodeBuffer);
      const qrcodeDims = qrcodeImage.scaleToFit(80, 80);

      firstPage.drawImage(qrcodeImage, {
        x: 370,
        y: height - 500,
        width: qrcodeDims.width,
        height: qrcodeDims.height,
      });

      // information coursier
      firstPage.drawText(pmtCoursier.coursier.nom, {
        x: 108,
        y: height - 225,
        size: 12,
      });
      firstPage.drawText(pmtCoursier.coursier.prenom, {
        x: 125,
        y: height - 248,
        size: 12,
      });
      firstPage.drawText(pmtCoursier.coursier.immatriculationVehicule, {
        x: 170,
        y: height - 273,
        size: 12,
      });
      firstPage.drawText(pmtCoursier.coursier.user.email, {
        x: 115,
        y: height - 297,
        size: 12,
      });
      firstPage.drawText(pmtCoursier.coursier.numTelephone, {
        x: 115,
        y: height - 321,
        size: 12,
      });

      // information agent
      firstPage.drawText(
        pmtCoursier.createdBy.employe.nom +
          ' ' +
          pmtCoursier.createdBy.employe.prenom,
        {
          x: 400,
          y: height - 225,
          size: 12,
        },
      );
      firstPage.drawText(pmtCoursier.createdOn.nom, {
        x: 408,
        y: height - 248,
        size: 12,
      });
      const datePaiement = new Date();
      let month = '' + (datePaiement.getMonth() + 1);
      let day = '' + datePaiement.getDate();
      const year = datePaiement.getFullYear();
      if (month.length < 2) month = '0' + month;
      if (day.length < 2) day = '0' + day;
      const date = [day, month, year].join('-');
      firstPage.drawText(date, {
        x: 400,
        y: height - 273,
        size: 12,
      });
      firstPage.drawText(pmtCoursier.createdBy.email, {
        x: 400,
        y: height - 297,
        size: 12,
      });

      // information de paiement
      // firstPage.drawText(
      //   pmtCoursier.coursier.montantLivraison.toString() + ' ' + 'DA',
      //   {
      //     x: 215,
      //     y: height - 428,
      //     size: 12,
      //   },
      // );
      firstPage.drawText(pmtCoursier.nbrColis.toString(), {
        x: 200,
        y: height - 452,
        size: 12,
      });
      firstPage.drawText(pmtCoursier.montantTotal.toString() + ' ' + 'DA', {
        x: 292,
        y: height - 541.5,
        size: 16,
      });

      //soussigné
      firstPage.drawText(
        pmtCoursier.coursier.nom + '      ' + pmtCoursier.coursier.prenom,
        {
          x: 190,
          y: height - 644.5,
          size: 12,
        },
      );
      firstPage.drawText(pmtCoursier.montantTotal.toString() + ' ' + 'DA', {
        x: 128,
        y: height - 665,
        size: 12,
      });
      firstPage.drawText(pmtCoursier.nbrColis.toString(), {
        x: 305,
        y: height - 665,
        size: 12,
      });

      const pdfBytes = await pdfDoc.save();
      fs.writeFileSync('dest', pdfBytes);
      return pdfBytes;
    } else {
      throw new EntityNotFoundError(
        PmtCoursier,
        `le pmt d'id ${pmtCoursier.id} n'a aucun colis`,
      );
    }
  }

  async printFactureClassique(facture) {
    console.log(
      '🚀 ~ file: pdf.service.ts ~ line 2985 ~ PdfService ~ printFactureClassique ~ facture',
      facture,
    );
    const factureAll = [...facture];
    let page = 0;
    const pdfDoc = null;
    const pdfdocs = [];
    let pagesTotales;
    const reste = facture.length % 35;
    if (reste > 15) {
      pagesTotales = parseInt((facture.length / 35 + 2).toString());
    } else {
      pagesTotales = parseInt((facture.length / 35 + 1).toString());
    }
    // pagesTotales=parseInt((facture.length / 35 + 1).toString())
    console.log(parseInt((facture.length / 35 + 1).toString()));
    const lenthData = parseInt((facture.length / 35 + 1).toString());
    for (let i = 0; i < lenthData; i++) {
      page = page + 1;
      console.log(lenthData, '', i, facture.length);
      if (facture.length <= 35) {
        if (facture.length > 15) {
          const pdfDoc = await this.drawFactureClassic(
            facture,
            factureAll,
            page,
            pagesTotales,
          );
          pdfdocs.push(pdfDoc);
          const pdfDocFooter = await this.drawFactureClassicFooter(
            facture,
            factureAll,
            page,
            pagesTotales,
          );
          pdfdocs.push(pdfDocFooter);
        } else {
          const pdfDoc = await this.drawFactureClassic(
            facture,
            factureAll,
            page,
            pagesTotales,
            facture.length,
          );
          pdfdocs.push(pdfDoc);
        }
      } else {
        const dataSend = facture.splice(0, 35);
        const pdfDoc = await this.drawFactureClassic(
          dataSend,
          factureAll,
          page,
          pagesTotales,
        );
        pdfdocs.push(pdfDoc);
      }
    }
    const brd = await pdfdocs[0];
    let pdfBytes = await brd.save();
    for (let i = 1; i < pdfdocs.length; i++) {
      const allBRD = await brd.copyPages(pdfdocs[i], [0]);
      brd.addPage(allBRD[0]);
      pdfBytes = await brd.save();
    }
    fs.writeFileSync('dest', pdfBytes);
    return pdfBytes;
  }

  async drawFactureClassic(facture, factureAll, page, pagesTotales, footer?) {
    const conventionTemplatePath = 'src/assets/FactureClassique.pdf';
    const pdfTemplateBytes = fs.readFileSync(conventionTemplatePath);
    const dest = 'src/testpdf/convention.pdf';
    const pdfDoc = await PDFDocument.load(pdfTemplateBytes);
    // Get the first page of the document
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];
    const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const normal = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const { width, height } = firstPage.getSize();
    let rectangleStart = 237;
    let lineStart = 222;

    firstPage.drawText(facture[0].facture_numFacture, {
      x: 70,
      y: height - 139.5,
      size: 8,
    });

    firstPage.drawText(facture[0].client_raisonSociale, {
      x: 83,
      y: height - 151.5,
      size: 8,
    });

    firstPage.drawText(facture[0].client_adresse, {
      x: 65,
      y: height - 163.5,
      size: 8,
    });

    firstPage.drawText(facture[0].client_nrc, {
      x: 54,
      y: height - 174.5,
      size: 8,
    });

    firstPage.drawText(facture[0].client_nif, {
      x: 54,
      y: height - 186.5,
      size: 8,
    });

    firstPage.drawText(facture[0].client_nis, {
      x: 54,
      y: height - 198,
      size: 8,
    });

    firstPage.drawText(factureAll.length.toString(), {
      x: 410,
      y: height - 187,
      size: 8,
    });

    firstPage.drawText('page' + ' ' + page.toString() + ' / ' + pagesTotales, {
      x: 410,
      y: height - 210,
      size: 8,
    });

    const date = new Date();
    let month = '' + (date.getMonth() + 1);
    let day = '' + date.getDate();
    const year = date.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    const dateDeFacture = [day, month, year].join('-');

    firstPage.drawText(dateDeFacture, {
      x: 425,
      y: height - 140.5,
      size: 8,
    });

    //--------------------------------------------------- debut header----------------------
    firstPage.drawRectangle({
      x: 26.4,
      y: height - rectangleStart,
      width: 545.5,
      height: 15,
      borderColor: rgb(0, 0, 0),
      borderWidth: 0.6,
      color: rgb(1, 0, 0),
    });

    // -------------date expidition------------
    firstPage.drawText(`Date d'expédition`, {
      x: 29.5,
      y: height - rectangleStart + 4.7,
      size: 8.7,
      color: rgb(1, 1, 1),
      font: bold,
    });

    // -------------tracking------------
    firstPage.drawLine({
      start: { x: 105.5, y: height - lineStart },
      end: { x: 105.5, y: height - rectangleStart },
      thickness: 0.7,
      color: rgb(0, 0, 0),
    });
    firstPage.drawText(`Envoi N°`, {
      x: 129,
      y: height - rectangleStart + 4.7,
      size: 8.7,
      color: rgb(1, 1, 1),
      font: bold,
    });

    // -------------destinataire------------
    firstPage.drawLine({
      start: { x: 187.7, y: height - lineStart },
      end: { x: 187.7, y: height - rectangleStart },
      thickness: 0.7,
      color: rgb(0, 0, 0),
    });
    firstPage.drawText(`Destinataire`, {
      x: 221,
      y: height - rectangleStart + 4.7,
      size: 8.7,
      color: rgb(1, 1, 1),
      font: bold,
    });

    // ------------destination-------------
    firstPage.drawLine({
      start: { x: 312.5, y: height - lineStart },
      end: { x: 312.5, y: height - rectangleStart },
      thickness: 0.7,
      color: rgb(0, 0, 0),
    });
    firstPage.drawText(`Destination`, {
      x: 344,
      y: height - rectangleStart + 4.7,
      size: 8.7,
      color: rgb(1, 1, 1),
      font: bold,
    });

    // ------------Poids-------------
    firstPage.drawLine({
      start: { x: 423, y: height - lineStart },
      end: { x: 423, y: height - rectangleStart },
      thickness: 0.7,
      color: rgb(0, 0, 0),
    });
    firstPage.drawText(`Poids`, {
      x: 440,
      y: height - rectangleStart + 4.7,
      size: 8.7,
      color: rgb(1, 1, 1),
      font: bold,
    });

    // -------------Tarif Ht------------
    firstPage.drawLine({
      start: { x: 486, y: height - lineStart },
      end: { x: 486, y: height - rectangleStart },
      thickness: 0.7,
      color: rgb(0, 0, 0),
    });
    firstPage.drawText(`Tarif H.T`, {
      x: 506,
      y: height - rectangleStart + 4.7,
      size: 8.7,
      color: rgb(1, 1, 1),
      font: bold,
    });

    //--------------------------------------------------- fin header----------------------

    //--------------------------------------------------- debut contenu table----------------------

    for (const shipment of facture) {
      rectangleStart = rectangleStart + 15;
      lineStart = lineStart + 15;
      firstPage.drawRectangle({
        x: 26.4,
        y: height - rectangleStart,
        width: 545.5,
        height: 15,
        borderColor: rgb(0, 0, 0),
        borderWidth: 0.6,
      });

      // -------------date expidition------------
      const dateExpidition = new Date(shipment.status_createdAt);
      let month = '' + (dateExpidition.getMonth() + 1);
      let day = '' + dateExpidition.getDate();
      const year = dateExpidition.getFullYear();
      if (month.length < 2) month = '0' + month;
      if (day.length < 2) day = '0' + day;
      const date = [day, month, year].join('-');
      firstPage.drawText(date, {
        x: 29.5,
        y: height - rectangleStart + 4.7,
        size: 8.7,
        font: normal,
      });

      // -------------tracking------------
      firstPage.drawLine({
        start: { x: 105.5, y: height - lineStart },
        end: { x: 105.5, y: height - rectangleStart },
        thickness: 0.7,
        color: rgb(0, 0, 0),
      });
      firstPage.drawText(shipment.shipments_tracking, {
        x: 108,
        y: height - rectangleStart + 4.7,
        size: 8.7,
        font: normal,
      });

      // -------------destinataire------------
      firstPage.drawLine({
        start: { x: 187.7, y: height - lineStart },
        end: { x: 187.7, y: height - rectangleStart },
        thickness: 0.7,
        color: rgb(0, 0, 0),
      });
      firstPage.drawText(shipment.shipments_raisonSociale, {
        x: 190,
        y: height - rectangleStart + 4.7,
        size: 8.7,
        font: normal,
      });

      // ------------destination-------------
      firstPage.drawLine({
        start: { x: 312.5, y: height - lineStart },
        end: { x: 312.5, y: height - rectangleStart },
        thickness: 0.7,
        color: rgb(0, 0, 0),
      });
      firstPage.drawText(shipment.wilaya_nomLatin, {
        x: 315,
        y: height - rectangleStart + 4.7,
        size: 8.7,
        font: normal,
      });

      // ------------Poids-------------
      firstPage.drawLine({
        start: { x: 423, y: height - lineStart },
        end: { x: 423, y: height - rectangleStart },
        thickness: 0.7,
        color: rgb(0, 0, 0),
      });
      firstPage.drawText(shipment.poids.toString() + ' kg', {
        x: 425.5,
        y: height - rectangleStart + 4.7,
        size: 8.7,
        font: normal,
      });

      // -------------Tarif Ht------------
      firstPage.drawLine({
        start: { x: 486, y: height - lineStart },
        end: { x: 486, y: height - rectangleStart },
        thickness: 0.7,
        color: rgb(0, 0, 0),
      });
      firstPage.drawText(
        shipment.tarif.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$& '),
        {
          x: 488.5,
          y: height - rectangleStart + 4.7,
          size: 8.7,
          font: normal,
        },
      );
    }
    //--------------------------------------------------- fin contenu table----------------------

    //--------------------------------------------------- debut footer----------------------
    if (footer) {
      // ---------------------montant HT-----------------

      firstPage.drawRectangle({
        x: 160,
        y: height - rectangleStart - 60,
        width: 300,
        height: 15,
        borderColor: rgb(0, 0, 0),
        borderWidth: 0.6,
      });

      firstPage.drawText('Montant H.T', {
        x: 165,
        y: height - rectangleStart - 60 + 4.7,
        size: 10,
      });

      firstPage.drawText(
        facture[0].facture_montantHoreTaxe
          .toFixed(2)
          .replace(/\d(?=(\d{3})+\.)/g, '$& '),
        {
          x: 355,
          y: height - rectangleStart - 60 + 4.7,
          size: 10,
        },
      );

      // ---------------------TVA-----------------
      firstPage.drawRectangle({
        x: 160,
        y: height - rectangleStart - 75,
        width: 300,
        height: 15,
        borderColor: rgb(0, 0, 0),
        borderWidth: 0.6,
      });

      firstPage.drawText('TVA (19%)', {
        x: 165,
        y: height - rectangleStart - 75 + 4.7,
        size: 10,
      });

      firstPage.drawText(
        facture[0].facture_montantTva
          .toFixed(2)
          .replace(/\d(?=(\d{3})+\.)/g, '$& '),
        {
          x: 363,
          y: height - rectangleStart - 75 + 4.7,
          size: 10,
        },
      );

      // ---------------------TTC-----------------
      firstPage.drawRectangle({
        x: 160,
        y: height - rectangleStart - 90,
        width: 300,
        height: 15,
        borderColor: rgb(0, 0, 0),
        borderWidth: 0.6,
      });

      firstPage.drawText('Montant TTC', {
        x: 165,
        y: height - rectangleStart - 90 + 4.7,
        size: 10,
      });

      firstPage.drawText(
        facture[0].facture_montantTtc
          .toFixed(2)
          .replace(/\d(?=(\d{3})+\.)/g, '$& '),
        {
          x: 355,
          y: height - rectangleStart - 90 + 4.7,
          size: 10,
        },
      );

      // ---------------------timbre----------------
      firstPage.drawRectangle({
        x: 160,
        y: height - rectangleStart - 105,
        width: 300,
        height: 15,
        borderColor: rgb(0, 0, 0),
        borderWidth: 0.6,
      });
      firstPage.drawText('Timbre', {
        x: 165,
        y: height - rectangleStart - 105 + 4.7,
        size: 10,
      });

      if (facture[0].facture_montantTimbre == 0) {
        firstPage.drawText('/', {
          x: 380,
          y: height - rectangleStart - 105 + 4.7,
          size: 10,
        });
      } else {
        firstPage.drawText(
          facture[0].facture_montantTimbre
            .toFixed(2)
            .replace(/\d(?=(\d{3})+\.)/g, '$& '),
          {
            x: 369,
            y: height - rectangleStart - 105 + 4.7,
            size: 10,
          },
        );
      }

      // ---------------------montant total-----------------
      firstPage.drawRectangle({
        x: 160,
        y: height - rectangleStart - 120,
        width: 300,
        height: 15,
        borderColor: rgb(0, 0, 0),
        borderWidth: 0.6,
      });

      firstPage.drawText('Montant total', {
        x: 165,
        y: height - rectangleStart - 120 + 4.7,
        size: 10,
      });

      firstPage.drawText(
        facture[0].facture_montantTotal
          .toFixed(2)
          .replace(/\d(?=(\d{3})+\.)/g, '$& '),
        {
          x: 355,
          y: height - rectangleStart - 120 + 4.7,
          size: 10,
        },
      );

      firstPage.drawLine({
        start: { x: 350, y: height - lineStart - 60 },
        end: { x: 350, y: height - rectangleStart - 120 },
        thickness: 0.7,
        color: rgb(0, 0, 0),
      });

      const { NumberToLetter } = require('convertir-nombre-lettre');

      const montantTotalString = facture[0].facture_montantTotal.toFixed(2);

      const centimeString = montantTotalString.substr(
        montantTotalString.length - 2,
      );
      const centimeNombre = Number(centimeString);

      const dinarString = montantTotalString.slice(0, -3);
      const dinarNombre = Number(dinarString);

      const dinarEnLettre = NumberToLetter(dinarNombre);
      const centimeLettre = NumberToLetter(centimeNombre);

      firstPage.drawText('Arrêter la présente facture à la somme de :', {
        x: 40,
        y: height - rectangleStart - 170,
        size: 10,
      });

      firstPage.drawText(
        dinarEnLettre + ' dinars' + ' et ' + centimeLettre + ' centimes',
        {
          x: 40,
          y: height - rectangleStart - 190,
          size: 11,
        },
      );

      firstPage.drawText('cachet et signature', {
        x: 380,
        y: height - 720,
        size: 11,
      });
    }
    //--------------------------------------------------- fin footer---------------------

    return pdfDoc;
  }
  //
  
  async drawFactureClassicFooter(facture, factureAll, page, pagesTotales) {
    const conventionTemplatePath = 'src/assets/FactureClassique.pdf';
    const pdfTemplateBytes = fs.readFileSync(conventionTemplatePath);
    const dest = 'src/testpdf/convention.pdf';
    const pdfDoc = await PDFDocument.load(pdfTemplateBytes);
    // Get the first page of the document
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];
    const { width, height } = firstPage.getSize();
    let rectangleStart = 237;
    let lineStart = 222;
    const numPage = page + 1;

    firstPage.drawText(facture[0].facture_numFacture, {
      x: 70,
      y: height - 139.5,
      size: 8,
    });

    firstPage.drawText(facture[0].client_raisonSociale, {
      x: 83,
      y: height - 151.5,
      size: 8,
    });

    firstPage.drawText(facture[0].client_adresse, {
      x: 65,
      y: height - 163.5,
      size: 8,
    });

    firstPage.drawText(facture[0].client_nrc, {
      x: 54,
      y: height - 174.5,
      size: 8,
    });

    firstPage.drawText(facture[0].client_nif, {
      x: 54,
      y: height - 186.5,
      size: 8,
    });

    firstPage.drawText(facture[0].client_nis, {
      x: 54,
      y: height - 198,
      size: 8,
    });

    firstPage.drawText(factureAll.length.toString(), {
      x: 410,
      y: height - 187,
      size: 8,
    });

    firstPage.drawText(
      'page' + ' ' + numPage.toString() + ' / ' + pagesTotales,
      {
        x: 410,
        y: height - 210,
        size: 8,
      },
    );

    const date = new Date();
    let month = '' + (date.getMonth() + 1);
    let day = '' + date.getDate();
    const year = date.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    const dateDeFacture = [day, month, year].join('-');

    firstPage.drawText(dateDeFacture, {
      x: 425,
      y: height - 140.5,
      size: 8,
    });

    // ---------------------montant HT-----------------
    firstPage.drawRectangle({
      x: 160,
      y: height - rectangleStart - 30,
      width: 300,
      height: 15,
      borderColor: rgb(0, 0, 0),
      borderWidth: 0.6,
    });

    firstPage.drawText('Montant H.T', {
      x: 165,
      y: height - rectangleStart - 30 + 4.7,
      size: 10,
    });

    firstPage.drawText(
      facture[0].facture_montantHoreTaxe
        .toFixed(2)
        .replace(/\d(?=(\d{3})+\.)/g, '$& '),
      {
        x: 355,
        y: height - rectangleStart - 30 + 4.7,
        size: 10,
      },
    );

    // ---------------------TVA-----------------
    firstPage.drawRectangle({
      x: 160,
      y: height - rectangleStart - 45,
      width: 300,
      height: 15,
      borderColor: rgb(0, 0, 0),
      borderWidth: 0.6,
    });

    firstPage.drawText('Montant TVA', {
      x: 165,
      y: height - rectangleStart - 45 + 4.7,
      size: 10,
    });

    firstPage.drawText(
      facture[0].facture_montantTva
        .toFixed(2)
        .replace(/\d(?=(\d{3})+\.)/g, '$& '),
      {
        x: 355,
        y: height - rectangleStart - 45 + 4.7,
        size: 10,
      },
    );

    // ---------------------TTC-----------------
    firstPage.drawRectangle({
      x: 160,
      y: height - rectangleStart - 60,
      width: 300,
      height: 15,
      borderColor: rgb(0, 0, 0),
      borderWidth: 0.6,
    });

    firstPage.drawText('Montant TTC', {
      x: 165,
      y: height - rectangleStart - 60 + 4.7,
      size: 10,
    });

    firstPage.drawText(
      facture[0].facture_montantTtc
        .toFixed(2)
        .replace(/\d(?=(\d{3})+\.)/g, '$& '),
      {
        x: 355,
        y: height - rectangleStart - 60 + 4.7,
        size: 10,
      },
    );

    // ---------------------timbre----------------
    firstPage.drawRectangle({
      x: 160,
      y: height - rectangleStart - 75,
      width: 300,
      height: 15,
      borderColor: rgb(0, 0, 0),
      borderWidth: 0.6,
    });
    firstPage.drawText('Timbre', {
      x: 165,
      y: height - rectangleStart - 75 + 4.7,
      size: 10,
    });

    firstPage.drawText(
      facture[0].facture_montantTimbre
        .toFixed(2)
        .replace(/\d(?=(\d{3})+\.)/g, '$& '),
      {
        x: 355,
        y: height - rectangleStart - 75 + 4.7,
        size: 10,
      },
    );

    // ---------------------montant total-----------------
    firstPage.drawRectangle({
      x: 160,
      y: height - rectangleStart - 90,
      width: 300,
      height: 15,
      borderColor: rgb(0, 0, 0),
      borderWidth: 0.6,
    });

    firstPage.drawText('Montant total', {
      x: 165,
      y: height - rectangleStart - 90 + 4.7,
      size: 10,
    });

    firstPage.drawText(
      facture[0].facture_montantTotal
        .toFixed(2)
        .replace(/\d(?=(\d{3})+\.)/g, '$& '),
      {
        x: 355,
        y: height - rectangleStart - 90 + 4.7,
        size: 10,
      },
    );

    firstPage.drawLine({
      start: { x: 350, y: height - lineStart - 30 },
      end: { x: 350, y: height - rectangleStart - 90 },
      thickness: 0.7,
      color: rgb(0, 0, 0),
    });

    const { NumberToLetter } = require('  ');

    const montantTotalString = facture[0].facture_montantTotal.toFixed(2);

    const centimeString = montantTotalString.substr(
      montantTotalString.length - 2,
    );
    const centimeNombre = Number(centimeString);

    const dinarString = montantTotalString.slice(0, -3);
    const dinarNombre = Number(dinarString);

    const dinarEnLettre = NumberToLetter(dinarNombre);
    const centimeLettre = NumberToLetter(centimeNombre);

    firstPage.drawText('Arrêter la présente facture à la somme de :', {
      x: 40,
      y: height - rectangleStart - 170,
      size: 10,
    });

    firstPage.drawText(
      dinarEnLettre + ' dinars' + ' et ' + centimeLettre + ' centimes',
      {
        x: 40,
        y: height - rectangleStart - 190,
        size: 11,
      },
    );

    firstPage.drawText('cachet et signature', {
      x: 380,
      y: height - 725,
      size: 11,
    });

    return pdfDoc;
  }

  async printFactureEcommerceDetail(facture) {
    const factureAll = [...facture];
    let page = 0;
    const pdfDoc = null;
    const pdfdocs = [];
    let pagesTotales;
    const reste = facture.length % 35;
    if (reste > 15) {
      pagesTotales = parseInt((facture.length / 35 + 2).toString());
    } else {
      pagesTotales = parseInt((facture.length / 35 + 1).toString());
    }
    // pagesTotales=parseInt((facture.length / 35 + 1).toString())
    console.log(parseInt((facture.length / 35 + 1).toString()));
    const lenthData = parseInt((facture.length / 35 + 1).toString());
    for (let i = 0; i < lenthData; i++) {
      page = page + 1;
      console.log(lenthData, '', i, facture.length);
      if (facture.length <= 35) {
        if (facture.length > 15) {
          const pdfDoc = await this.drawFactureEcommerce(
            facture,
            factureAll,
            page,
            pagesTotales,
          );
          pdfdocs.push(pdfDoc);
          const pdfDocFooter = await this.drawFactureEcommerceFooter(
            facture,
            factureAll,
            page,
            pagesTotales,
          );
          pdfdocs.push(pdfDocFooter);
        } else {
          const pdfDoc = await this.drawFactureEcommerce(
            facture,
            factureAll,
            page,
            pagesTotales,
            facture.length,
          );
          pdfdocs.push(pdfDoc);
        }
      } else {
        const dataSend = facture.splice(0, 35);
        const pdfDoc = await this.drawFactureEcommerce(
          dataSend,
          factureAll,
          page,
          pagesTotales,
        );
        pdfdocs.push(pdfDoc);
      }
    }
    const brd = await pdfdocs[0];
    let pdfBytes = await brd.save();
    for (let i = 1; i < pdfdocs.length; i++) {
      const allBRD = await brd.copyPages(pdfdocs[i], [0]);
      brd.addPage(allBRD[0]);
      pdfBytes = await brd.save();
    }
    fs.writeFileSync('dest', pdfBytes);
    return pdfBytes;
  }

  async drawFactureEcommerce(facture, factureAll, page, pagesTotales, footer?) {
    const conventionTemplatePath = 'src/assets/FactureEcommerce.pdf';
    const pdfTemplateBytes = fs.readFileSync(conventionTemplatePath);
    const dest = 'src/testpdf/convention.pdf';
    const pdfDoc = await PDFDocument.load(pdfTemplateBytes);
    // Get the first page of the document
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];
    const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const normal = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const { width, height } = firstPage.getSize();
    let rectangleStart = 237;
    let lineStart = 222;

    firstPage.drawText(facture[0].facture_numFacture, {
      x: 70,
      y: height - 139.5,
      size: 8,
    });

    firstPage.drawText(facture[0].client_raisonSociale, {
      x: 83,
      y: height - 151.5,
      size: 8,
    });

    firstPage.drawText(facture[0].client_adresse, {
      x: 65,
      y: height - 163.5,
      size: 8,
    });

    firstPage.drawText(facture[0].client_nrc, {
      x: 54,
      y: height - 174.5,
      size: 8,
    });

    firstPage.drawText(facture[0].client_nif, {
      x: 54,
      y: height - 186.5,
      size: 8,
    });

    firstPage.drawText(facture[0].client_nis, {
      x: 54,
      y: height - 198,
      size: 8,
    });

    firstPage.drawText(factureAll.length.toString(), {
      x: 410,
      y: height - 187,
      size: 8,
    });

    firstPage.drawText('page' + ' ' + page.toString() + ' / ' + pagesTotales, {
      x: 410,
      y: height - 210,
      size: 8,
    });

    const date = new Date();
    let month = '' + (date.getMonth() + 1);
    let day = '' + date.getDate();
    const year = date.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    const dateDeFacture = [day, month, year].join('-');

    firstPage.drawText(dateDeFacture, {
      x: 425,
      y: height - 140.5,
      size: 8,
    });

    //--------------------------------------------------- debut header----------------------
    firstPage.drawRectangle({
      x: 22,
      y: height - rectangleStart,
      width: 560,
      height: 15,
      borderColor: rgb(0, 0, 0),
      borderWidth: 0.6,
      color: rgb(1, 0, 0),
    });

    // -------------tracking------------
    firstPage.drawText(`Envoi N°`, {
      x: 29.5,
      y: height - rectangleStart + 4.7,
      size: 8.7,
      color: rgb(1, 1, 1),
      font: bold,
    });

    // -------------statut------------
    firstPage.drawLine({
      start: { x: 80, y: height - lineStart },
      end: { x: 80, y: height - rectangleStart },
      thickness: 0.7,
      color: rgb(0, 0, 0),
    });
    firstPage.drawText(`statut`, {
      x: 85,
      y: height - rectangleStart + 4.7,
      size: 8.7,
      color: rgb(1, 1, 1),
      font: bold,
    });

    // -------------date------------
    firstPage.drawLine({
      start: { x: 130, y: height - lineStart },
      end: { x: 130, y: height - rectangleStart },
      thickness: 0.7,
      color: rgb(0, 0, 0),
    });
    firstPage.drawText(`date`, {
      x: 135,
      y: height - rectangleStart + 4.7,
      size: 8.7,
      color: rgb(1, 1, 1),
      font: bold,
    });

    // ------------destinataire-------------
    firstPage.drawLine({
      start: { x: 187.7, y: height - lineStart },
      end: { x: 187.7, y: height - rectangleStart },
      thickness: 0.7,
      color: rgb(0, 0, 0),
    });
    firstPage.drawText(`Destinataire`, {
      x: 192.7,
      y: height - rectangleStart + 4.7,
      size: 8.7,
      color: rgb(1, 1, 1),
      font: bold,
    });

    // ------------destinantion-------------
    firstPage.drawLine({
      start: { x: 285, y: height - lineStart },
      end: { x: 285, y: height - rectangleStart },
      thickness: 0.7,
      color: rgb(0, 0, 0),
    });
    firstPage.drawText(`Destination`, {
      x: 290,
      y: height - rectangleStart + 4.7,
      size: 8.7,
      color: rgb(1, 1, 1),
      font: bold,
    });

    // ------------Poids-------------
    firstPage.drawLine({
      start: { x: 355, y: height - lineStart },
      end: { x: 355, y: height - rectangleStart },
      thickness: 0.7,
      color: rgb(0, 0, 0),
    });
    firstPage.drawText(`Poids`, {
      x: 357.5,
      y: height - rectangleStart + 4.7,
      size: 8.7,
      color: rgb(1, 1, 1),
      font: bold,
    });

    // ------------Livraison-------------
    firstPage.drawLine({
      start: { x: 385, y: height - lineStart },
      end: { x: 385, y: height - rectangleStart },
      thickness: 0.7,
      color: rgb(0, 0, 0),
    });
    firstPage.drawText(`Livraison`, {
      x: 390,
      y: height - rectangleStart + 4.7,
      size: 8.7,
      color: rgb(1, 1, 1),
      font: bold,
    });

    // -------------Retour------------
    firstPage.drawLine({
      start: { x: 435, y: height - lineStart },
      end: { x: 435, y: height - rectangleStart },
      thickness: 0.7,
      color: rgb(0, 0, 0),
    });
    firstPage.drawText(`Retour`, {
      x: 440,
      y: height - rectangleStart + 4.7,
      size: 8.7,
      color: rgb(1, 1, 1),
      font: bold,
    });

    // -------------Cod------------
    firstPage.drawLine({
      start: { x: 480, y: height - lineStart },
      end: { x: 480, y: height - rectangleStart },
      thickness: 0.7,
      color: rgb(0, 0, 0),
    });
    firstPage.drawText(`COD`, {
      x: 485,
      y: height - rectangleStart + 4.7,
      size: 8.7,
      color: rgb(1, 1, 1),
      font: bold,
    });

    // -------------Tarif total------------
    firstPage.drawLine({
      start: { x: 525, y: height - lineStart },
      end: { x: 525, y: height - rectangleStart },
      thickness: 0.7,
      color: rgb(0, 0, 0),
    });
    firstPage.drawText(`Total`, {
      x: 530,
      y: height - rectangleStart + 4.7,
      size: 8.7,
      color: rgb(1, 1, 1),
      font: bold,
    });

    //--------------------------------------------------- fin header----------------------

    //--------------------------------------------------- debut contenu table----------------------

    for (const shipment of facture) {
      console.log("🚀 ~ file: pdf.service.ts ~ line 4082 ~ PdfService ~ drawFactureEcommerce ~ shipment", shipment)
      rectangleStart = rectangleStart + 15;
      lineStart = lineStart + 15;
      firstPage.drawRectangle({
        x: 22,
        y: height - rectangleStart,
        width: 560,
        height: 15,
        borderColor: rgb(0, 0, 0),
        borderWidth: 0.6,
      });

      // -------------tracking------------

      firstPage.drawText(shipment.shipments_tracking, {
        x: 24,
        y: height - rectangleStart + 4.7,
        size: 8.7,
        font: normal,
      });

      // -------------statut------------

      firstPage.drawLine({
        start: { x: 80, y: height - lineStart },
        end: { x: 80, y: height - rectangleStart },
        thickness: 0.7,
        color: rgb(0, 0, 0),
      });

      firstPage.drawText(shipment.status_libelle, {
        x: 82,
        y: height - rectangleStart + 4.7,
        size: 8.7,
        font: normal,
      });

      // -------------date------------

      firstPage.drawLine({
        start: { x: 130, y: height - lineStart },
        end: { x: 130, y: height - rectangleStart },
        thickness: 0.7,
        color: rgb(0, 0, 0),
      });

      const dateExpidition = new Date(shipment.status_createdAt);
      let month = '' + (dateExpidition.getMonth() + 1);
      let day = '' + dateExpidition.getDate();
      const year = dateExpidition.getFullYear();
      if (month.length < 2) month = '0' + month;
      if (day.length < 2) day = '0' + day;
      const date = [day, month, year].join('-');
      firstPage.drawText(date, {
        x: 132,
        y: height - rectangleStart + 4.7,
        size: 8.7,
        font: normal,
      });

      // -------------destinataire------------
      firstPage.drawLine({
        start: { x: 187.7, y: height - lineStart },
        end: { x: 187.7, y: height - rectangleStart },
        thickness: 0.7,
        color: rgb(0, 0, 0),
      });
      firstPage.drawText(shipment.shipments_raisonSociale, {
        x: 190,
        y: height - rectangleStart + 4.7,
        size: 8.7,
        font: normal,
      });

      // ------------destination-------------
      firstPage.drawLine({
        start: { x: 285, y: height - lineStart },
        end: { x: 285, y: height - rectangleStart },
        thickness: 0.7,
        color: rgb(0, 0, 0),
      });
      firstPage.drawText(shipment.wilaya_nomLatin, {
        x: 287,
        y: height - rectangleStart + 4.7,
        size: 8.7,
        font: normal,
      });

      // ------------Poids-------------
      firstPage.drawLine({
        start: { x: 355, y: height - lineStart },
        end: { x: 355, y: height - rectangleStart },
        thickness: 0.7,
        color: rgb(0, 0, 0),
      });
      firstPage.drawText((shipment.poids).toString(), {
        x: 357,
        y: height - rectangleStart + 4.7,
        size: 8.7,
        font: normal,
      });

      // ------------- tarif Livraison------------
      firstPage.drawLine({
        start: { x: 385, y: height - lineStart },
        end: { x: 385, y: height - rectangleStart },
        thickness: 0.7,
        color: rgb(0, 0, 0),
      });
      firstPage.drawText(
        shipment.tarifLivraison.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$& '),
        {
          x: 387,
          y: height - rectangleStart + 4.7,
          size: 8.7,
          font: normal,
        },        
      );

        // -------------tarif retour------------
      firstPage.drawLine({
        start: { x: 435, y: height - lineStart },
        end: { x: 435, y: height - rectangleStart },
        thickness: 0.7,
        color: rgb(0, 0, 0),
      });
      firstPage.drawText( shipment.tarifRetour.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$& '), {
        x: 437,
        y: height - rectangleStart + 4.7,
        size: 8.7,
        font: normal,
      });

      
        // -------------cod------------
        firstPage.drawLine({
          start: { x: 480, y: height - lineStart },
          end: { x: 480, y: height - rectangleStart },
          thickness: 0.7,
          color: rgb(0, 0, 0),
        });
        firstPage.drawText( shipment.montantCOD.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$& '), {
          x: 482,
          y: height - rectangleStart + 4.7,
          size: 8.7,
          font: normal,
        })

              
        // -------------tatal colis------------
        firstPage.drawLine({
          start: { x: 525, y: height - lineStart },
          end: { x: 525, y: height - rectangleStart },
          thickness: 0.7,
          color: rgb(0, 0, 0),
        });
        firstPage.drawText( shipment.montantTotalColis.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$& '), {
          x: 527,
          y: height - rectangleStart + 4.7,
          size: 8.7,
          font: normal,
        })
    }
    //--------------------------------------------------- fin contenu table----------------------

    //--------------------------------------------------- debut footer----------------------
    if (footer) {
      // ---------------------montant HT-----------------

      firstPage.drawRectangle({
        x: 160,
        y: height - rectangleStart - 60,
        width: 300,
        height: 15,
        borderColor: rgb(0, 0, 0),
        borderWidth: 0.6,
      });

      firstPage.drawText('Montant H.T', {
        x: 165,
        y: height - rectangleStart - 60 + 4.7,
        size: 10,
      });

      firstPage.drawText(
        facture[0].facture_montantHoreTaxe
          .toFixed(2)
          .replace(/\d(?=(\d{3})+\.)/g, '$& '),
        {
          x: 355,
          y: height - rectangleStart - 60 + 4.7,
          size: 10,
        },
      );

      // ---------------------TVA-----------------
      firstPage.drawRectangle({
        x: 160,
        y: height - rectangleStart - 75,
        width: 300,
        height: 15,
        borderColor: rgb(0, 0, 0),
        borderWidth: 0.6,
      });

      firstPage.drawText('TVA (19%)', {
        x: 165,
        y: height - rectangleStart - 75 + 4.7,
        size: 10,
      });

      firstPage.drawText(
        facture[0].facture_montantTva
          .toFixed(2)
          .replace(/\d(?=(\d{3})+\.)/g, '$& '),
        {
          x: 363,
          y: height - rectangleStart - 75 + 4.7,
          size: 10,
        },
      );

      // ---------------------TTC-----------------
      firstPage.drawRectangle({
        x: 160,
        y: height - rectangleStart - 90,
        width: 300,
        height: 15,
        borderColor: rgb(0, 0, 0),
        borderWidth: 0.6,
      });

      firstPage.drawText('Montant TTC', {
        x: 165,
        y: height - rectangleStart - 90 + 4.7,
        size: 10,
      });

      firstPage.drawText(
        facture[0].facture_montantTtc
          .toFixed(2)
          .replace(/\d(?=(\d{3})+\.)/g, '$& '),
        {
          x: 355,
          y: height - rectangleStart - 90 + 4.7,
          size: 10,
        },
      );

      // ---------------------timbre----------------
      firstPage.drawRectangle({
        x: 160,
        y: height - rectangleStart - 105,
        width: 300,
        height: 15,
        borderColor: rgb(0, 0, 0),
        borderWidth: 0.6,
      });
      firstPage.drawText('Timbre', {
        x: 165,
        y: height - rectangleStart - 105 + 4.7,
        size: 10,
      });

      if (facture[0].facture_montantTimbre == 0) {
        firstPage.drawText('/', {
          x: 380,
          y: height - rectangleStart - 105 + 4.7,
          size: 10,
        });
      } else {
        firstPage.drawText(
          facture[0].facture_montantTimbre
            .toFixed(2)
            .replace(/\d(?=(\d{3})+\.)/g, '$& '),
          {
            x: 369,
            y: height - rectangleStart - 105 + 4.7,
            size: 10,
          },
        );
      }

      // ---------------------montant total-----------------
      firstPage.drawRectangle({
        x: 160,
        y: height - rectangleStart - 120,
        width: 300,
        height: 15,
        borderColor: rgb(0, 0, 0),
        borderWidth: 0.6,
      });

      firstPage.drawText('Montant total', {
        x: 165,
        y: height - rectangleStart - 120 + 4.7,
        size: 10,
      });

      firstPage.drawText(
        facture[0].facture_montantTotal
          .toFixed(2)
          .replace(/\d(?=(\d{3})+\.)/g, '$& '),
        {
          x: 355,
          y: height - rectangleStart - 120 + 4.7,
          size: 10,
        },
      );

      firstPage.drawLine({
        start: { x: 350, y: height - lineStart - 60 },
        end: { x: 350, y: height - rectangleStart - 120 },
        thickness: 0.7,
        color: rgb(0, 0, 0),
      });

      const { NumberToLetter } = require('convertir-nombre-lettre');

      const montantTotalString = facture[0].facture_montantTotal.toFixed(2);

      const centimeString = montantTotalString.substr(
        montantTotalString.length - 2,
      );
      const centimeNombre = Number(centimeString);

      const dinarString = montantTotalString.slice(0, -3);
      const dinarNombre = Number(dinarString);

      const dinarEnLettre = NumberToLetter(dinarNombre);
      const centimeLettre = NumberToLetter(centimeNombre);

      firstPage.drawText('Arrêter la présente facture à la somme de :', {
        x: 40,
        y: height - rectangleStart - 170,
        size: 10,
      });

      firstPage.drawText(
        dinarEnLettre + ' dinars' + ' et ' + centimeLettre + ' centimes',
        {
          x: 40,
          y: height - rectangleStart - 190,
          size: 11,
        },
      );

      firstPage.drawText('cachet et signature', {
        x: 380,
        y: height - 720,
        size: 11,
      });
    }
    //--------------------------------------------------- fin footer---------------------

    return pdfDoc;
  }

  async drawFactureEcommerceFooter(facture, factureAll, page, pagesTotales) {
    const conventionTemplatePath = 'src/assets/FactureEcommerce.pdf';
    const pdfTemplateBytes = fs.readFileSync(conventionTemplatePath);
    const dest = 'src/testpdf/convention.pdf';
    const pdfDoc = await PDFDocument.load(pdfTemplateBytes);
    // Get the first page of the document
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];
    const { width, height } = firstPage.getSize();
    let rectangleStart = 237;
    let lineStart = 222;
    const numPage = page + 1;

    firstPage.drawText(facture[0].facture_numFacture, {
      x: 70,
      y: height - 139.5,
      size: 8,
    });

    firstPage.drawText(facture[0].client_raisonSociale, {
      x: 83,
      y: height - 151.5,
      size: 8,
    });

    firstPage.drawText(facture[0].client_adresse, {
      x: 65,
      y: height - 163.5,
      size: 8,
    });

    firstPage.drawText(facture[0].client_nrc, {
      x: 54,
      y: height - 174.5,
      size: 8,
    });

    firstPage.drawText(facture[0].client_nif, {
      x: 54,
      y: height - 186.5,
      size: 8,
    });

    firstPage.drawText(facture[0].client_nis, {
      x: 54,
      y: height - 198,
      size: 8,
    });

    firstPage.drawText(factureAll.length.toString(), {
      x: 410,
      y: height - 187,
      size: 8,
    });

    firstPage.drawText(
      'page' + ' ' + numPage.toString() + ' / ' + pagesTotales,
      {
        x: 410,
        y: height - 210,
        size: 8,
      },
    );

    const date = new Date();
    let month = '' + (date.getMonth() + 1);
    let day = '' + date.getDate();
    const year = date.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    const dateDeFacture = [day, month, year].join('-');

    firstPage.drawText(dateDeFacture, {
      x: 425,
      y: height - 140.5,
      size: 8,
    });

    // ---------------------montant HT-----------------
    firstPage.drawRectangle({
      x: 160,
      y: height - rectangleStart - 30,
      width: 300,
      height: 15,
      borderColor: rgb(0, 0, 0),
      borderWidth: 0.6,
    });

    firstPage.drawText('Montant H.T', {
      x: 165,
      y: height - rectangleStart - 30 + 4.7,
      size: 10,
    });

    firstPage.drawText(
      facture[0].facture_montantHoreTaxe
        .toFixed(2)
        .replace(/\d(?=(\d{3})+\.)/g, '$& '),
      {
        x: 355,
        y: height - rectangleStart - 30 + 4.7,
        size: 10,
      },
    );

    // ---------------------TVA-----------------
    firstPage.drawRectangle({
      x: 160,
      y: height - rectangleStart - 45,
      width: 300,
      height: 15,
      borderColor: rgb(0, 0, 0),
      borderWidth: 0.6,
    });

    firstPage.drawText('Montant TVA', {
      x: 165,
      y: height - rectangleStart - 45 + 4.7,
      size: 10,
    });

    firstPage.drawText(
      facture[0].facture_montantTva
        .toFixed(2)
        .replace(/\d(?=(\d{3})+\.)/g, '$& '),
      {
        x: 363,
        y: height - rectangleStart - 45 + 4.7,
        size: 10,
      },
    );

    // ---------------------TTC-----------------
    firstPage.drawRectangle({
      x: 160,
      y: height - rectangleStart - 60,
      width: 300,
      height: 15,
      borderColor: rgb(0, 0, 0),
      borderWidth: 0.6,
    });

    firstPage.drawText('Montant TTC', {
      x: 165,
      y: height - rectangleStart - 60 + 4.7,
      size: 10,
    });

    firstPage.drawText(
      facture[0].facture_montantTtc
        .toFixed(2)
        .replace(/\d(?=(\d{3})+\.)/g, '$& '),
      {
        x: 355,
        y: height - rectangleStart - 60 + 4.7,
        size: 10,
      },
    );

    // ---------------------timbre----------------
    firstPage.drawRectangle({
      x: 160,
      y: height - rectangleStart - 75,
      width: 300,
      height: 15,
      borderColor: rgb(0, 0, 0),
      borderWidth: 0.6,
    });
    firstPage.drawText('Timbre', {
      x: 165,
      y: height - rectangleStart - 75 + 4.7,
      size: 10,
    });

    firstPage.drawText(
      facture[0].facture_montantTimbre
        .toFixed(2)
        .replace(/\d(?=(\d{3})+\.)/g, '$& '),
      {
        x: 369,
        y: height - rectangleStart - 75 + 4.7,
        size: 10,
      },
    );

    // ---------------------montant total-----------------
    firstPage.drawRectangle({
      x: 160,
      y: height - rectangleStart - 90,
      width: 300,
      height: 15,
      borderColor: rgb(0, 0, 0),
      borderWidth: 0.6,
    });

    firstPage.drawText('Montant total', {
      x: 165,
      y: height - rectangleStart - 90 + 4.7,
      size: 10,
    });

    firstPage.drawText(
      facture[0].facture_montantTotal
        .toFixed(2)
        .replace(/\d(?=(\d{3})+\.)/g, '$& '),
      {
        x: 355,
        y: height - rectangleStart - 90 + 4.7,
        size: 10,
      },
    );

    firstPage.drawLine({
      start: { x: 350, y: height - lineStart - 30 },
      end: { x: 350, y: height - rectangleStart - 90 },
      thickness: 0.7,
      color: rgb(0, 0, 0),
    });

      const { NumberToLetter } = require('convertir-nombre-lettre');

    const montantTotalString = facture[0].facture_montantTotal.toFixed(2);

    const centimeString = montantTotalString.substr(
      montantTotalString.length - 2,
    );
    const centimeNombre = Number(centimeString);

    const dinarString = montantTotalString.slice(0, -3);
    const dinarNombre = Number(dinarString);

    const dinarEnLettre = NumberToLetter(dinarNombre);
    const centimeLettre = NumberToLetter(centimeNombre);

    firstPage.drawText('Arrêter la présente facture à la somme de :', {
      x: 40,
      y: height - rectangleStart - 170,
      size: 10,
    });

    firstPage.drawText(
      dinarEnLettre + ' dinars' + ' et ' + centimeLettre + ' centimes',
      {
        x: 40,
        y: height - rectangleStart - 190,
        size: 11,
      },
    );

    firstPage.drawText('cachet et signature', {
      x: 380,
      y: height - 725,
      size: 11,
    });

    return pdfDoc;
  }

  async printFactureEcommerceSimplifie(facture) {
    const conventionTemplatePath = 'src/assets/FactureEcommerce.pdf';
    const pdfTemplateBytes = fs.readFileSync(conventionTemplatePath);
    const dest = 'src/testpdf/convention.pdf';
    const pdfDoc = await PDFDocument.load(pdfTemplateBytes);
    // Get the first page of the document
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];
    const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const normal = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const { width, height } = firstPage.getSize();
    let rectangleStart = 237;
    let lineStart = 222;

    firstPage.drawText(facture[0].facture_numFacture, {
      x: 70,
      y: height - 139.5,
      size: 8,
    });

    firstPage.drawText(facture[0].client_raisonSociale, {
      x: 83,
      y: height - 151.5,
      size: 8,
    });

    firstPage.drawText(facture[0].client_adresse, {
      x: 65,
      y: height - 163.5,
      size: 8,
    });

    firstPage.drawText(facture[0].client_nrc, {
      x: 54,
      y: height - 174.5,
      size: 8,
    });

    firstPage.drawText(facture[0].client_nif, {
      x: 54,
      y: height - 186.5,
      size: 8,
    });

    firstPage.drawText(facture[0].client_nis, {
      x: 54,
      y: height - 198,
      size: 8,
    });

    firstPage.drawText(facture.length.toString(), {
      x: 410,
      y: height - 187,
      size: 8,
    });

    firstPage.drawText('page ' + '1' + ' / ' + '1', {
      x: 410,
      y: height - 210,
      size: 8,
    });

    const date = new Date();
    let month = '' + (date.getMonth() + 1);
    let day = '' + date.getDate();
    const year = date.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    const dateDeFacture = [day, month, year].join('-');

    firstPage.drawText(dateDeFacture, {
      x: 425,
      y: height - 140.5,
      size: 8,
    });

    //--------------------------------------------------- debut header----------------------
    firstPage.drawRectangle({
      x: 40,
      y: height - rectangleStart,
      width: 440,
      height: 15,
      borderColor: rgb(0, 0, 0),
      borderWidth: 0.6,
      color: rgb(1, 0, 0),
    });

    // -------------nombre------------
    firstPage.drawText(`Nombre`, {
      x: 42,
      y: height - rectangleStart + 4.7,
      size: 8.7,
      color: rgb(1, 1, 1),
      font: bold,
    });

    // -------------statut------------
    firstPage.drawLine({
      start: { x: 120, y: height - lineStart },
      end: { x: 120, y: height - rectangleStart },
      thickness: 0.7,
      color: rgb(0, 0, 0),
    });
    firstPage.drawText(`statut`, {
      x: 122,
      y: height - rectangleStart + 4.7,
      size: 8.7,
      color: rgb(1, 1, 1),
      font: bold,
    });


    // ------------Livraison-------------
    firstPage.drawLine({
      start: { x: 200, y: height - lineStart },
      end: { x: 200, y: height - rectangleStart },
      thickness: 0.7,
      color: rgb(0, 0, 0),
    });
    firstPage.drawText(`Livraison`, {
      x: 202,
      y: height - rectangleStart + 4.7,
      size: 8.7,
      color: rgb(1, 1, 1),
      font: bold,
    });

    // -------------Retour------------
    firstPage.drawLine({
      start: { x: 280, y: height - lineStart },
      end: { x: 280, y: height - rectangleStart },
      thickness: 0.7,
      color: rgb(0, 0, 0),
    });
    firstPage.drawText(`Retour`, {
      x: 282,
      y: height - rectangleStart + 4.7,
      size: 8.7,
      color: rgb(1, 1, 1),
      font: bold,
    });

    // -------------Cod------------
    firstPage.drawLine({
      start: { x: 360, y: height - lineStart },
      end: { x: 360, y: height - rectangleStart },
      thickness: 0.7,
      color: rgb(0, 0, 0),
    });
    firstPage.drawText(`COD`, {
      x: 362,
      y: height - rectangleStart + 4.7,
      size: 8.7,
      color: rgb(1, 1, 1),
      font: bold,
    });

    // -------------Tarif total------------
    firstPage.drawLine({
      start: { x: 420, y: height - lineStart },
      end: { x: 420, y: height - rectangleStart },
      thickness: 0.7,
      color: rgb(0, 0, 0),
    });
    firstPage.drawText(`Total`, {
      x: 422,
      y: height - rectangleStart + 4.7,
      size: 8.7,
      color: rgb(1, 1, 1),
      font: bold,
    });

    //--------------------------------------------------- fin header----------------------

    //--------------------------------------------------- debut contenu table----------------------
    let colisLivrer=0;
    let colisRetirer=0;
    let tarifLivraison=0;
    let tarifRetour=0;
    let montantCOD=0;
    let tarifColisLiivre=0;
    for (const shipment of facture) {
      if (shipment.status_libelle==StatusShipmentEnum.livre) {
        montantCOD= montantCOD + shipment.montantCOD;
        tarifLivraison=tarifLivraison+shipment.tarifLivraison
        colisLivrer=colisLivrer+1;
        tarifColisLiivre=tarifColisLiivre+shipment.montantTotalColis;
      } else if (shipment.status_libelle==StatusShipmentEnum.retirer) {
        tarifRetour=tarifRetour+shipment.tarifRetour;
        colisRetirer=colisRetirer+1
      }
    }

    firstPage.drawRectangle({
      x: 40,
      y: height - rectangleStart-15,
      width: 440,
      height: 15,
      borderColor: rgb(0, 0, 0),
      borderWidth: 0.6,
    });

    // -------------nombre------------
    firstPage.drawText(colisLivrer.toString(), {
      x: 42,
      y: height - rectangleStart-15 + 4.7,
      size: 8.7,
    });

    // -------------statut------------
    firstPage.drawLine({
      start: { x: 120, y: height - lineStart },
      end: { x: 120, y: height - rectangleStart-15 },
      thickness: 0.7,
      color: rgb(0, 0, 0),
    });
    firstPage.drawText(`LIVRÉ`, {
      x: 122,
      y: height - rectangleStart-15 + 4.7,
      size: 8.7,
    });


    // ------------Livraison-------------
    firstPage.drawLine({
      start: { x: 200, y: height - lineStart },
      end: { x: 200, y: height - rectangleStart-15 },
      thickness: 0.7,
      color: rgb(0, 0, 0),
    });
    firstPage.drawText(tarifLivraison.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$& '), {
      x: 202,
      y: height - rectangleStart-15 + 4.7,
      size: 8.7,
    });

    // -------------Retour------------
    firstPage.drawLine({
      start: { x: 280, y: height - lineStart },
      end: { x: 280, y: height - rectangleStart-15 },
      thickness: 0.7,
      color: rgb(0, 0, 0),
    });
    firstPage.drawText(`00.00`, {
      x: 282,
      y: height - rectangleStart-15 + 4.7,
      size: 8.7,
    });

    // -------------Cod------------
    firstPage.drawLine({
      start: { x: 360, y: height - lineStart },
      end: { x: 360, y: height - rectangleStart-15 },
      thickness: 0.7,
      color: rgb(0, 0, 0),
    });
    firstPage.drawText(montantCOD.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$& '), {
      x: 362,
      y: height - rectangleStart-15 + 4.7,
      size: 8.7,
    });

    // -------------Tarif total------------
    firstPage.drawLine({
      start: { x: 420, y: height - lineStart },
      end: { x: 420, y: height - rectangleStart-15 },
      thickness: 0.7,
      color: rgb(0, 0, 0),
    });
    firstPage.drawText(tarifColisLiivre.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$& '),{
      x: 422,
      y: height - rectangleStart-15 + 4.7,
      size: 8.7,
    });

    firstPage.drawRectangle({
      x: 40,
      y: height - rectangleStart-30,
      width: 440,
      height: 15,
      borderColor: rgb(0, 0, 0),
      borderWidth: 0.6,
    });

    // -------------nombre------------
    firstPage.drawText(colisRetirer.toString(), {
      x: 42,
      y: height - rectangleStart-30 + 4.7,
      size: 8.7,
    });

    // -------------statut------------
    firstPage.drawLine({
      start: { x: 120, y: height - lineStart },
      end: { x: 120, y: height - rectangleStart-30 },
      thickness: 0.7,
      color: rgb(0, 0, 0),
    });
    firstPage.drawText(`RETIRÉ`, {
      x: 122,
      y: height - rectangleStart-30 + 4.7,
      size: 8.7,
    });


    // ------------Livraison-------------
    firstPage.drawLine({
      start: { x: 200, y: height - lineStart },
      end: { x: 200, y: height - rectangleStart-30 },
      thickness: 0.7,
      color: rgb(0, 0, 0),
    });
    firstPage.drawText('00.00', {
      x: 202,
      y: height - rectangleStart-30 + 4.7,
      size: 8.7,
    });

    // -------------Retour------------
    firstPage.drawLine({
      start: { x: 280, y: height - lineStart },
      end: { x: 280, y: height - rectangleStart-30 },
      thickness: 0.7,
      color: rgb(0, 0, 0),
    });
    firstPage.drawText(tarifRetour.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$& '), {
      x: 282,
      y: height - rectangleStart-30 + 4.7,
      size: 8.7,
    });

    // -------------Cod------------
    firstPage.drawLine({
      start: { x: 360, y: height - lineStart },
      end: { x: 360, y: height - rectangleStart-30 },
      thickness: 0.7,
      color: rgb(0, 0, 0),
    });
    firstPage.drawText('00.00', {
      x: 362,
      y: height - rectangleStart-30 + 4.7,
      size: 8.7,
    });

    // -------------Tarif total------------
    firstPage.drawLine({
      start: { x: 420, y: height - lineStart },
      end: { x: 420, y: height - rectangleStart-30 },
      thickness: 0.7,
      color: rgb(0, 0, 0),
    });
    firstPage.drawText(tarifRetour.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$& '),{
      x: 422,
      y: height - rectangleStart-30 + 4.7,
      size: 8.7,
    });


    // ---------------------montant HT-----------------
    firstPage.drawRectangle({
      x: 160,
      y: height - rectangleStart - 60-30,
      width: 300,
      height: 15,
      borderColor: rgb(0, 0, 0),
      borderWidth: 0.6,
    });

    firstPage.drawText('Montant H.T', {
      x: 165,
      y: height - rectangleStart - 60-30 + 4.7,
      size: 10,
    });

    firstPage.drawText(
      facture[0].facture_montantHoreTaxe
        .toFixed(2)
        .replace(/\d(?=(\d{3})+\.)/g, '$& '),
      {
        x: 355,
        y: height - rectangleStart - 60-30 + 4.7,
        size: 10,
      },
    );

    // ---------------------TVA-----------------
    firstPage.drawRectangle({
      x: 160,
      y: height - rectangleStart - 75-30,
      width: 300,
      height: 15,
      borderColor: rgb(0, 0, 0),
      borderWidth: 0.6,
    });

    firstPage.drawText('Montant TVA', {
      x: 165,
      y: height - rectangleStart - 75-30 + 4.7,
      size: 10,
    });

    firstPage.drawText(
      facture[0].facture_montantTva
        .toFixed(2)
        .replace(/\d(?=(\d{3})+\.)/g, '$& '),
      {
        x: 363,
        y: height - rectangleStart - 75-30 + 4.7,
        size: 10,
      },
    );

    // ---------------------TTC-----------------
    firstPage.drawRectangle({
      x: 160,
      y: height - rectangleStart - 90-30,
      width: 300,
      height: 15,
      borderColor: rgb(0, 0, 0),
      borderWidth: 0.6,
    });

    firstPage.drawText('Montant TTC', {
      x: 165,
      y: height - rectangleStart - 90-30 + 4.7,
      size: 10,
    });

    firstPage.drawText(
      facture[0].facture_montantTtc
        .toFixed(2)
        .replace(/\d(?=(\d{3})+\.)/g, '$& '),
      {
        x: 355,
        y: height - rectangleStart - 90-30 + 4.7,
        size: 10,
      },
    );

    // ---------------------timbre----------------
    firstPage.drawRectangle({
      x: 160,
      y: height - rectangleStart - 105-30,
      width: 300,
      height: 15,
      borderColor: rgb(0, 0, 0),
      borderWidth: 0.6,
    });
    firstPage.drawText('Timbre', {
      x: 165,
      y: height - rectangleStart - 105-30 + 4.7,
      size: 10,
    });

    firstPage.drawText(
      facture[0].facture_montantTimbre
        .toFixed(2)
        .replace(/\d(?=(\d{3})+\.)/g, '$& '),
      {
        x: 369,
        y: height - rectangleStart - 105-30 + 4.7,
        size: 10,
      },
    );

    // ---------------------montant total-----------------
    firstPage.drawRectangle({
      x: 160,
      y: height - rectangleStart - 120-30,
      width: 300,
      height: 15,
      borderColor: rgb(0, 0, 0),
      borderWidth: 0.6,
    });

    firstPage.drawText('Montant total', {
      x: 165,
      y: height - rectangleStart - 120-30 + 4.7,
      size: 10,
    });

    firstPage.drawText(
      facture[0].facture_montantTotal
        .toFixed(2)
        .replace(/\d(?=(\d{3})+\.)/g, '$& '),
      {
        x: 355,
        y: height - rectangleStart - 120-30 + 4.7,
        size: 10,
      },
    );

    firstPage.drawLine({
      start: { x: 350, y: height - lineStart - 60-30 },
      end: { x: 350, y: height - rectangleStart - 120-30 },
      thickness: 0.7,
      color: rgb(0, 0, 0),
    });

      const { NumberToLetter } = require('convertir-nombre-lettre');

    const montantTotalString = facture[0].facture_montantTotal.toFixed(2);

    const centimeString = montantTotalString.substr(
      montantTotalString.length - 2,
    );
    const centimeNombre = Number(centimeString);

    const dinarString = montantTotalString.slice(0, -3);
    const dinarNombre = Number(dinarString);

    const dinarEnLettre = NumberToLetter(dinarNombre);
    const centimeLettre = NumberToLetter(centimeNombre);

    firstPage.drawText('Arrêter la présente facture à la somme de :', {
      x: 40,
      y: height - rectangleStart - 200-30,
      size: 10,
    });

    firstPage.drawText(
      dinarEnLettre + ' dinars' + ' et ' + centimeLettre + ' centimes',
      {
        x: 40,
        y: height - rectangleStart - 220-30,
        size: 11,
      },
    );

    firstPage.drawText('cachet et signature', {
      x: 380,
      y: height - 725,
      size: 11,
    });
    

 


    //--------------------------------------------------- fin contenu table----------------------

    const pdfBytes = await pdfDoc.save();
    fs.writeFileSync('dest', pdfBytes);
    return pdfBytes;
  }


  async printRecolteRegularisationOrFacture(
    recolte,
    pmtOrFactureTrackings,
    userInfo,
    montant,
  ) {
    const tracking = pmtOrFactureTrackings.join(' ');
    const dateRecolte = await this.formatDate(recolte.createdAt);

    const packageSlipTemplatePath = 'src/assets/recolteModelManifest.pdf';
    const pdfTemplateBytes = fs.readFileSync(packageSlipTemplatePath);
    const pdfDoc = await PDFDocument.load(pdfTemplateBytes);

    const helveticaFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const pages = pdfDoc.getPages();
    const firstPage = pages[0];
    const { width, height } = firstPage.getSize();

    firstPage.drawText(
      userInfo.agence.nom.toUpperCase() +
        '-' +
        userInfo.agence.commune.nomLatin.toUpperCase() +
        '/' +
        userInfo.agence.commune.wilaya.nomLatin.toUpperCase(),
      {
        x: 30,
        y: height - 65,
        size: 10,
      },
    );

    firstPage.drawText(
      userInfo.nom.toUpperCase() +
        ' ' +
        userInfo.prenom.toUpperCase() +
        ' ' +
        userInfo.numTelephone,
      {
        x: 30,
        y: height - 80,
        size: 11,
      },
    );

    firstPage.drawText('Le ' + dateRecolte, {
      x: 30,
      y: height - 95,
      size: 11,
    });

    firstPage.drawText(recolte.typeRtc.toUpperCase(), {
      x: 30,
      y: height - 115,
      size: 15,
    });

    if (recolte.typeRtc == 'régularisation') {
      firstPage.drawText(
        pmtOrFactureTrackings.length.toString() +
          ' Pmts ( ' +
          montant.toString() +
          'DA )',
        {
          x: 205,
          y: height - 200,
          size: 23,
          font: helveticaFont,
        },
      );
    } else if (recolte.typeRtc == 'facture') {
      firstPage.drawText(
        pmtOrFactureTrackings.length.toString() +
          ' Factures ( ' +
          montant.toFixed(2) +
          'DA )',
        {
          x: 205,
          y: height - 200,
          size: 23,
          font: helveticaFont,
        },
      );
    }

    //CODE BARRE
    const barcodeBuffer = await bwipjs.toBuffer({
      bcid: 'code128', // Barcode type
      text: recolte.tracking, // Text to encode
      scale: 3, // 3x scaling factor
      height: 16, // Bar height, in millimeters
      paddingheight: 0,
      includetext: true, // Show human-readable text
      textxalign: 'center', // Always good to set this
    });
    console.log(userInfo.agence.nom);
    console.log(userInfo.agence.commune.nomLatin);
    console.log(userInfo.agence.commune.wilaya.nomLatin);
    console.log(userInfo.nom);
    console.log(userInfo.prenom);
    console.log(userInfo.numTelephone);

    const barcodeImage = await pdfDoc.embedPng(barcodeBuffer);
    const barcodeDims = barcodeImage.scaleToFit(180, 110);

    firstPage.drawImage(barcodeImage, {
      x: 490 - barcodeDims.width / 2,
      y: height - 70 - barcodeDims.height / 2,
      width: barcodeDims.width,
      height: barcodeDims.height,
    });
    const qrcodeBuffer = await QRCode.toBuffer(tracking);
    const qrcodeImage = await pdfDoc.embedPng(qrcodeBuffer);
    const qrcodeDims = qrcodeImage.scaleToFit(200, 200);

    firstPage.drawImage(qrcodeImage, {
      x: 290 - qrcodeDims.width / 2,
      y: height - 320 - qrcodeDims.height / 2,
      width: qrcodeDims.width,
      height: qrcodeDims.height,
    });

    const pdfBytes = await pdfDoc.save();
    console.log('5');

    fs.writeFileSync('dest', pdfBytes);
    return pdfBytes;
  }

}
