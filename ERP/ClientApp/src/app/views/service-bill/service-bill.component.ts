import { Component, OnInit } from '@angular/core';
import { ServiceBillService } from '../../services/serviceBill.service';
import { DatePipe } from '@angular/common';
import { ColDef, GridOptions } from 'ag-grid-community';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { LoadingService } from '../../services/loading.service';

@Component({
  selector: 'app-service-bill',
  templateUrl: './service-bill.component.html',
  styleUrls: ['./service-bill.component.scss']
})
export class ServiceBillComponent implements OnInit {
  constructor(
    private _serviceBill: ServiceBillService,
    private router: Router, 
    private title: Title, 
    private loading: LoadingService
  ) { }

  toDate: Date = new Date();
  isType: string = "2";
  objSearch: any = {
    search: "",
    type: "TENKH",
    startTime: new Date(this.toDate.getFullYear(), this.toDate.getMonth(), this.toDate.getDate()),
    endTime: new Date(),
    tuPhieu: "",
    denPhieu: ""
  }

  rowHeight = 30;
  public paginationPageSize = 10;
  public paginationPageSizeSelector: number[] | boolean = [10, 20, 50];
  rowDataFinish: any[] = [];
  rowDataTemp: any[] = [];
  ngOnInit(): void {
    this.title.setTitle("DANH SÁCH PHIẾU DỊCH VỤ");
  }

  search() {
    debugger;
    this.rowDataFinish = [];
    this.rowDataTemp = [];
    this.loading.show();
    this._serviceBill.Search(this.objSearch).subscribe((res) => {
      this.loading.hide();
      if (!res.isError) {
        let data = JSON.parse(res.obj);
        this.rowDataFinish = data.filter((x) => x.IsFinished == true);
        this.rowDataTemp = data.filter((x) => x.IsFinished == false);
        console.log(data);
      }
    });
  }

  create(){
    window.open(`#/bill`, '_blank');
  }

  onCellDoubleClicked(event: any) {
    if (event.data) {
      const rowData = event.data;
      console.log(rowData);
      window.open(`#/bill/${rowData.Bill_no}`, '_blank');
    }
  }

  columnDefs: ColDef[] = [
    {
      headerName: "",
      field: "checkbox",
      width: 40,
      filter: false,
      checkboxSelection: true,
    },
    {
      headerName: "STT",
      field: "STT",
      width: 50,
      filter: false,
    },
    {
      headerName: "SỐ THẺ",
      field: "SoThuTuCho",
      width: 70,
      filter: false,
    },

    {
      headerName: "NGÀY",
      field: "Ngay",
      width: 100,
    },
    {
      headerName: "GIỜ",
      field: "Gio",
      width: 65,
    },
    {
      headerName: "SỐ PHIẾU",
      field: "Bill_no",
      width: 130,
    },

    {
      headerName: "TÊN KHÁCH HÀNG",
      field: "CustName",
      width: 150,
    },
    { headerName: "BIỂN SỐ", field: "NumberPlate", width: 120 },
    {
      headerName: "SỐ KHUNG",
      field: "SoKhung",
      width: 160,
    },
    {
      headerName: "SỐ ĐIỆN THOẠI",
      field: "Phone",
      width: 120,
    },
    {
      headerName: "LOẠI XE",
      field: "Model",
      width: 120,
    },
    {
      headerName: "NV SỬA CHỮA",
      field: "RepairedByName",
      width: 140,
    },
    {
      headerName: "NV CÙNG SỬA",
      field: "RepairedByName2",
      width: 140,
    },
    {
      headerName: "NV TIẾP NHẬN",
      field: "ReceivedByName",
      width: 140,
    },
    {
      headerName: "NV THU NGÂN",
      field: "CashierName",
      width: 150,
    },
    {
      headerName: "NV KIỂM TRA CUỐI",
      field: "CheckByName",
      width: 150,
    },
    {
      headerName: "RÁP",
      field: "RAP",
      width: 120,
    },
    {
      headerName: "KTDK",
      field: "KTDK",
      width: 140,
    },
    {
      headerName: "THU GCN",
      field: "DV_ThuGCN",
      width: 140,
    },
    {
      headerName: "CHI GCN",
      field: "DV_ChiGCN",
      width: 140,
    },
    {
      headerName: "LÃI GCN",
      field: "DV_LaiGCN",
      width: 140,
    },
    {
      headerName: "TIỀN CÔNG SC",
      field: "DV_SC_ThucThu",
      width: 140,
    },
    {
      headerName: "GIẢM GIÁ SC",
      field: "DV_SuaChua_GiamGia_GG",
      width: 140,
    },
    {
      headerName: "TIỀN CÔNG BH",
      field: "DV_SuaChua_BaoHanh",
      width: 140,
    },
    {
      headerName: "TIỀN CÔNG TC",
      field: "DV_SuaChua_ThienChi",
      width: 140,
    },
    {
      headerName: "TIỀN CÔNG KM",
      field: "DV_SuaChua_KhuyenMai",
      width: 140,
    },
    {
      headerName: "TIỀN PTT",
      field: "PT_Thu_PTT",
      width: 140,
    },
    {
      headerName: "TIỀN PTN",
      field: "PT_Thu_PTN",
      width: 140,
    },
    {
      headerName: "TIỀN NHỚT",
      field: "PT_Thu_Nhot",
      width: 140,
    },
    {
      headerName: "THU PTTM",
      field: "PT_Thu_PTTM",
      width: 140,
    },
    {
      headerName: "CHI PTTM",
      field: "PT_Chi_PTTM",
      width: 140,
    },
    {
      headerName: "LÃI PTTM",
      field: "PT_Lai_PTTM",
      width: 140,
    },
    {
      headerName: "GIẢM GIÁ PT",
      field: "PT_GiamGia_GG",
      width: 140,
    },
    {
      headerName: "GG PT BẢO HÀNH",
      field: "PT_BaoHanh",
      width: 140,
    },
    {
      headerName: "GG PT THIỆN CHÍ",
      field: "PT_ThienChi",
      width: 140,
    },
    {
      headerName: "GG PT KHUYẾN MÃI",
      field: "PT_KhuyenMai",
      width: 140,
    },
    {
      headerName: "THỜI GIAN THỰC HIỆN",
      field: "ThoiGianSua",
      width: 140,
    },
    {
      headerName: "TỔNG TIỀN THỰC THU",
      field: "TotalMoney",
      width: 140,
    },
    {
      headerName: "GIẢM GIÁ LT",
      field: "GiamGiaLT",
      width: 140,
    },
    {
      headerName: "THÀNH TIỀN LT",
      field: "TotalAfterRound",
      width: 140,
    },
    {
      headerName: "LOẠI KTC",
      field: "LoaiKiemTraCuoi",
      width: 140,
    },
    {
      headerName: "LẤY LẠI PT CŨ",
      field: "LayLaiPhuTungCu",
      width: 140,
    },

  ];

  defaultColDef: ColDef = {
    sortable: true,
    filter: true,
    resizable: true,
  };

  gridOptionsTemp: GridOptions = {
    columnDefs: this.columnDefs,
    defaultColDef: this.defaultColDef,
  };

  gridOptionsFinish: GridOptions = {
    columnDefs: this.columnDefs,
    defaultColDef: this.defaultColDef,
  };

  public rowSelection: "single" | "multiple" = "multiple";
  currencyFormatter(params) {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(params.value);
  }

  clickTab(tab) {
    for (let i = 1; i <= 3; i++) {
      let element = document.getElementById("tab" + i) as HTMLElement;
      let elementContent = document.getElementById("tabContent" + i) as HTMLElement;
      if (i == tab) {
        element.classList.remove("disableTab");
        element.classList.add("enableTab");
        elementContent.classList.add('show');
        elementContent.classList.add('active');
      } else {
        element.classList.remove("enableTab");
        element.classList.add("disableTab");
        elementContent.classList.remove('show');
        elementContent.classList.remove('active');
      }
    }

    this.isType = "tab" + tab;
  }
}
