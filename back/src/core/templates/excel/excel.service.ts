import { Injectable } from '@nestjs/common';

@Injectable()
export class ExcelService {
  numToSSColumn(num) {
    let s = '',
      t;

    while (num > 0) {
      t = (num - 1) % 26;
      s = String.fromCharCode(65 + t) + s;
      num = ((num - t) / 26) | 0;
    }
    return s || undefined;
  }
  async exportToExcel(res: any, term: string, data: any) {
    const ligne = data.length + 1;
    const nbColumn = Object.keys(data[0]).length;
    const colonne = this.numToSSColumn(nbColumn);
    //npm install xlsx-populate
    const XlsxPopulate = require('xlsx-populate');
    //npm install xlsx
    const reader = require('xlsx');
    // Reading our excelModel file
    const file = reader.readFile('src/assets/excelModel.xlsx');
    const ws = reader.utils.json_to_sheet(data);
    // Writing to our file
    reader.utils.book_append_sheet(file, ws);
    reader.writeFile(file, 'src/assets/excelModel.xlsx');
    // Load an existing workbook
    XlsxPopulate.fromFileAsync('src/assets/excelModel.xlsx')
      .then((workbook) => {
        workbook.deleteSheet(0);
        workbook.toFileAsync('src/assets/excelModel.xlsx');
        const rangeData = workbook.sheet(0).range(`A1:${colonne}${ligne}`);
        for (let i = 2; i <= ligne; i++) {
          if (i % 2 !== 0) {
            let range = workbook.sheet(0).range(`A${i}:${colonne}${i}`);
            range.style({ fill: 'f1f1f1' });
          }
        }
        for (let i = 1; i <= nbColumn; i++) {
          let columnToChange = this.numToSSColumn(i);
          const maxStringLength = workbook
            .sheet(0)
            .range(`${columnToChange}1:${columnToChange}${ligne}`)
            .reduce((max, cell) => {
              const value = cell.value();
              if (value === undefined) return max;
              return Math.max(max, value.toString().length);
            }, 0);

          // For the default font settings in Excel, 1 char -> 1 pt is a pretty good estimate.
          workbook.sheet(0).column(`${columnToChange}`).width(maxStringLength);
        }

        rangeData.style({
          horizontalAlignment: 'left',
          leftBorder: true,
          rightBorder: true,
          bottomBorder: true,
          topBorder: true,
          fontSize: 10,
        });
        const rangeHeaders = workbook.sheet(0).range(`A1:${colonne}1`);
        rangeHeaders.style({ bold: 'true', fill: 'FF4500', fontSize: 11 });
        return workbook.outputAsync();
      })
      .then((data) => {
        res.attachment('excelModel.xlsx');
        res.send(data);
      });
  }
}
