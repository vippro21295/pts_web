import { Injectable } from "@angular/core";
import * as XLSX from "xlsx";

@Injectable({
  providedIn: "root",
})
export class ExcelService {
  constructor() {}

  // Method to read Excel file
  readExcelFile(file: File): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();

      fileReader.onload = (e: any) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const excelData = XLSX.utils.sheet_to_json(worksheet, { raw: true });

        // Normalize header names
        if (excelData.length > 0) {
          for (let i = 0; i < excelData.length; i++) {
            const firstRow = excelData[i];
            Object.keys(firstRow).forEach((key) => {
              const normalizedKey = this.normalizeString(key);
              if (key !== normalizedKey) {
                Object.defineProperty(
                  firstRow,
                  normalizedKey,
                  Object.getOwnPropertyDescriptor(firstRow, key)
                );
                delete firstRow[key];
              }
            });
          }
        }
        resolve(excelData);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };

      fileReader.readAsArrayBuffer(file);
    });
  }

  base64ToBlob(base64: string, contentType: string): Blob {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: contentType });
  }

  // Function to read Excel data from Blob
  readExcelView(blob: Blob): Promise<any> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        const result: { [key: string]: any[][] } = {};
        workbook.SheetNames.forEach(sheetName => {
          const worksheet = workbook.Sheets[sheetName];
          const jsonSheet = XLSX.utils.sheet_to_json(worksheet, {
            header: 1,
            raw: false,
            defval: null
          }) as any[][];
          result[sheetName] = jsonSheet.map(row =>
            row.map(cell => {
              if (typeof cell === 'object' && cell !== null && 'f' in cell) {
                return cell.v; // Lấy giá trị nếu ô là công thức
              }
              return cell;
            })
          );
        });
        resolve(result);
      };
      reader.onerror = (err) => reject(err);
      reader.readAsArrayBuffer(blob);
    });
  }

  
  downloadFromData(data, filename) {
    var file = new Blob([this.s2ab(data)], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
  
      var a = document.createElement("a"),
        url = URL.createObjectURL(file);
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      setTimeout(function () {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }, 0);
  }

  download(data, filename) {
    var file = new Blob([this.s2ab(atob(data))], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
  
      var a = document.createElement("a"),
        url = URL.createObjectURL(file);
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      setTimeout(function () {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }, 0);
  }


  s2ab(s) {
    var buf = new ArrayBuffer(s.length);
    var view = new Uint8Array(buf);
    for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xff;
    return buf;
  }

  normalizeString(str) {
    const accentsMap = {
      Đ: "D", // Map Đ to D
      đ: "d", // Map đ to d
    };

    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f\/\.]/g, "")
      .replace(/[\(\)\*]/g, "")
      .replace(/[Đđ]/g, function (matched) {
        return accentsMap[matched];
      })
      .replace(/\s+/g, "");
  }
}
