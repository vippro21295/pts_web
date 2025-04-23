import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { RoleService } from '../../../services/role.service';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  listUser: any;
  @ViewChild('modalCreateUser') public modalCreateUser: ModalDirective;
  imageSrc: string | ArrayBuffer;
  roles: any;
  user= {
    Name:'',
    Email:'',
    PasswordHash:'',
    PhoneNumber:'',
    BranchId:0,
    RoleId:0,
    ManagerId:0
  };
  constructor(private userService:UserService
    ,private roleService:RoleService) { }

  ngOnInit(): void {
    this.loadData();
    this.loadRoles();
  }
  loadData() {
    this.userService.GetUsers().subscribe(respone=>{
      this.listUser=respone.data;
    });
  }
  loadRoles(){
    this.roleService.GetRoles().subscribe(response=>{
      this.roles=response.data;
    });
  }
  readURL(event: any): void {
    if (event.target.files && event.target.files[0]) {
        const file = event.target.files[0];

        const reader = new FileReader();
        reader.onload = e => this.imageSrc = reader.result;

        reader.readAsDataURL(file);
    }
  }
  CreateUser(){
    debugger
    this.userService.SaveUser(this.user).subscribe(respone=>{
      
    });
  }
}
