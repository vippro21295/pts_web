import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Global } from './GlobalURL.service';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' })
  }
  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) { }
  ExportTemplate(fileName) {
    return this.http.post<any>(this.baseUrl + 'api/Common/Export_Template', JSON.stringify(fileName), this.httpOptions);
  }
  download(data, filename) {
    var file = new Blob([this.s2ab(atob(data))], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
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
    for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
  }
  downloadFile(data: HttpResponse<Blob>) {
    const downloadedFile = new Blob([data.body], { type: data.body.type });
    const a = document.createElement('a');
    a.setAttribute('style', 'display:none;');
    document.body.appendChild(a);
    //a.download = this.url;
    a.href = URL.createObjectURL(downloadedFile);
    a.target = '_blank';
    a.click();
    document.body.removeChild(a);
  }

  GetReportHead(userId){
    const param =  new HttpParams().set("UserId", userId);
    return this.http.get<any>(this.baseUrl + Global.HREF_GET_REPORT_HEAD,{params: param} );
  }
}
