import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Global } from '../services/GlobalURL.service';
import { stringify } from 'querystring';

@Injectable({
  providedIn: 'root'
})
export class ServiceBillService {
  private httpOptions = {
    headers: new HttpHeaders({
      "Content-Type": "application/json; charset=utf-8",
    }),
  };
  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) { }

  Search(objSearch) {
    const params = new HttpParams()
    .set("search", objSearch.search)
    .set("type", objSearch.type)
    .set("from", objSearch.startTime.toISOString())
    .set("to", objSearch.endTime.toISOString())
    .set("tuPhieu", objSearch.tuPhieu)
    .set("denPhieu", objSearch.denPhieu);

    return this.http.get<any>(this.baseUrl + Global.HREF_SERVICE_BILL_GET, {params:params});
  }

  LoadDefaultData(){
    return this.http.get<any>(this.baseUrl + Global.HREF_LOAD_DEFAULT_DATA_GET);
  }

  LoadDataBillNo(billNo){
    const param = new HttpParams().set("billNo", billNo);
    return this.http.get<any>(this.baseUrl + Global.HREF_LOAD_DATA_BILLNO_GET, {params: param});
  }

  GetServiceCode(code){
    const param = new HttpParams().set("serviceCode", code);
    return this.http.get<any>(this.baseUrl + Global.HREF_GET_SERVICE_CODE, {params: param});
  }

  GetServiceCodeModel(code, model){
    const param = new HttpParams().set("serviceCode", code).set("modelCode", model);
    return this.http.get<any>(this.baseUrl + Global.HREF_GET_SERVICE_CODE_MODEL, {params: param});
  }

  GetToolListHMS(billNo, action){
    const param = new HttpParams().set("billNo", billNo).set("action", action);
    return this.http.get<any>(this.baseUrl + Global.HREF_GET_TOOL_HMS, {params: param});
  }

  SaveServiceBill(obj, lstWage, lstTool, lstPTTool, lstPTTM, objPTHM){
    let data = JSON.stringify({
      ServiceBill: obj,
      ServiceBillDetail: lstWage,
      SpecialTool: lstTool, 
      ToolInBill: lstPTTool, 
      ToolInBillBuy: lstPTTM,
      CheckForServiceBill: objPTHM
    });
    return this.http.post<any>(this.baseUrl + Global.HREF_SAVE_SERVICE_BILL, data, this.httpOptions);
  }

  SavePrintTool(obj){
    return this.http.post<any>(this.baseUrl + Global.HREF_SAVE_PRINT_TOOL, JSON.stringify(obj),this.httpOptions );
  }

  SearchNumberPlate(numberplate, phone){
    let param = new HttpParams().set('numberPlateOrPhone', numberplate).set('phone', phone);
    return this.http.get<any>(this.baseUrl + Global.HREF_SEARCH_NUMBERPLATE, {params: param})
  }

  GetLastCustomerInfoFromAllStore(numberPlate){
    let param = new HttpParams().set('numberPlate', numberPlate)
    return this.http.get<any>(this.baseUrl + Global.HREF_GET_LAST_CUSTOMER, {params: param})
  }
 
}
