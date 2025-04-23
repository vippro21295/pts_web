import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {
  private user = localStorage.getItem('currentUser');
  private permission=JSON.parse(this.user).result.Permission;
  hrefs:any=[];
  constructor(private router: Router,) { }
  hasPermission(component): boolean {
    this.hrefs=[];
    var Hrefs = this.permission.map(x => {
      return x.Childrens.filter(s=>s.Href !='').map(y => {
          return this.hrefs.push(y.Href);
      });
  });
  let routepath=component.routeConfig.path;
  //debugger
   if(this.hrefs.indexOf('/'+routepath)>-1)
   {
     return true
   }
   else{
      this.router.navigateByUrl('');
    return false;
   }
  };
}
