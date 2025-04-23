import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) { }
  GetUsers(){
    return this.http.get<any>(this.baseUrl + 'api/User/GetUsers');
  }
  SaveUser(user){
    return this.http.post<any>(this.baseUrl + 'api/User/CreateUser',user);
  }
}
