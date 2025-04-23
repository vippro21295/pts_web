import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'login.component.html'
})
export class LoginComponent {
  userlogin = { branchId: '', code: '', passwordHash: '' };
  errorMessage: string;

  location = [
    {
      id: "PT1", name: "Phát Tiến 1"
    },
    {
      id: "PT2", name: "Phát Tiến 2"
    },
    {
      id: "PT3", name: "Phát Tiến 3"
    },
    {
      id: "PT4", name: "Phát Tiến 4"
    },
    {
      id: "PT5", name: "Phát Tiến 5"
    },
    {
      id: "PT6", name: "Phát Tiến 6"
    },
    {
      id: "Wing1", name: "Wing 1"
    },
    {
      id: "Wing5", name: "Wing 5"
    }

  ]

  constructor(private auth: AuthService, private router: Router, private toastr: ToastrService, private commonService: CommonService) { }
  login() {
    if (this.validateLogin()) {
      this.auth.login(this.userlogin).subscribe(rep => {
        debugger;
        if (rep.result.success == true) {
          this.getReportHead(rep.result.account.id);
          this.router.navigate(['/']);
        }
        else {
          this.toastr.error("Tài khoản hoặc mật khẩu không chính xác; Vui lòng thử lại", "Thông báo");
        }
      });
    }
  }

  getReportHead(userId) {
    try {
      this.commonService.GetReportHead(userId).subscribe(res => {
        let data = JSON.parse(res);
        localStorage.setItem("reportHead", JSON.stringify(data[0]));
      });
    } catch (e) {
      console.log(e);
    }
  }


  validateLogin() {
    if (this.userlogin.branchId === '' || this.userlogin.branchId === null || this.userlogin.branchId === undefined) {
      this.toastr.warning("Vui lòng chọn cửa hàng đăng nhập", "Thông báo");
      return false;
    }
    if (this.userlogin.code === '' || this.userlogin.code === null || this.userlogin.code === undefined) {
      this.toastr.warning("Vui lòng nhập tên đăng nhập", "Thông báo");
      return false;
    }
    if (this.userlogin.passwordHash === '' || this.userlogin.passwordHash === null || this.userlogin.passwordHash === undefined) {
      this.toastr.warning("Vui lòng nhập mật khẩu", "Thông báo");
      return false;
    }
    return true;
  }
  
}
