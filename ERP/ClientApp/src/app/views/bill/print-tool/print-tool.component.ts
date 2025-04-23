import { AfterViewInit, Component, DebugElement, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ServiceBillService } from '../../../services/serviceBill.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-print-tool',
  templateUrl: './print-tool.component.html',
  styleUrls: ['./print-tool.component.scss']
})
export class PrintToolComponent implements OnInit, AfterViewInit {
  @ViewChild('htmlprint') printSession!: ElementRef;
  constructor(private serviceBill: ServiceBillService,
    private authService: AuthService
  ) { }

  ngAfterViewInit(): void {

  }
  obj: any = {};
  data: any = [];
  totalQTY: number = 0;
  totalAmount: number = 0;
  currentUser = this.authService.currentUserValue;
  @ViewChild('print') btn: ElementRef;
  ngOnInit(): void {
  }

  addData(obj, lst) {
    this.obj = obj;
    this.data = lst;
    this.obj.NgayIn = new Date();
    this.totalQTY = this.data.reduce((sum, item) => sum + (item.QTY || 0), 0);
    this.totalAmount = this.data.reduce((sum, item) => sum + (item.Amount || 0), 0);
    this.obj.LoaiPhieu = this.data[0].ToolType == 1 ? "PTTT" : "PTPS";
    let objSave: any = {};

    debugger;
    objSave.PrintContent = this.printSession.nativeElement.innerHTML;
    objSave.PrintedBy = this.currentUser.code;
    objSave.Bill_no = this.data[0].ToolType == 1 ? "PTTT-" + this.obj.Bill_NO : "PTPS-" + + this.obj.Bill_NO;

    this.serviceBill.SavePrintTool(objSave).subscribe((res) => {
      if (!res.isError) {
        this.obj.InLan = res.solanin;
        this.obj.NgayIn = res.printDate;
      }
    });
  }

  print() {
    // lưu phiếu in

    this.btn.nativeElement.click();
  }

}
