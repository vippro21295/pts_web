import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, empty, Observable } from 'rxjs';
import { Account } from '../models/account';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<Account>;
  public currentUser: Observable<Account>;
  private user = localStorage.getItem('currentUser');
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' })
  }
  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) {
    this.currentUserSubject = new BehaviorSubject<Account>(this.user ? JSON.parse(this.user).result.account : null);
    this.currentUser = this.currentUserSubject.asObservable();
  }
  public get currentUserValue(): Account {
    return this.currentUserSubject.value;
  }


  login(user) {
    console.log(user);
    return this.http.post<any>(this.baseUrl + 'api/Auth/Login', JSON.stringify(user), this.httpOptions)
      .pipe(map(user => {
        if (user.result.success == true) {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user.result.account);
        }
        return user;
      }));
  }
  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    localStorage.removeItem('reportHead');
    this.currentUserSubject.next(null);
  }

  public getToken(): any {
    let jsonObj: any = JSON.parse(localStorage.getItem('currentUser')); // string to generic object first
    if (jsonObj == null)
      return "";
    return jsonObj.result.accessToken;
  }
  ByToken() {
    return this.http.get<any>(this.baseUrl + 'api/Auth/ByToken');
  }
}
