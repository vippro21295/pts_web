import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
//import { navItems } from '../../_nav';

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html'
})
export class DefaultLayoutComponent implements OnInit{
  constructor(private authService: AuthService, private router: Router) { }
  public sidebarMinimized = false;
  currentUser = this.authService.currentUserValue;
  //public navItems = navItems;
  navItems=[];
  toggleMinimize(e) {
    this.sidebarMinimized = e;
  }
  ngOnInit(): void {
    //this.byToken();
    console.log(this.currentUser);
  }

  byToken(){
    this.authService.ByToken().subscribe(respone=>{
      debugger
      if(respone.data!=null && respone.data!='')
      {
        this.navItems=respone.data;
      }
      else
      {
        this.logout();
      }
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
