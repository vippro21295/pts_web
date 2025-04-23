import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class RoleService {
  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) { }
  GetRoles() {
    return this.http.get<any>(this.baseUrl + 'api/Role/GetRoles');
  }
}
