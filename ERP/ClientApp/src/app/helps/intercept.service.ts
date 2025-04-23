// Angular
import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
// RxJS
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs'
import { from } from 'rxjs';
import { catchError } from 'rxjs/operators';
/**
 * More information there => https://medium.com/@MetonymyQT/angular-http-interceptors-what-are-they-and-how-to-use-them-52e060321088
 */
@Injectable()
export class InterceptService implements HttpInterceptor {
  constructor(private route: Router, private auth:AuthService) { }

	// intercept request and add token
	intercept(request: HttpRequest<any>,next: HttpHandler): Observable<HttpEvent<any>> {
		// tslint:disable-next-line:no-debugger
    // modify request
    let token = this.auth.getToken();
		request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
			}
		});
		//console.log('----request----');
		 //console.log('--- end of request---');

		return next.handle(request).pipe(
			tap(
				event => {
					if (event instanceof HttpResponse) {
						 //console.log('all looks good');
						// http response status code
					}
				},
				error => {
					var a = error;
					// http response status code
					 //console.log('----response----');
					// tslint:disable-next-line:no-debugger

					if (error.status === 403) {
						//localStorage.clear();
						this.route.navigateByUrl("/page-error");
					}
					else {
						if (error.status == 401) {
							localStorage.clear();
							this.route.navigateByUrl("/login");
						}
					}
				}
			)
		);
	}
}

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
	constructor(private router: Router) { }
	intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		return next.handle(request)
		.pipe(catchError((response: any) => {
				if (response instanceof HttpErrorResponse && response.status == 401) {
					localStorage.removeItem('token');
					this.router.navigateByUrl("/login");
				}
				return Observable.throw(response);
			}))
	}
}
Injectable()
export class CustomHttpInterceptor implements HttpInterceptor {
  constructor(private auth: AuthService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return from(this.handleAccess(request, next));
  }

  private async handleAccess(request: HttpRequest<any>, next: HttpHandler):
    Promise<HttpEvent<any>> {
    let user = this.auth.getToken();
	debugger
    let changedRequest = request;
    // HttpHeader object immutable - copy values
    const headerSettings: { [name: string]: string | string[]; } = {};

    for (const key of request.headers.keys()) {
      headerSettings[key] = request.headers.getAll(key);
    }
    if (user.result.AccessToken) {
      headerSettings['Authorization'] = 'Bearer ' + user.result.AccessToken;
    }
    headerSettings['Content-Type'] = 'application/json';
    const newHeader = new HttpHeaders(headerSettings);

    changedRequest = request.clone({
      headers: newHeader
    });
    return next.handle(changedRequest).toPromise();
  }

}
