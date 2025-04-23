import { AfterViewInit, ChangeDetectorRef, Component, DebugElement, ElementRef, OnInit, Pipe, ViewChild } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { ServiceBillService } from '../../services/serviceBill.service';
import { Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth.service';
import { format } from "date-fns";
import { utcToZonedTime } from "date-fns-tz";
import { Guid } from "guid-typescript";
import * as XLSX from "xlsx";
import { ExcelService } from '../../services/excel.service';
import { LoadingService } from '../../services/loading.service';
import { PrintToolComponent } from './print-tool/print-tool.component';
import { CommonService } from '../../services/common.service';
import { DatePipe } from '@angular/common';
import Handsontable from 'handsontable';
import { HotTableRegisterer } from '@handsontable/angular';

declare var $: any;


@Component({
  selector: 'app-bill',
  templateUrl: './bill.component.html',
  styleUrls: ['./bill.component.scss']
})
export class BillComponent implements OnInit, AfterViewInit {
  @ViewChild("child") child: PrintToolComponent;
  ChuSo: string[] = [" không", " một", " hai", " ba", " bốn", " năm", " sáu", " bảy", " tám", " chín"];
  Tien: string[] = ["", " nghìn", " triệu", " tỷ", " nghìn tỷ", " triệu tỷ"];
  lstSuaChuaNang = [
    {
      id: "", name: "(Xác nhận kiểm tra cuối)"
    },
    {
      id: "NANG", name: "Sửa chữa nặng"
    },
    {
      id: "NHE", name: "Sửa chữa nhỏ",
    },
    {
      id: "DAU", name: "Thay dầu",
    }
  ]

  lstCapDo: any = [{ id: 1, name: 1 }, { id: 2, name: 2 }, { id: 3, name: 3 }];

  items = [
    ['Dầu phanh', 'Lốp trước', 'Dây phanh', 'Côn'],
    ['Phanh trước', 'Lốp sau', 'Dầu số', 'Chổi than'],
    ['Phanh sau', 'Dầu máy', 'Dây đai', 'Họng ga'],
    ['Bóng đèn', 'Làm mát', 'Ắc quy', 'Bugi'],
    ['Công tắc', 'Xích', 'Lọc gió'],
    ['Còi', 'Công tơ mét', 'Nhông xích']
  ];

  states = ['O', 'D', 'T', 'V', 'B'];

  checkboxValues: { [key: string]: { [state: string]: boolean } } = {};

  lstProvince: any = [];
  lstDistrict: any = [];
  lstDistrictP: any = [];
  lstModelHonda: any = [];
  lstModelYear: any = [];
  lstAccount: any = [];

  lstServiceList: any = [];
  lstWage: any = [];
  lstSaleOffRs: any = [];
  lstPTTT: any = [];
  lstPTPS: any = [];
  lstPTTool: any = [];
  lstPTTM: any = [];
  lstLoaiKTC: any = [];
  lstLyDoKCSK: any = [];
  lstPTHM: any = [];
  lstNextTool: any = [];
  lstHistory: any = [];

  hiddenLyDoKM: boolean = true;

  objModel: any = {
    TitleongTienDV: 0,
    TongTienPT: 0,
    TongTienGG: 0
  }

  objTotalPTTT: any = {
    totalQTY: 0,
    totalAmount: 0
  }

  objTotalPTPS: any = {
    totalQTY: 0,
    totalAmount: 0
  }

  objPTHM: any = {};
  currentUser = this.authService.currentUserValue;

  objServiceCode: any = {};
  indexServiceCode: number = 0;

  objSpecialTool: any = {};
  indexSpecialTool: number = 0;

  objToolBuy: any = {};
  indexToolBuy: number = 0;

  arrayTest: string[] = [];

  private hotRegisterer = new HotTableRegisterer();
  hotIdWage = 'hotInstanceIdWage';
  hotSettingsWage: Handsontable.GridSettings = {
    data: [],
    colHeaders: ['HẠNG MỤC', 'NỘI DUNG SỬA CHỮA', 'GIÁ BÁN', 'LÝ DO GG', 'SỐ TIỀN GG', 'THÀNH TIỀN', 'CHI GCN', 'BÁO GIÁ', '', '', '', '', '', '', '', '', '', ''],
    columns: [
      { type: 'dropdown', width: 250, className: 'ellipsis-cell', source: [] }, // Cột 0  
      { type: 'text', width: 220, className: 'ellipsis-cell', readOnly: true }, // Cột 1 
      { type: 'numeric', numericFormat: { pattern: '0,0' }, readOnly: true }, //  Cột 2
      { type: 'dropdown', source: [] }, // Cột 3
      { type: 'numeric', numericFormat: { pattern: '0,0' }, readOnly: true, }, // Cột 4
      { type: 'numeric', numericFormat: { pattern: '0,0' }, readOnly: true, },// Cột 5 
      { type: 'numeric', numericFormat: { pattern: '0,0' }, readOnly: true }, // Cột 6
      { type: 'dropdown', source: [] }, // 7
      //-----------------
      { type: 'text' }, // 8
      { type: 'text' }, // 9
      { type: 'text' }, // 10
      { type: 'text' }, // 11
      { type: 'text' }, // 12
      { type: 'numeric' }, // 13
      { type: 'text' }, // 14
      { type: 'text' }, // 15
      { type: 'text' }, // 16
      {
        // Cột 17 - Nút Xóa
        renderer: (instance, td, row, col, prop, value) => {
          td.innerHTML = '<button class="btn btn-danger" style="padding:0px;background-color: transparent;border: none;" ><i style="color:red" class="fa fa-trash"></i></button>';
          td.style.textAlign = 'center';
          td.style.cursor = 'pointer';
          return td;
        }, readOnly: true,
      },
    ],

    hiddenColumns: {
      columns: [8, 9, 10, 11, 12, 13, 14, 15, 16], // Chỉ định ẩn cột 9 và 10
      indicators: false // true nếu bạn muốn có dấu chỉ thị cột ẩn
    },

    beforeChange: (changes, source) => {
      if (source === 'edit' && changes) {
        changes.forEach(change => {
          const [row, prop, oldValue, newValue] = change;
          // Áp dụng cho cột 2 hoặc 4 hoặc 6
          if ((prop === 2 || prop === 4 || prop === 6) && newValue !== null && !isNaN(newValue)) {
            const num = parseFloat(newValue);
            // Chỉ nhân 1000 nếu nhỏ hơn 10000 (tránh lặp lại khi người dùng chỉnh sửa giá trị đã nhân)
            change[3] = num * 1000;
          }
        });
      }
    },

    afterChange: (changes, source) => {
      if (source === 'edit' && changes) {
        const instance = this.hotRegisterer.getInstance(this.hotIdWage);
        changes.forEach(([row, prop, oldVal, newVal]) => {
          // cột hạng mục
          if (prop === 0) {
            let serviceCode = this.lstServiceList.filter(x => x.ServiceName == newVal);
            // lấy dữ liệu từ Service
            let service = serviceCode[0].ServiceCode;
            let arrayKTDK = ["41KTDK", "42KTDK", "43KTDK", "44KTDK", "45KTDK", "46KTDK", "2RAP"];
            let checkExists = this.lstWage.filter(x => x.ServiceCode == service);
            let checkArr = arrayKTDK.filter(x => x == service);
            if (checkExists.length == 0 || (checkExists.length > 0 && checkArr.length == 0)) {
              this.serviceBill.GetServiceCodeModel(service, this.objModel.Model).subscribe(res => {
                if (!res.isError) {
                  let data = JSON.parse(res.obj)[0];
                  if (data) {
                    // nếu loại hạng mục là RB hoặc KTDK thì không cho phép nhập hạng mục là loại RB hoặc KTDK nữa
                    if (data.ServiceType == "RB" || data.ServiceType == "KTDK") {
                      let check_RB_KTDT = this.lstWage.filter(x => x.ServiceType == data.ServiceType);
                      if (check_RB_KTDT.length > 0) {
                        this.toastService.warning("Hạng mục '" + data.ServiceType + "' đã tồn tại. Vui lòng chọn hạng mục khác !!!", "Thông báo");
                        return;
                      }
                    }
                    // có thể sửa nội dung
                    instance.setCellMeta(row, 1, 'readOnly', !data.CanEditNoiDung);
                    instance.setCellMeta(row, 2, 'readOnly', !data.CanEditGiaBan);
                    instance.setCellMeta(row, 3, 'readOnly', !data.CanEditGiamGia);
                    instance.setCellMeta(row, 6, 'readOnly', !data.CanEditGCN);

                    // nội dung các cột
                    instance.setDataAtCell(row, 1, data.ServiceName, 'changes'); // nội dung sửa chữa
                    instance.setDataAtCell(row, 2, data.Price, 'changes'); // giá bán
                    instance.setDataAtCell(row, 3, "----", 'changes'); // lý do giảm giá
                    instance.setDataAtCell(row, 4, 0, 'changes'); // tiền giảm giá
                    instance.setDataAtCell(row, 5, data.Price, 'changes'); // thành tiền
                    instance.setDataAtCell(row, 6, 0, 'changes'); // chi gcn
                    // lấy báo giá cột đầu tiên
                    let baoGia0 = instance.getDataAtCell(0, 7) || this.lstAccount[0].UserName;
                    instance.setDataAtCell(row, 7, baoGia0, 'changes'); // báo giá
                    instance.setDataAtCell(row, 8, data.ServiceType, 'changes'); // ServiceType
                    instance.setDataAtCell(row, 9, Guid.create().toString(), 'changes'); // ID
                    instance.setDataAtCell(row, 10, this.objModel.Bill_NO, 'changes'); // BillNo
                    instance.setDataAtCell(row, 11, this.currentUser.code, 'changes'); // CreatedBy
                    instance.setDataAtCell(row, 12, false, 'changes'); // IsDeleted
                    instance.setDataAtCell(row, 13, data.DepreciationCost, 'changes'); // AgentPrice
                    instance.setDataAtCell(row, 14, this.currentUser.code, 'changes'); // UpdatedBy
                    instance.setDataAtCell(row, 15, baoGia0, 'changes'); // SalesByName
                    instance.setDataAtCell(row, 16, data.AgentPrice, 'changes'); // serviceType
                    instance.selectCell(row, 1);
                  }
                }
              });
            }
          }
          // cột giá bán
          if (prop === 2) {
            const giaBan = parseFloat(instance.getDataAtCell(row, 2)) || 0;
            const thanhTien = giaBan * 1;
            instance.setDataAtCell(row, 5, thanhTien); // Cột Thành Tiền
          }
          // cột lý do giảm giá
          if (prop == 3) {
            if (newVal == "THIỆN CHÍ" || newVal == "BẢO HÀNH" || newVal == "KHUYẾN MÃI") {
              // số tiền giảm giá = giá bán, thành tiền = 0
              const giaBan = parseFloat(instance.getDataAtCell(row, 2)) || 0;
              instance.setDataAtCell(row, 4, giaBan, 'changes'); // Cột giảm giá
              instance.setDataAtCell(row, 5, 0, 'changes'); // Cột Thành Tiền
            }
            else if (newVal == "GIẢM GIÁ" || newVal == "----") {
              const giaBan = parseFloat(instance.getDataAtCell(row, 2)) || 0;
              instance.setDataAtCell(row, 4, 0, 'changes'); // Cột giảm giá
              instance.setDataAtCell(row, 5, giaBan, 'changes'); // Cột Thành Tiền         
            }


            if (newVal == "GIẢM GIÁ") {
              instance.setCellMeta(row, 4, 'readOnly', false);
              instance.selectCell(row, 4);
              // instance.render();
              // instance.updateSettings({}); // Cập nhật lại toàn bộ settings
            }
            else
              instance.setCellMeta(row, 4, 'readOnly', true);
          }
          // cột số tiền giảm giá
          if (prop == 4) {
            const giaBan = parseFloat(instance.getDataAtCell(row, 2)) || 0;
            if (newVal > giaBan) {
              this.toastService.warning("Số tiền giảm giá không thể lớn hơn giá bán", "Thông báo");
              instance.setDataAtCell(row, 5, 0, 'changes'); // Cột Thành Tiền  
              instance.setDataAtCell(row, 4, giaBan, 'changes'); // Cột Thành Tiền  
            } else
              instance.setDataAtCell(row, 5, giaBan - newVal, 'changes'); // Cột Thành Tiền  
          }
        });

        const rowCount = instance.countRows();
        const lastRowData = instance.getDataAtRow(rowCount - 1);

        // Kiểm tra xem dòng cuối có dữ liệu (ít nhất 1 ô không rỗng)
        const hasData = lastRowData.some(cell => cell !== null && cell !== '');

        // Nếu có dữ liệu thì thêm dòng mới
        if (hasData) {
          instance.alter('insert_row');
        }

        // Tính tổng cột THÀNH TIỀN sau khi thay đổi
        setTimeout(() => {
          this.calMoneyDV();
        }, 100);

      }
    },

    afterOnCellMouseDown: (event, coords) => {
      if (coords.col === 17) { // Nếu click vào cột "XÓA" (cột 17)
        this.deleteRowWage(coords.row);
        setTimeout(() => {
          this.calMoneyDV();
        }, 100);
      }
    },
    rowHeaders: true,
    autoWrapRow: true,
    autoWrapCol: true,
    width: '100%',
    height: '200',
    stretchH: 'all', // Giãn đều các cột để lấp đầy không gian
    // autoColumnSize: true,
    licenseKey: 'non-commercial-and-evaluation'
  };

  hotIdPTTT = 'hotInstanceIdPTTT';
  hotSettingsPTTT: Handsontable.GridSettings = {
    data: [],
    colHeaders: ['TÊN PHỤ TÙNG', 'SL', 'Đ.GIÁ', 'T.TIỀN', 'BÁO GIÁ',],
    columns: [
      { type: 'text', width: 180 }, // Cột 0  
      { type: 'numeric', width: 30 }, // Cột 1 
      { type: 'numeric', numericFormat: { pattern: '0,0' } }, //  Cột 2
      { type: 'numeric', numericFormat: { pattern: '0,0' } }, // Cột 3
      { type: 'dropdown', source: [] }, // 4    
      {
        type: 'checkbox',              // Hiển thị checkbox
        title: '#',
        width: 30,
        checkedTemplate: true,        // Giá trị khi được tick
        uncheckedTemplate: false,    // Giá trị khi không tick
        className: 'htCenter' // ✅ Căn giữa nội dung ô    
      }
    ],

    hiddenColumns: {
      columns: [5, 6, 7, 8, 9, 10, 11, 12, 13], // Chỉ định ẩn cột 9 và 10
      indicators: false // true nếu bạn muốn có dấu chỉ thị cột ẩn
    },

    beforeChange: (changes, source) => {
      if (source === 'edit' && changes) {
        changes.forEach(change => {
          const [row, prop, oldValue, newValue] = change;
          // Áp dụng cho cột 2 hoặc 4 hoặc 6
          if ((prop === 2 || prop === 3) && newValue !== null && !isNaN(newValue)) {
            const num = parseFloat(newValue);
            // Chỉ nhân 1000 nếu nhỏ hơn 10000 (tránh lặp lại khi người dùng chỉnh sửa giá trị đã nhân)
            change[3] = num * 1000;
          }
        });
      }
    },

    afterChange: (changes, source) => {
      if (source === 'edit' && changes) {
        const instance = this.hotRegisterer.getInstance(this.hotIdPTTT);
        changes.forEach(([row, prop, oldVal, newVal]) => {
          // cột số lượng
          if (prop === 1) {
            const donGia = parseFloat(instance.getDataAtCell(row, 2)) || 0;
            const thanhTien = donGia * parseInt(newVal);
            instance.setDataAtCell(row, 3, thanhTien, 'changes'); // Cột Thành Tiền
          }
          // cột đơn giá
          if (prop === 2) {
            const sl = parseFloat(instance.getDataAtCell(row, 1)) || 0;
            const thanhTien = sl * newVal;
            instance.setDataAtCell(row, 3, thanhTien, 'changes'); // Cột Thành Tiền
          }
        });

        const rowCount = instance.countRows();
        const lastRowData = instance.getDataAtRow(rowCount - 1);

        // Kiểm tra xem dòng cuối có dữ liệu (ít nhất 1 ô không rỗng)
        const hasData = lastRowData.some(cell => cell !== null && cell !== '');

        // Nếu có dữ liệu thì thêm dòng mới
        if (hasData) {
          instance.alter('insert_row');
        }

        setTimeout(() => {
          this.calMoneyPT("hotInstanceIdPTTT");
        }, 100);
      }
    },

    afterOnCellMouseDown: (event, coords) => {
      if (coords.col === 5) { // Nếu click vào cột "XÓA" (cột 17)

      }
    },
    rowHeaders: true,
    autoWrapRow: true,
    autoWrapCol: true,
    width: '100%',
    height: '150',
    stretchH: 'all', // Giãn đều các cột để lấp đầy không gian
    // autoColumnSize: true,
    licenseKey: 'non-commercial-and-evaluation'
  };

  hotIdPTPS = 'hotInstanceIdPTPS';
  hotSettingsPTPS: Handsontable.GridSettings = {
    data: [],
    colHeaders: ['TÊN PHỤ TÙNG', 'SL', 'Đ.GIÁ', 'T.TIỀN', 'BÁO GIÁ',],
    columns: [
      { type: 'text', width: 180 }, // Cột 0  
      { type: 'numeric', width: 30 }, // Cột 1 
      { type: 'numeric', numericFormat: { pattern: '0,0' } }, //  Cột 2
      { type: 'numeric', numericFormat: { pattern: '0,0' } }, // Cột 3
      { type: 'dropdown', source: [] }, // 4    
      {
        type: 'checkbox',              // Hiển thị checkbox
        title: '#',
        width: 30,
        checkedTemplate: true,        // Giá trị khi được tick
        uncheckedTemplate: false,    // Giá trị khi không tick
        className: 'htCenter' // ✅ Căn giữa nội dung ô    
      }
    ],

    hiddenColumns: {
      columns: [5, 6, 7, 8, 9, 10, 11, 12, 13], // Chỉ định ẩn cột 9 và 10
      indicators: false // true nếu bạn muốn có dấu chỉ thị cột ẩn
    },

    beforeChange: (changes, source) => {
      if (source === 'edit' && changes) {
        changes.forEach(change => {
          const [row, prop, oldValue, newValue] = change;
          // Áp dụng cho cột 2 hoặc 4 hoặc 6
          if ((prop === 2 || prop === 3) && newValue !== null && !isNaN(newValue)) {
            const num = parseFloat(newValue);
            // Chỉ nhân 1000 nếu nhỏ hơn 10000 (tránh lặp lại khi người dùng chỉnh sửa giá trị đã nhân)
            change[3] = num * 1000;
          }
        });
      }
    },

    afterChange: (changes, source) => {
      if (source === 'edit' && changes) {
        const instance = this.hotRegisterer.getInstance(this.hotIdPTPS);
        changes.forEach(([row, prop, oldVal, newVal]) => {
          // cột số lượng
          if (prop === 1) {
            const donGia = parseFloat(instance.getDataAtCell(row, 2)) || 0;
            const thanhTien = donGia * parseInt(newVal);
            instance.setDataAtCell(row, 3, thanhTien, 'changes'); // Cột Thành Tiền
          }
          // cột đơn giá
          if (prop === 2) {
            const sl = parseFloat(instance.getDataAtCell(row, 1)) || 0;
            const thanhTien = sl * newVal;
            instance.setDataAtCell(row, 3, thanhTien, 'changes'); // Cột Thành Tiền
          }
        });

        const rowCount = instance.countRows();
        const lastRowData = instance.getDataAtRow(rowCount - 1);

        // Kiểm tra xem dòng cuối có dữ liệu (ít nhất 1 ô không rỗng)
        const hasData = lastRowData.some(cell => cell !== null && cell !== '');

        // Nếu có dữ liệu thì thêm dòng mới
        if (hasData) {
          instance.alter('insert_row');
        }

        setTimeout(() => {
          this.calMoneyPT("hotInstanceIdPTPS");
        }, 100);
      }
    },

    afterOnCellMouseDown: (event, coords) => {
      if (coords.col === 5) { // Nếu click vào cột "XÓA" (cột 17)

      }
    },
    rowHeaders: true,
    autoWrapRow: true,
    autoWrapCol: true,
    width: '100%',
    height: '150',
    stretchH: 'all', // Giãn đều các cột để lấp đầy không gian
    // autoColumnSize: true,
    licenseKey: 'non-commercial-and-evaluation'
  };



  constructor(
    private route: ActivatedRoute,
    private serviceBill: ServiceBillService,
    private cdref: ChangeDetectorRef,
    private titleService: Title,
    private toastService: ToastrService,
    private authService: AuthService,
    private excelService: ExcelService,
    private loading: LoadingService,
    private commonService: CommonService,
    private datePipe: DatePipe
  ) {
    // Khởi tạo trạng thái checkbox
    this.items.flat().forEach(item => {
      this.checkboxValues[item] = {};
      this.states.forEach(state => {
        this.checkboxValues[item][state] = false;
      });
    });

  }


  ngOnInit(): void {
    this.getInfoControl();
    $('body').removeClass('sidebar-lg-show');
  }

  ngAfterViewInit(): void {
    // lấy dữ liệu phiếu
    this.route.params.subscribe((params) => {
      let id = params["id"];
      setTimeout(() => {
        if (id) {
          this.loading.show();
          this.objModel.Bill_NO = id;
          this.loadBill(id);
          this.cdref.detectChanges();
          this.loading.hide();
        }
        else
          this.loadDefault();
      }, 800);
    });
  }

  updateDropdownSource(hotId, columnIndex: number, newSource: string[]) {
    const hotInstance = this.hotRegisterer.getInstance(hotId);
    if (hotInstance) {
      let currentColumns: any;
      //Copy cấu trúc columns hiện tại
      if (hotId == "hotInstanceIdWage")
        currentColumns = this.hotSettingsWage.columns as Handsontable.ColumnSettings[];
      else if (hotId == "hotInstanceIdPTTT")
        currentColumns = this.hotSettingsPTTT.columns as Handsontable.ColumnSettings[];
      else if (hotId == "hotInstanceIdPTPS")
        currentColumns = this.hotSettingsPTPS.columns as Handsontable.ColumnSettings[];

      const updatedColumns = currentColumns.map((col, index) => {
        if (index === columnIndex) {
          return {
            ...col,
            type: 'dropdown',
            source: newSource
          };
        }
        return col;
      });

      if (hotId == "hotInstanceIdWage")
        this.hotSettingsWage.columns = updatedColumns;
      else if (hotId == "hotInstanceIdPTTT")
        this.hotSettingsPTTT.columns = updatedColumns;
      else if (hotId == "hotInstanceIdPTPS")
        this.hotSettingsPTPS.columns = updatedColumns;

      hotInstance.updateSettings({
        columns: updatedColumns
      });
    }
  }

  loadDefault() {
    this.objModel.CustName = "";
    this.objModel.NumberPlate = "";
    this.objModel.AddressNumber = "";
    this.objModel.Address = "";
    this.objModel.SBH = "";
    this.objModel.InputDate = "";
    this.objModel.InputDateDate = this.datePipe.transform(new Date(), 'dd/MM/yyyy');
    this.objModel.InputDateTime = this.datePipe.transform(new Date(), 'HH:mm');
    this.objModel.Phone = "";
    this.objModel.SK = "";
    this.objModel.SM = "";

    this.objModel.TotalKms = 0;
    this.objModel.TotalPrevKm = 0;
    this.objModel.IsFinished = false;
    this.objModel.DistCode = "";
    this.objModel.Ward = "";

    this.objModel.ExpectedOutDateDate = this.datePipe.transform(new Date(), 'dd/MM/yyyy');
    this.objModel.ExpectedOutDateTime = this.datePipe.transform(new Date(), 'HH:mm');
    this.objModel.BuyDate = this.datePipe.transform(new Date(), 'dd/MM/yyyy');
    this.objModel.Model = "";
    this.objModel.ModelYear = "";
    this.objModel.SoThuTuCho = "";
    this.objModel.FuelLevel = 50;
    this.objModel.CustomerRequest = this.converComment("");
    this.objModel.CustomerRequest_Copy = this.converComment("");
    this.objModel.MotorStatus = this.converComment("");
    this.objModel.MotorStatus_Copy = this.converComment("");
    this.objModel.MotorStatusBefore = this.converComment("");
    this.objModel.FinishDate = new Date();
    this.objModel.CreatedDate = new Date();
    this.objModel.OutputDateDate = this.datePipe.transform(new Date(), 'dd/MM/yyyy');
    this.objModel.OutputDateTime = this.datePipe.transform(new Date(), 'HH:mm');
    this.objModel.RepairDate = new Date();
    this.objModel.LayLaiPhuTungCu = "N";
    this.objModel.ReceivedBy = 0;
    this.objModel.RepairedBy = 0;
    this.objModel.CheckBy = 0;
    this.objModel.Cashier = 0;
    this.objModel.RepairedBy2 = 0;
    this.objModel.GhiChuLyDoKCSK = "";
    this.objModel.LoaiKiemTraCuoi = "";
    this.objModel.MaLyDoKhongCoSoKhung = "KHAC";
    this.objModel.XacNhanSuaChua = "";
    this.objModel.Description = "";
    this.objModel.ProvinceCode = this.currentUser.branchId == "PT2" ? "32" : "16";
    this.lstDistrictP = this.lstDistrict.filter(x => x.P_CODE == parseInt(this.objModel.ProvinceCode));
    this.objModel.LyDoSaiSoKM = "";
    this.hiddenLyDoKM = true;
    this.titleService.setTitle("TẠO PHIẾU DỊCH VỤ PTS");
    this.cdref.detectChanges();
  }

  getInfoControl() {
    this.serviceBill.LoadDefaultData().subscribe((res) => {
      if (!res.isError) {
        this.lstProvince = JSON.parse(res.lstProvince);
        this.lstDistrict = JSON.parse(res.lstDistrict);
        this.lstModelHonda = JSON.parse(res.lstModelHonda);
        this.lstModelYear = JSON.parse(res.lstModelYear);
        this.lstAccount = JSON.parse(res.lstAccount);
        this.lstServiceList = JSON.parse(res.lstServiceList);
        this.lstSaleOffRs = JSON.parse(res.lstSaleOffRs);
        this.lstLoaiKTC = JSON.parse(res.lstLoaiKTC);
        this.lstLyDoKCSK = JSON.parse(res.lstLyDoKCSK);
        this.lstNextTool = JSON.parse(res.lstNextTool);

        setTimeout(() => {
          this.updateDropdownSource('hotInstanceIdWage', 0, this.lstServiceList.map(item => item.ServiceName)); // cập nhật cột 0
          this.updateDropdownSource('hotInstanceIdWage', 3, this.lstSaleOffRs.map(item => item.text)); // cập nhật cột 3
          this.updateDropdownSource('hotInstanceIdWage', 7, this.lstAccount.map(item => item.UserName)); // cập nhật cột 2

          this.updateDropdownSource('hotInstanceIdPTTT', 4, this.lstAccount.map(item => item.UserName)); // cập nhật cột 2
          this.updateDropdownSource('hotInstanceIdPTPS', 4, this.lstAccount.map(item => item.UserName));
        }, 500)
      }
    });
  }

  loadBill(id) {
    this.serviceBill.LoadDataBillNo(id).subscribe(res => {
      if (!res.isError) {
        this.lstDistrictP = this.lstDistrict.filter(x => x.P_CODE == res.obj.provinceCode);
        this.objModel.CustName = res.obj.custName;
        this.objModel.NumberPlate = res.obj.numberPlate;
        this.objModel.AddressNumber = res.obj.addressNumber;
        this.objModel.Address = res.obj.address;
        this.objModel.SBH = res.obj.sbh;
        let inputDate = new Date(res.obj.inputDate);
        this.objModel.InputDateDate = this.datePipe.transform(inputDate, "dd/MM/yyyy");
        this.objModel.InputDateTime = this.datePipe.transform(inputDate, "HH:mm");
        this.objModel.Phone = res.obj.phone;
        if (res.obj.machineCode != null) {
          let machineCode = res.obj.machineCode.toString().split('/');
          this.objModel.SK = machineCode[0];
          this.objModel.SM = machineCode[1];
        } else {
          this.objModel.SK = "";
          this.objModel.SM = "";
        }

        this.objModel.TotalKms = res.obj.totalKms;
        this.objModel.TotalPrevKm = res.obj.totalPrevKm;
        this.objModel.IsFinished = res.obj.isFinished;
        this.objModel.DistCode = res.obj.distCode == null ? 0 : res.obj.distCode.toString();
        this.objModel.Ward = res.obj.ward ?? 0;
        let expectedOutDate = new Date(res.obj.expectedOutDate);
        this.objModel.ExpectedOutDateDate = this.datePipe.transform(expectedOutDate, "dd/MM/yyyy");
        this.objModel.ExpectedOutDateTime = this.datePipe.transform(expectedOutDate, "HH:mm");
        this.objModel.BuyDate = this.datePipe.transform(new Date(res.obj.buyDate), "dd/MM/yyyy");
        this.objModel.Model = res.obj.model;
        this.objModel.ModelYear = res.obj.modelYear;
        this.objModel.SoThuTuCho = res.obj.soThuTuCho;
        this.objModel.FuelLevel = res.obj.fuellevel;
        this.objModel.CustomerRequest = this.converComment(res.obj.customerRequest);
        this.objModel.CustomerRequest_Copy = this.converComment(res.obj.customerRequest_Copy);
        this.objModel.MotorStatus = this.converComment(res.obj.motorStatus);
        this.objModel.MotorStatus_Copy = this.converComment(res.obj.motorStatus_Copy);
        this.objModel.MotorStatusBefore = this.converComment(res.obj.motorStatusBefore);
        this.objModel.FinishDate = new Date(res.obj.finishDate);
        this.objModel.CreatedDate = new Date(res.obj.createdDate);
        this.objModel.OutputDate = new Date(res.obj.outputDate);
        this.objModel.RepairDate = new Date(res.obj.repairDate);
        this.objModel.LayLaiPhuTungCu = res.obj.layLaiPhuTungCu;
        this.objModel.ReceivedBy = res.obj.receivedBy == null ? 0 : res.obj.receivedBy.toString();
        this.objModel.RepairedBy = res.obj.repairedBy == null ? 0 : res.obj.repairedBy.toString();
        this.objModel.CheckBy = res.obj.checkBy == null ? 0 : res.obj.checkBy.toString();
        this.objModel.Cashier = res.obj.cashier == null ? 0 : res.obj.cashier.toString();
        this.objModel.RepairedBy2 = res.obj.repairedBy2 == null ? 0 : res.obj.repairedBy2.toString();
        this.objModel.TenLyDoKhongCoSoKhung = res.obj.tenLyDoKhongCoSoKhung;
        this.objModel.LoaiKiemTraCuoi = res.obj.loaiKiemTraCuoi;
        this.objModel.MaLyDoKhongCoSoKhung = res.obj.maLyDoKhongCoSoKhung;
        this.objModel.XacNhanSuaChua = res.obj.xacNhanSuaChua;
        this.objModel.Description = res.obj.description;
        this.objModel.LyDoSaiSoKM = res.obj.lyDoSaiSoKM == null ? "" : res.obj.lyDoSaiSoKM;
        if (this.objModel.LyDoSaiSoKM.length > 0 || this.objModel.TotalPrevKm > this.objModel.TotalKms)
          this.hiddenLyDoKM = false;
        this.objModel.ProvinceCode = res.obj.provinceCode == null ? 0 : res.obj.provinceCode.toString();
        //dtWage
        this.lstWage = JSON.parse(res.dtWage);
        let dataWage = this.lstWage.map(item => [
          item.ServiceCode + "-" + item.ServiceName,
          item.Comment,
          item.Price,
          this.getSaleOffReason(item.SaleOffReason),
          item.SaleOff,
          item.Amount,
          item.OutPaid,
          this.getUserName(item.SaleBy), // 7
          item.ServiceType, // 8
          item.ID,   // 9     
          item.Bill_No, // 10
          item.CreatedBy, // 11
          item.IsDeleted,
          item.DepreciationCost, // 13
          item.UpdatedBy, // 14
          item.SaleByName, // 15
          item.AgentPrice // 16
        ]);

        const finalDataWage = dataWage.length > 0 ? [...dataWage, Array(17).fill('')] : [Array(17).fill('')];
        const instanceWage = this.hotRegisterer.getInstance(this.hotIdWage);
        if (instanceWage) {
          instanceWage.loadData(finalDataWage);
          this.calMoneyDV();
        }
        else
          // Trường hợp hotInstance chưa sẵn sàng thì gán vào hotSettingsWage
          this.hotSettingsWage.data = finalDataWage;
        //--------------------------------------------------

        //dtPTTT
        this.lstPTTT = JSON.parse(res.dtPTTT);
        let dataPTTT = this.lstPTTT.map(item => [
          item.Part_Name,
          item.QTY,
          item.Price_After_Discount,
          item.Amount,
          this.getUserName(item.SaleBy)
        ]);
        const finalDataPTTT = dataPTTT.length > 0 ? [...dataPTTT, Array(17).fill('')] : [Array(17).fill('')];
        const instancePTTT = this.hotRegisterer.getInstance(this.hotIdPTTT);
        if (instancePTTT) {
          instancePTTT.loadData(finalDataPTTT);
          this.calMoneyPT("hotInstanceIdPTTT");
        }
        //-------------------------------------------------

        //dtPTPS
        this.lstPTPS = JSON.parse(res.dtPTPS);
        let dataPTPS = this.lstPTPS.map(item => [
          item.Part_Name,
          item.QTY,
          item.Price_After_Discount,
          item.Amount,
          this.getUserName(item.SaleBy)
        ]);
        const finalDataPTPS = dataPTPS.length > 0 ? [...dataPTPS, Array(17).fill('')] : [Array(17).fill('')];

        // const finalDataPTPS = dataPTPS;
        const instancePTPS = this.hotRegisterer.getInstance(this.hotIdPTPS);
        if (instancePTPS) {
          instancePTPS.loadData(finalDataPTPS);
          this.calMoneyPT("hotInstanceIdPTPS");
        }
        //-------------------------------------------------


        this.ptToolLFinish(JSON.parse(res.dtPTTool));
        this.lstPTTM = JSON.parse(res.dtPTTM);

        let dataPTHM = JSON.parse(res.dtPTHM);

        if (dataPTHM.length > 0) {
          this.lstPTHM = JSON.parse(res.dtPTHM)[0];
          if (this.isNotNullOrEmpty(this.lstPTHM) && this.isNotNullOrEmpty(this.lstPTHM.RuaXe))
            this.objModel.RuaXe = this.xuLyRuaXe(this.lstPTHM.RuaXe);

          // xử lý phụ tùng hao mòn
          this.phuTungHaoMon(this.lstPTHM);

          // xử lý hạng mục lần tới
          this.hangMucLanToi(this.lstPTHM);
        }

        // xử lý phụ tùng tự mua 
        this.phuTungTuMua();

        // xử lý table hạng mục sửa chửa
        this.lstWage = this.lstWage.map(item => ({ ...item, IsEditComment: true, IsEditPrice: false, IsEditSafeOff: false, IsEditOutPaid: false }));

        // xử lý table PTTT, PTPS
        this.lstPTTT = this.lstPTTT.map(item => ({ ...item, IsCheck: false }));
        this.lstPTPS = this.lstPTPS.map(item => ({ ...item, IsCheck: false }));

        this.calcAmount();
        this.setTitle(id, this.objModel.CustName, this.objModel.Phone);
      }
    })
  }

  changeNumberPlate() {
    let nbp = this.objModel.NumberPlate.toString();
    if ((this.isNotNullOrEmpty(nbp) && !nbp.includes("RAP")) && !this.isNotNullOrEmpty(this.objModel.Bill_NO)) {
      nbp = nbp.replace("-", "");
      nbp = nbp.replace(" ", "");
      let number = nbp.toString().substring(0, 4) + "-" + nbp.toString().substring(4, nbp.length);
      this.objModel.NumberPlate = number.toUpperCase();

      // lấy thông tin khách hàng
      this.loading.show();
      this.serviceBill.GetLastCustomerInfoFromAllStore(number).subscribe(res => {
        this.loading.hide();
        if (!res.isError) {
          let data = JSON.parse(res.obj)[0];
          this.lstDistrictP = this.lstDistrict.filter(x => x.P_CODE == data.ProvinceCode);
          this.objModel.CustName = data.CustName;
          this.objModel.SBH = data.SBH;
          this.objModel.Phone = data.Phone;
          this.objModel.AddressNumber = data.AddressNumber;
          this.objModel.Address = data.Address;
          this.objModel.Ward = data.Ward;
          this.objModel.ProvinceCode = data.ProvinceCode.toString();
          this.objModel.DistCode = data.DistCode.toString();
          this.objModel.Model = data.Model;
          let SKSM = data.MachineCode.toString().split("/");
          this.objModel.SK = SKSM[0];
          this.objModel.SM = SKSM[1];
          this.objModel.TotalPrevKm = data.TotalKms.toString().replace(".", "").replace(",", "");
          if (parseInt(this.objModel.TotalPrevKm) > 0)
            this.hiddenLyDoKM = false;
          this.changeSK(SKSM[0]);
        } else {
          this.toastService.warning(res.msg, "Thông báo");
          this.loadDefault();
          this.objModel.NumberPlate = number.toUpperCase();
        }
      });
    }

    // focus sbh
    $('#sbh').focus();
  }

  changeSK(event) {
    if (event.length == 0)
      this.objModel.MaLyDoKhongCoSoKhung = "KHAC";
    else
      this.objModel.MaLyDoKhongCoSoKhung = "";
  }

  searchNumberPlate() {
    this.loading.show();
    this.serviceBill.SearchNumberPlate(this.objModel.NumberPlate, "").subscribe(res => {
      this.loading.hide();
      if (!res.isError) {
        this.lstHistory = JSON.parse(res.lstobj);
        $('#popupHistory').modal('show');
      } else
        this.toastService.warning("Không tìm thấy lịch sử sửa chữa của xe này !!!", "Thông báo");
    })
  }

  searchPhone() {
    this.loading.show();
    this.serviceBill.SearchNumberPlate("", this.objModel.Phone).subscribe(res => {
      this.loading.hide();
      if (!res.isError) {
        this.lstHistory = JSON.parse(res.lstobj);
        $('#popupHistory').modal('show');
      } else
        this.toastService.warning("Không tìm thấy lịch sử sửa chữa của xe này !!!", "Thông báo");
    })
  }

  changeKM(event) {
    if (event < this.objModel.TotalPrevKm)
      this.hiddenLyDoKM = false;
    else
      this.hiddenLyDoKM = true;
  }

  xuLyRuaXe(ruaXe) {
    let data = ruaXe.toString().split(";");
    if (data[0].length == 1)
      return "T";
    if (data[1].length == 1)
      return "S";
    if (data[2].length == 1)
      return "K";
  }

  converComment(comment) {
    if (comment === undefined || comment === null || comment === "") {
      return "";
    }

    let data = comment.toString().split("@#)");
    if (data.length == 2)
      return data[1];
    else
      comment;
  }

  hangMucLanToi(obj) {

    let hangMucLanToi = [];
    let hangMucLanToi2 = [];
    let hangMucLanToi3 = [];
    let hangMucLanToi4 = [];
    let hangMucLanToi5 = [];

    if (obj.HangMucKiemTraLanToi != null) {
      hangMucLanToi = obj.HangMucKiemTraLanToi.toString().split("@12#@");
      if (hangMucLanToi.length == 4) {
        this.objPTHM.hangMucLanToi = hangMucLanToi[0].toString();
        this.objPTHM.thoiGianLanToi = this.formatThoiGianLanToi(hangMucLanToi[1].toString());
        this.objPTHM.kmLanToi = hangMucLanToi[2].toString();
        this.objPTHM.capDoLanToi = hangMucLanToi[3].toString();
      }
    }


    if (obj.HangMucKiemTraLanToi2 != null) {
      hangMucLanToi2 = obj.HangMucKiemTraLanToi2.toString().split("@12#@");
      if (hangMucLanToi2.length == 4) {
        this.objPTHM.hangMucLanToi2 = hangMucLanToi2[0].toString();
        this.objPTHM.thoiGianLanToi2 = this.formatThoiGianLanToi(hangMucLanToi2[1].toString());
        this.objPTHM.kmLanToi2 = hangMucLanToi2[2].toString();
        this.objPTHM.capDoLanToi2 = hangMucLanToi2[3].toString();
      }
    }

    if (obj.HangMucKiemTraLanToi3 != null) {
      hangMucLanToi3 = obj.HangMucKiemTraLanToi3.toString().split("@12#@");
      if (hangMucLanToi3.length == 4) {
        this.objPTHM.hangMucLanToi3 = hangMucLanToi3[0].toString();
        this.objPTHM.thoiGianLanToi3 = this.formatThoiGianLanToi(hangMucLanToi3[1].toString());
        this.objPTHM.kmLanToi3 = hangMucLanToi3[2].toString();
        this.objPTHM.capDoLanToi3 = hangMucLanToi3[3].toString();
      }
    }

    if (obj.HangMucKiemTraLanToi4 != null) {
      hangMucLanToi4 = obj.HangMucKiemTraLanToi4.toString().split("@12#@");
      if (hangMucLanToi4.length == 4) {
        this.objPTHM.hangMucLanToi4 = hangMucLanToi4[0].toString();
        this.objPTHM.thoiGianLanToi4 = this.formatThoiGianLanToi(hangMucLanToi4[1].toString());
        this.objPTHM.kmLanToi4 = hangMucLanToi4[2].toString();
        this.objPTHM.capDoLanToi4 = hangMucLanToi4[3].toString();
      }
    }

    if (obj.HangMucKiemTraLanToi5 != null) {
      hangMucLanToi5 = obj.HangMucKiemTraLanToi5.toString().split("@12#@");
      if (hangMucLanToi5.length == 4) {
        this.objPTHM.hangMucLanToi5 = hangMucLanToi5[0].toString();
        this.objPTHM.thoiGianLanToi5 = this.formatThoiGianLanToi(hangMucLanToi5[1].toString());
        this.objPTHM.kmLanToi5 = hangMucLanToi5[2].toString();
        this.objPTHM.capDoLanToi5 = hangMucLanToi5[3].toString();
      }
    }
  }

  formatThoiGianLanToi(input) {
    if (input.toString().includes("/")) {
      var data = input.toString().split("/");
      return new Date(data[2] * 1, data[1] * 1, data[0] * 1);
    }
    else {
      var data = input.toString().split("-");
      return new Date(data[2] * 1, data[1] * 1, data[0] * 1);
    }
  }

  phuTungHaoMon(obj: any) {
    this.setCheckValuePT(obj.DauPhanh, 'Dauphanh');
    this.setCheckValuePT(obj.PhanhTruoc, 'Phanhtruoc');
    this.setCheckValuePT(obj.PhanhSau, 'Phanhsau');
    this.setCheckValuePT(obj.BongDen, 'Bongden');
    this.setCheckValuePT(obj.CongTac, 'Congtac');
    this.setCheckValuePT(obj.Coi, 'Coi');
    this.setCheckValuePT(obj.LopTruoc, 'Loptruoc');
    this.setCheckValuePT(obj.LopSau, 'Lopsau');
    this.setCheckValuePT(obj.DauMay, 'Daumay');
    this.setCheckValuePT(obj.LamMat, 'Lammat');
    this.setCheckValuePT(obj.Xich, 'Xich');
    this.setCheckValuePT(obj.CongToMet, 'Congtomet');
    this.setCheckValuePT(obj.DayPhanh, 'Dayphanh');
    this.setCheckValuePT(obj.DauSo, 'Dauso');
    this.setCheckValuePT(obj.DayDai, 'Daydai');
    this.setCheckValuePT(obj.AcQuy, 'Acquy');
    this.setCheckValuePT(obj.LocGio, 'Locgio');
    this.setCheckValuePT(obj.NhongXich, 'Nhongxich');
    this.setCheckValuePT(obj.Con, 'Con');
    this.setCheckValuePT(obj.ChoiThan, 'Choithan');
    this.setCheckValuePT(obj.HongGa, 'Hongga');
    this.setCheckValuePT(obj.Bugi, 'Bugi');
  }

  phuTungTuMua() {
    this.lstPTTM.forEach((ele) => {
      ele.interest = ele.Price_After_Discount - ele.OriginalPrice;
      ele.interestAmount = ele.interest * parseInt(ele.QTY);
    })
  }

  setCheckValuePT(obj, name) {
    let splitData = obj.split(";");
    splitData.forEach((value, index) => {
      if (value != "") {
        switch (index) {
          case 0:
            $('#chk_' + name + '_O').prop('checked', 'true');
            break;
          case 1:
            $('#chk_' + name + '_D').prop('checked', 'true');
            break;
          case 2:
            $('#chk_' + name + '_T').prop('checked', 'true');
            break;
          case 3:
            $('#chk_' + name + '_V').prop('checked', 'true');
            break;
          case 4:
            $('#chk_' + name + '_B').prop('checked', 'true');
            break;
        }
      }
    })
  }

  getCheckValuePT(name) {
    let data = "";
    this.states.forEach((value) => {
      let idDOM = "#chk_" + name + "_" + value;
      if ($(idDOM).is(':checked'))
        data = data + value + ";";
      else
        data = data + ";";
    });
    data = data.substring(0, data.length - 1);
    return data;
  }



  save(temp: boolean) {
    if (this.objModel.IsFinished) {
      this.toastService.warning("Phiếu đã hoàn thành, không được tác động !!!", "Thông báo");
      return;
    }
    else // phiếu tạm
    {
      if (this.validator(temp)) {
        this.saveCustomer(temp);
      }
    }
  }

  testAPI() {
    this.serviceBill.GetToolListHMS("", "");
  }

  saveCustomer(temp) {

    // lấy tiền tất cả hạng mục
    let TwageAmount = 0; // tổng thành tiền
    let ToutPaid = 0; // tổng tiền gia công ngoài
    let TaPrice = 0; // tổng tiền công thợ
    let TongLaiGCN = 0; // tổng lãi GCN

    let lstWageCopy = this.processWage();

    lstWageCopy.forEach((r: any) => {
      if (r.ServiceCode) {
        r.Amount = r.Amount || 0;
        r.OutPaid = r.OutPaid || 0;
        r.Price = r.Price || 0;
        r.SaleOff = r.SaleOff || 0;

        TwageAmount += parseFloat(r.Amount);
        ToutPaid += parseFloat(r.OutPaid);

        let serviceType = r.ServiceType;
        let AgentPrice = r.AgentPrice;
        let Price = r.Price;
        let outPaid = r.OutPaid;
        let chiGCN = this.isNumeric(outPaid) ? parseFloat(outPaid) : 0;
        let thuGCN = this.isNumeric(Price) ? parseFloat(Price) : 0;
        let LaiGCN = thuGCN - chiGCN;

        let aPrice = 0;
        if (serviceType === "RB" || serviceType === "KTDK") {
          aPrice = this.isNumeric(AgentPrice) ? parseFloat(AgentPrice) : 0;
        } else if (serviceType === "SC" || serviceType === "HMK") {
          aPrice = this.isNumeric(Price) ? parseFloat(Price) : 0;
        } else if (serviceType === "GCN") {
          aPrice = LaiGCN;
        }
        TaPrice += aPrice;
        TongLaiGCN += LaiGCN;
      }
    });

    let OilPaid = 0;
    let toolAmount = 0;

    this.lstPTTool.forEach((r: any) => {
      if (r.Amount && this.isNumeric(r.Amount)) {
        toolAmount += parseFloat(r.Amount);
      }
      if (r.IsOilT && (r.IsOilT.toString() === "1" || r.IsOilT.toString() === "True")) {
        OilPaid += parseFloat(r.Amount);
      }
    });

    let TuMuaAmount = 0;
    let TongLaiPTTM = 0; // tổng lãi PTTM
    this.lstPTTM.forEach((r: any) => {
      if (r.SalePriceTM && this.isNumeric(r.SalePriceTM) && r.QTYTM && this.isNumeric(r.QTYTM)) {
        TuMuaAmount += parseFloat(r.SalePriceTM) * parseFloat(r.QTYTM);
      }
      if (r.interestAmountTM && this.isNumeric(r.interestAmountTM)) {
        TongLaiPTTM += parseFloat(r.interestAmountTM);
      }
    });

    let objSave = Object.assign({}, this.objModel);

    objSave.BuyDate = this.checkAndConvertDate(objSave.BuyDate);
    objSave.CreatedDate = this.checkAndConvertDate(objSave.CreatedDate);
    objSave.FinishDate = this.checkAndConvertDate(objSave.FinishDate);
    objSave.InputDate = this.checkAndConvertDate(objSave.InputDate);
    objSave.OutputDate = this.checkAndConvertDate(objSave.OutputDate);
    objSave.ExpectedOutDate = this.checkAndConvertDate(objSave.ExpectedOutDate);
    objSave.RepairDate = this.checkAndConvertDate(objSave.RepairDate);

    objSave.DistCode = objSave.DistCode === undefined ? 0 : parseInt(objSave.DistCode);
    objSave.ReceivedBy = objSave.ReceivedBy === undefined ? 0 : parseInt(objSave.ReceivedBy);
    objSave.RepairedBy = objSave.RepairedBy === undefined ? 0 : parseInt(objSave.RepairedBy);
    objSave.RepairedBy2 = objSave.RepairedBy2 === undefined ? 0 : parseInt(objSave.RepairedBy2);
    objSave.CheckBy = objSave.CheckBy === undefined ? 0 : parseInt(objSave.CheckBy);
    objSave.Cashier = objSave.Cashier === undefined ? 0 : parseInt(objSave.Cashier);
    objSave.ProvinceCode = objSave.ProvinceCode === undefined ? 0 : parseInt(objSave.ProvinceCode);

    objSave.ServicePaid = TwageAmount; // tong tien hang muc dich vu
    objSave.RepairPaid = TaPrice; // tong tien cong tho
    objSave.ToolPaid = toolAmount + TuMuaAmount; // tong tien phu tung
    objSave.OutPaid = ToutPaid; // tong tien GCN
    objSave.TotalMoney = TwageAmount + toolAmount + TuMuaAmount; // tong thanh tien
    objSave.TotalLaiGCN = TongLaiGCN;
    objSave.TotalLaiPTTM = TongLaiPTTM;
    objSave.OilPaid = OilPaid;
    objSave.IsOpening = false;

    objSave.IsFinished = temp;

    objSave.CustomerRequest = objSave.CustomerRequest.length > 0 ? (this.currentUser.code + "-update@#)" + objSave.CustomerRequest) : "";
    objSave.CustomerRequest_Copy = objSave.CustomerRequest_Copy.length > 0 ? (this.currentUser.code + "-update@#)" + objSave.CustomerRequest_Copy) : "";
    objSave.MotorStatus = objSave.MotorStatus.length > 0 ? (this.currentUser.code + "-update@#)" + objSave.MotorStatus) : "";
    objSave.MotorStatus_Copy = objSave.MotorStatus_Copy.length > 0 ? (this.currentUser.code + "-update@#)" + objSave.MotorStatus_Copy) : "";
    objSave.MotorStatusBefore = objSave.MotorStatusBefore.length > 0 ? (this.currentUser.code + "-update@#)" + objSave.MotorStatusBefore) : "";

    objSave.TotalAfterRound = 0;
    objSave.MachineCode = objSave.SK + "/" + objSave.SM;
    // check lý do không có số khung
    this.vadidateSK();

    // phụ tùng hao mòn
    if (!this.checkServiceBillObj())
      return;

    objSave.UpdatedBy = this.currentUser.code;
    objSave.CreatedBy = this.currentUser.code;
    objSave.QOT_NO = objSave.Bill_NO;

    // xử lý phụ tùng thay thế, phụ tùng phát sinh
    let lstSpecialTool = this.specialTool();
    if (lstSpecialTool === null)
      return;

    // xử lý phụ tùng tự mua
    if (!this.toolInBillBuy())
      return;

    let dataToolInBill = this.toolInBill();

    this.serviceBill.SaveServiceBill(objSave, lstWageCopy, lstSpecialTool, dataToolInBill, this.lstPTTM, this.objPTHM).subscribe(res => {
      if (!res.isError) {
        // this.loadBill(objSave.Bill_NO);
        // 
        location.reload();
      }

    });

  }

  checkAndConvertDate(inputDate) {
    if (inputDate === undefined || inputDate === null || inputDate === "")
      return null;
    else {
      let bangkokTime = utcToZonedTime(inputDate, "Asia/Bangkok");
      return format(bangkokTime, "yyyy-MM-dd'T'HH:mm:ssXXX");
    }
  }


  vadidateSK() {
    const pattern = /^[M|R|Z]([A-Za-z]{4})(\w{12})$/;
    const inputValue = this.objModel.SK || '';

    if (!pattern.test(inputValue)) {
      if (this.objModel.MaLyDoKhongCoSoKhung.trim().toUpperCase() === 'KHAC') {
        this.objModel.TenLyDoKhongCoSoKhung = this.objModel.TenLyDoKhongCoSoKhung;
      } else {
        this.objModel.TenLyDoKhongCoSoKhung = this.objModel.value;
      }
    } else {
      this.objModel.TenLyDoKhongCoSoKhung = "";
      this.objModel.MaLyDoKhongCoSoKhung = "";
    }
  }

  checkServiceBillObj() {
    // phụ tùng hao mòn
    this.objPTHM.Bill_No = this.objModel.Bill_NO;
    this.objPTHM.DauPhanh = this.getCheckValuePT("Dauphanh");
    this.objPTHM.PhanhTruoc = this.getCheckValuePT('Phanhtruoc');
    this.objPTHM.PhanhSau = this.getCheckValuePT('Phanhsau');
    this.objPTHM.BongDen = this.getCheckValuePT('Bongden');
    this.objPTHM.CongTac = this.getCheckValuePT('Congtac');
    this.objPTHM.Coi = this.getCheckValuePT('Coi');
    this.objPTHM.LopTruoc = this.getCheckValuePT('Loptruoc');
    this.objPTHM.LopSau = this.getCheckValuePT('Lopsau');
    this.objPTHM.DauMay = this.getCheckValuePT('Daumay');
    this.objPTHM.LamMat = this.getCheckValuePT('Lammat');
    this.objPTHM.Xich = this.getCheckValuePT('Xich');
    this.objPTHM.CongToMet = this.getCheckValuePT('Congtomet');
    this.objPTHM.DayPhanh = this.getCheckValuePT('Dayphanh');
    this.objPTHM.DauSo = this.getCheckValuePT('Dauso');
    this.objPTHM.DayDai = this.getCheckValuePT('Daydai');
    this.objPTHM.AcQuy = this.getCheckValuePT('Acquy');
    this.objPTHM.LocGio = this.getCheckValuePT('Locgio');
    this.objPTHM.NhongXich = this.getCheckValuePT('Nhongxich');
    this.objPTHM.Con = this.getCheckValuePT('Con');
    this.objPTHM.ChoiThan = this.getCheckValuePT('Choithan');
    this.objPTHM.HongGa = this.getCheckValuePT('Hongga');
    this.objPTHM.Bugi = this.getCheckValuePT('Bugi');

    if (!this.kiemTraTG_KM_CapDo(""))
      return false;
    if (!this.kiemTraTG_KM_CapDo("2"))
      return false;
    if (!this.kiemTraTG_KM_CapDo("3"))
      return false;
    if (!this.kiemTraTG_KM_CapDo("4"))
      return false;
    if (!this.kiemTraTG_KM_CapDo("5"))
      return false;

    let ruaXe = "";
    switch (this.objModel.RuaXe) {
      case "T":
        ruaXe = "T;;";
        break;
      case "S":
        ruaXe = ";S;";
        break;
      case "K":
        ruaXe = ";;K";
        break;
    }

    this.objPTHM.RuaXe = ruaXe;
    this.objPTHM.LayLaiPhuTungCu = this.objModel.LayLaiPhuTungCu;
    return true;
  }

  kiemTraTG_KM_CapDo(level) {
    let propName = `hangMucLanToi${level}`;
    let value = this.objPTHM[propName];
    if (this.isNotNullOrEmpty(value)) {
      let propThoiGian = `thoiGianLanToi${level}`;
      let valueThoiGian = this.objPTHM[propThoiGian];

      let propKM = `kmLanToi${level}`;
      let valueKM = this.objPTHM[propKM];

      let propCapDo = `capDoLanToi${level}`;
      let valueCapDo = this.objPTHM[propCapDo];

      let error = "";
      if (!this.isNotNullOrEmpty(valueThoiGian))
        error = error + "Thời gian; ";
      if (!this.isNotNullOrEmpty(valueKM))
        error = error + "KM; ";

      if (!this.isNotNullOrEmpty(valueCapDo))
        error = error + "Cấp độ; ";

      if (error.length > 0) {
        this.toastService.warning("Hạng mục kiểm tra lần tới (lần thứ " + (level.toString().length == 0 ? "1" : level) + ") thiếu các trường thông tin: " + error);
        return false;
      }

      else {
        let propNameHangMuc = `HangMucKiemTraLanToi${level}`;
        this.objPTHM[propNameHangMuc] = value.toString().trim() + "@12#@" + this.thoiGianHangMucLanToi(valueThoiGian) + "@12#@" + valueKM.toString().trim() + "@12#@" + valueCapDo.toString().trim();
        return true;
      }
    }
    else
      return true;
  }

  thoiGianHangMucLanToi(inputDate) {
    if (inputDate === undefined || inputDate === null || inputDate === "")
      return "";
    else {
      let bangkokTime = utcToZonedTime(inputDate, "Asia/Bangkok");
      return format(bangkokTime, "dd/MM/yyyy");
    }
  }

  ptToolLFinish(lst) {

    this.lstPTTool = [];
    let itemOil = {
      ToolName: "NHỚT",
      Color: true
    }

    this.lstPTTool.push(itemOil);
    let lstIsOil = lst.filter(x => x.IsOil == true);
    this.lstPTTool = [... this.lstPTTool, ...lstIsOil];

    let itemPTT = {
      ToolName: "PHỤ TÙNG TRONG",
      Color: true
    }

    this.lstPTTool.push(itemPTT);
    let lstPTT = lst.filter(x => x.IsOil == false && x.ToolType == false);
    this.lstPTTool = [... this.lstPTTool, ...lstPTT];

    let itemPTN = {
      ToolName: "PHỤ TÙNG NGOÀI",
      Color: true
    }

    this.lstPTTool.push(itemPTN);
    let lstPTN = lst.filter(x => x.IsOil == false && x.ToolType == true);
    this.lstPTTool = [... this.lstPTTool, ...lstPTN];

  }

  get totalQTYPTTT(): number {
    return this.lstPTTT.reduce((sum, item) => sum + (item.QTY || 0), 0);
  }


  get totalAmountPTTT(): number {
    return this.lstPTTT.reduce((sum, item) => sum + (item.Amount || 0), 0);
  }

  get totalQTYPTPS(): number {
    return this.lstPTPS.reduce((sum, item) => sum + (item.QTY || 0), 0);
  }


  get totalAmountPTPS(): number {
    return this.lstPTPS.reduce((sum, item) => sum + (item.Amount || 0), 0);
  }

  get totalPhuTung(): number {
    let totalPTTT = this.lstPTTT.reduce((sum, item) => sum + (item.Amount || 0), 0);
    let totalPTPS = this.lstPTPS.reduce((sum, item) => sum + (item.Amount || 0), 0);

    return totalPTTT + totalPTPS;
  }

  downloadPT() {

    const sheet1Data = [
      ['TÊN PHỤ TÙNG', 'SỐ LƯỢNG', 'ĐƠN GIÁ', 'BÁO GIÁ'],
    ];

    const sheet2Data = this.lstAccount.map(item => ({
      MANHANVIEN: item.UserID,
      TENNHANVIEN: item.UserName
    }))
    // Chuyển dữ liệu sang worksheet
    const ws1 = XLSX.utils.aoa_to_sheet(sheet1Data);
    const ws2 = XLSX.utils.json_to_sheet(sheet2Data);

    // Tạo workbook và gán 2 sheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws1, 'Sheet1');
    XLSX.utils.book_append_sheet(wb, ws2, 'Sheet2');
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
    this.excelService.downloadFromData(wbout, "fileMau_PTTTPS.xlsx");

  }

  importExcelPT(event: any, type) {
    const file = event.target.files[0];
    this.excelService.readExcelFile(file).then((data) => {
      // kiểm tra báo giá
      data.forEach((ele) => {

        let checkBaoGia = this.lstAccount.filter(x => x.UserID == ele.BAOGIA);
        if (checkBaoGia.length == 0)
          this.toastService.error("Nhân viên báo giá phụ tùng: " + ele.TENPHUTUNG + " không tồn tại", "Thông báo");
        else {

          let item = {
            Amount: ele.SOLUONG * ele.DONGIA,
            BillNo: this.objModel.Bill_NO,
            CreatedBy: this.currentUser.code,
            CreatedDate: new Date(),
            Id: 0,
            IsDeleted: false,
            Part_Name: ele.TENPHUTUNG.toString(),
            Price_After_Discount: ele.DONGIA,
            QTY: ele.SOLUONG,
            SaleBy: ele.BAOGIA,
            SaleByName: checkBaoGia[0].UserName,
            ServiceType: "",
            ToolType: type == "PTTT" ? 1 : 2,
            UniqId: null,
            UpdatedBy: this.currentUser.code,
            UpdatedDate: new Date()
          }

          if (type == "PTTT")
            this.lstPTTT.push(item);
          if (type == "PTPS")
            this.lstPTPS.push(item);
        }
      })
    })

    this.calcAmount();
    event.target.value = "";
  }

  printPTTTPS(type) {
    let lst = [];
    lst = type == "PTTT" ? this.lstPTTT : this.lstPTPS;

    if (!this.isNotNullOrEmpty(this.objModel.Bill_NO)) {
      this.toastService.error("Vui lòng lưu tạm phiếu trước khi in", "Thông báo ");
      return;
    }

    if (lst.length == 0) {
      this.toastService.error("Không có dữ liệu in phiếu", "Thông báo");
      return;
    }

    let obj = Object.assign({}, this.objModel);
    const key = "reportHead";
    if (!localStorage.getItem(key)) {
      this.commonService.GetReportHead(this.currentUser.id.toString()).subscribe((res) => {
        let data = JSON.stringify(res);
        localStorage.setItem(key, data);

      });
    }

    let reportHead: any = JSON.parse(localStorage.getItem(key));
    obj.Head = reportHead.DEALER_CODE + "-" + reportHead.FULL_NAME;
    obj.HeadAddress = "Số: " + reportHead.HEAD_ADD;


    obj.LoaiPhieu = type;

    obj.NguoiLapPhieu = this.currentUser.name;
    let nguoiNhan = this.lstAccount.filter(x => x.UserID == this.objModel.RepairedBy);
    obj.NguoiNhan = nguoiNhan.length > 0 ? nguoiNhan[0].UserName : "";


    this.child.addData(obj, lst);
    setTimeout(() => {
      this.child.print();
    }, 300);
  }

  changePartName(value) {
    this.objSpecialTool.Part_Name = value.toUpperCase();
  }

  checkChange(index, event, typeList) {
    debugger;
    if (event.currentTarget.checked) {
      if (typeList == "PTTT")
        this.lstPTTT[index].IsCheck = true;
      else
        this.lstPTPS[index].IsCheck = true;
    } else {
      if (typeList == "PTTT")
        this.lstPTTT[index].IsCheck = false;
      else
        this.lstPTPS[index].IsCheck = false;
    }

  }

  changeProvice(value) {
    this.objModel.DistCode = "";
    this.lstDistrictP = this.lstDistrict.filter(x => x.P_CODE == value);
  }

  sendPTPS() {
    debugger;
    const instanceA = this.hotRegisterer.getInstance(this.hotIdPTTT);
    const instanceB = this.hotRegisterer.getInstance(this.hotIdPTPS);

    // getData PTTT
    let data = instanceA.getData().length;    
    console.log(data);

    instanceB.setDataAtCell(2, 0, "Tên phụ tùng");
    instanceB.setDataAtCell(2, 1, "1");
    instanceB.setDataAtCell(2, 2, 10000);
    instanceB.setDataAtCell(2, 3, 10000);
    instanceB.setDataAtCell(2, 4, "Hồ Thị Mỹ Duyên");
  }

  sendPTTT() {
    let dataCheck = this.lstPTPS.filter((x) => x.IsCheck == true);
    this.lstPTTT = [... this.lstPTTT, ...dataCheck];
    this.lstPTPS = this.lstPTPS.filter((x) => x.IsCheck != true);

    // cập nhật isCheck = false;
    this.lstPTTT = this.lstPTTT.map(item => ({ ...item, IsCheck: false }));
  }

  calcAmount() {
    // tổng tiền phụ tùng
    let totalPhuTungTT = this.lstPTTT.reduce((sum, item) => sum + (item.Amount || 0), 0);
    let totalPhuTungPS = this.lstPTPS.reduce((sum, item) => sum + (item.Amount || 0), 0);

    // phụ tụng tự mua
    let totalPTTM = this.lstPTTM.reduce((sum, item) => sum + (item.Amount || 0), 0);

    this.objModel.TongTienPT = totalPhuTungTT + totalPhuTungPS + totalPTTM;

    this.objModel.TotalMoney = this.objModel.TongTienDV + this.objModel.TongTienPT;
    this.objModel.DocTienThanhChu = this.docTienBangChu(this.objModel.TotalMoney, "");
  }



  //#region HANG MUC SUA CHUA
  openServiceCode(item, index) {
    this.objServiceCode = item;
    this.indexServiceCode = index;
    $('#popupServiceCode').modal('show');
  }

  changeServiceCode(index, service) {
    let arrayKTDK = ["41KTDK", "42KTDK", "43KTDK", "44KTDK", "45KTDK", "46KTDK", "2RAP"];
    // kiểm tra hạng mục tồn tại chưa
    let checkExists = this.lstWage.filter(x => x.ServiceCode == service);
    let checkArr = arrayKTDK.filter(x => x == service);
    // chưa tồn tại
    if (checkExists.length == 0 || (checkExists.length > 0 && checkArr.length == 0)) {
      this.serviceBill.GetServiceCodeModel(service, this.objModel.Model).subscribe(res => {
        if (!res.isError) {
          let data = JSON.parse(res.obj)[0];
          if (data) {
            // nếu loại hạng mục là RB hoặc KTDK thì không cho phép nhập hạng mục là loại RB hoặc KTDK nữa
            if (data.ServiceType == "RB" || data.ServiceType == "KTDK") {
              let check_RB_KTDT = this.lstWage.filter(x => x.ServiceType == data.ServiceType);
              if (check_RB_KTDT.length > 0) {
                this.toastService.warning("Hạng mục '" + data.ServiceType + "' đã tồn tại. Vui lòng chọn hạng mục khác !!!", "Thông báo");
                return;
              }
            }
            // can edit
            this.lstWage[index].IsEditComment = data.CanEditNoiDung;
            this.lstWage[index].IsEditPrice = data.CanEditGiaBan;
            //this.lstWage[index].IsEditSafeOff = data.CanEditGiamGia;
            this.lstWage[index].IsEditOutPaid = data.CanEditGCN;
            // content
            this.lstWage[index].ServiceCode = service;
            this.lstWage[index].ServiceName = data.ServiceName
            this.lstWage[index].Comment = data.ServiceName;
            this.lstWage[index].Price = data.Price;
            this.lstWage[index].AgentPrice = data.AgentPrice;
            this.lstWage[index].OutPaid = 0;
            this.lstWage[index].DepreciationCost = data.DepreciationCost;
            this.lstWage[index].ServiceType = data.ServiceType;
            // let lydoGG = this.lstWage[index].SaleOffReason;
            // if (lydoGG == "" || lydoGG == null)
            //   this.lstWage[index].Amount = data.Price;
            // else {
            //   if (lydoGG == "BH" || lydoGG == "TC" || lydoGG == "KM") {
            //     this.lstWage[index].SaleOff = data.Price;
            //     this.lstWage[index].Amount = 0;
            //   } else {
            //     let sotienGG = this.lstWage[index].SaleOff;
            //     if (parseFloat(sotienGG) > 0)
            //       this.lstWage[index].Amount = data.Price - parseFloat(sotienGG);
            //     else
            //       this.lstWage[index].Amount = data.Price;
            //     this.lstWage[index].SaleOffReason = "TT";
            //   }
            // }

            this.calcAmount();
          } else
            this.toastService.error("Lỗi; Không lấy được hạng mục sửa chữa", "Thông báo");

        } else {
          this.toastService.warning(res.msg);
          return;
        }
      })
    }
    else {
      this.toastService.warning("Hạng mục đã tồn tại. Vui lòng chọn hạng mục khác !!!", "Thông báo");
      return;
    }
  }

  changeSaleOffReason(index, reason) {
    // bảo hành thiện chí khuyến mãi thì giảm giá = giá bán
    if (reason == "BH" || reason == "TC" || reason == "KM") {
      this.lstWage[index].SaleOff = this.lstWage[index].Price;
      this.lstWage[index].Amount = 0;
      this.lstWage[index].IsEditSafeOff = false;
    }
    else if (reason == "GG" || reason == "TT" || reason == "") {
      this.lstWage[index].SaleOff = 0;
      this.lstWage[index].Amount = this.lstWage[index].Price;
      this.lstWage[index].IsEditSafeOff = (reason == "GG") ? true : false;
    }

    this.calcAmount();
  }

  changeSaleOff(index, saleoff) {
    this.cdref.detectChanges();

    if (saleoff.toString().substring(0, 1) == "0") {
      this.lstWage[index].SaleOff = parseFloat(saleoff);
      return;
    }

    if (parseFloat(saleoff) > this.lstWage[index].Price) {
      this.lstWage[index].SaleOff = 0;
      this.lstWage[index].Amount = this.lstWage[index].Price;
      this.toastService.warning("Số tiền giảm giá lớn hơn giá bán !!!", "Thông báo");
      return;
    } else
      this.lstWage[index].Amount = this.lstWage[index].Price - parseFloat(saleoff);

    this.calcAmount();
  }

  changePrice(index, price) {
    if (price.length == 0) {
      this.lstWage[index].Price = 0;
      this.lstWage[index].Amount
    } else {
      this.lstWage[index].Price = price;
      this.lstWage[index].Amount = this.lstWage[index].Price;
    }

    this.calcAmount();
  }

  changeOutPaid(index, outpaid) {
    let thuGCN = this.lstWage[index].Price;
    let chiGCN = this.lstWage[index].OutPaid;
    if (parseFloat(thuGCN) < parseFloat(chiGCN)) {
      this.toastService.warning("Chi gia công ngoài không được lớn hơn giá bán !!!", "Thông báo");
      this.lstWage[index].OutPaid = 0;
    }
    this.lstWage[index].OutPaid = outpaid;

    this.calcAmount();
  }

  processWage() {
    const instance = this.hotRegisterer.getInstance(this.hotIdWage);
    let data = instance.getData();

    const columnKeys = [
      'ServiceName',    // Cột 0
      'Comment',        // Cột 1
      'Price',          // Cột 2
      'SaleOffReason',  // Cột 3
      'SaleOff',        // Cột 4
      'Amount',         // Cột 5
      'OutPaid',        // Cột 6
      'SaleBy',         // Cột 7
      'ServiceType',    // Cột 8
      'ID',             // Cột 9
      'Bill_No',        // Cột 10
      'CreatedBy',      // Cột 11
      'IsDeleted',      // Cột 12
      'DepreciationCost', // Cột 13
      'UpdatedBy',      // Cột 14
      'SaleByName',     // Cột 15
      'AgentPrice'      // Cột 16
    ];

    // Chuyển đổi dữ liệu
    let result = data
      .filter(row => row.some(cell => cell !== '' && cell !== null)) // Lọc bỏ các dòng trống
      .map(row => {
        const obj: any = {};
        row.forEach((value, index) => {
          if (index < columnKeys.length) { // Chỉ lấy những cột có key tương ứng
            obj[columnKeys[index]] = value;
          }
        });
        return obj;
      });

    // xử lý dữ liệu
    result.forEach(item => {
      // xử lý ServiceId
      let serviceCode = this.lstServiceList.filter(x => x.ServiceName == item.ServiceName);
      item.ServiceCode = serviceCode[0].ServiceCode;
      // xử lý giảm giá
      let reason = this.lstSaleOffRs.filter(x => x.text == item.SaleOffReason);
      item.SaleOffReason = reason[0].value;
      // xử lý báo giá
      let saleBy = this.lstAccount.filter(x => x.UserName == item.SaleBy);
      item.SaleBy = saleBy[0].UserID;


      let aPrice = 0;
      if (item.ServiceType == "RB" || item.ServiceType == "KTDK") {
        aPrice = item.AgentPrice;
      }
      else if (item.ServiceType == "SC" || item.ServiceType == "HMK") {
        aPrice = item.Price;
      }
      else if (item.ServiceType == "GCN") {
        let chiGCN = item.OutPaid;
        let thuGCN = item.Price;
        aPrice = thuGCN - chiGCN;
      }
      item.AgentPrice = aPrice;
      item.SaleOffMoney = item.SaleOff;
      item.CreatedDate = new Date();
      item.UpdatedDate = new Date();
      item.ServiceId = 0;
      item.IntCode = 0;
      item.UniqId = Guid.create().toString();

    })
    return result;
  }




  calMoneyDV() {
    const instance = this.hotRegisterer.getInstance(this.hotIdWage);
    let tong = 0;
    const rowCount = instance.countRows();
    for (let row = 0; row < rowCount; row++) {
      const val = parseFloat(instance.getDataAtCell(row, 5)) || 0;
      tong += val;
    }
    this.objModel.TongTienDV = tong;
  }

  calMoneyPT(type) {
    const instance = this.hotRegisterer.getInstance(type);
    let tongQTY = 0;
    let tongAmount = 0;
    const rowCount = instance.countRows();
    for (let row = 0; row < rowCount; row++) {
      const valQTY = parseFloat(instance.getDataAtCell(row, 1)) || 0;
      const valAmount = parseFloat(instance.getDataAtCell(row, 3) || 0);
      tongQTY += valQTY;
      tongAmount += valAmount;
    }

    if (type == "hotInstanceIdPTTT") {
      this.objTotalPTTT.totalQTY = tongQTY;
      this.objTotalPTTT.totalAmount = tongAmount;

    }
    if (type == "hotInstanceIdPTPS") {
      this.objTotalPTPS.totalQTY = tongQTY;
      this.objTotalPTPS.totalAmount = tongAmount;
    }
  }

  deleteRowWage(rowIndex: number) {
    const instance = this.hotRegisterer.getInstance(this.hotIdWage);
    // Lấy dữ liệu hiện tại
    const currentData = instance.getData();
    // Xóa dòng tại rowIndex
    currentData.splice(rowIndex, 1);
    // Cập nhật lại dữ liệu
    instance.loadData(currentData);

  }


  //#endregion

  //#region PHU TUNG THAY THE
  changeQTYPTTT(index, event) {
    this.cdref.detectChanges();
    let qty = event.target.value;
    if (qty.toString().length == 0 || parseInt(qty) == 0) {
      this.lstPTTT[index].QTY = "1";
      this.lstPTTT[index].Amount = this.lstPTTT[index].Price_After_Discount;
    }
    else {
      this.lstPTTT[index].QTY = parseInt(qty).toString();
      this.lstPTTT[index].Amount = this.lstPTTT[index].Price_After_Discount * parseInt(qty);
    }
    this.calcAmount();
  }

  changePricePTTT(index, price) {
    this.cdref.detectChanges();
    this.lstPTTT[index].Price_After_Discount = price;
    this.lstPTTT[index].Amount = price * parseInt(this.lstPTTT[index].QTY);
    this.calcAmount();
  }

  addPTTT() {
    let item = {
      Amount: 0,
      BillNo: this.objModel.Bill_NO,
      CreatedBy: this.currentUser.code,
      CreatedDate: new Date(),
      Id: 0,
      IsDeleted: false,
      Part_Name: "",
      Price_After_Discount: 0,
      QTY: 1,
      SaleBy: this.lstPTTT.length > 0 ? this.lstPTTT[0].SaleBy : this.lstAccount[0].UserID,
      SaleByName: this.lstPTTT.length > 0 ? this.lstPTTT[0].SaleByName : this.lstAccount[0].UserName,
      ServiceType: "",
      ToolType: 1,
      UniqId: null,
      UpdatedBy: this.currentUser.code,
      UpdatedDate: new Date()
    }

    this.lstPTTT.push(item);
    this.objSpecialTool = item;
    this.indexSpecialTool = this.lstPTTT.length - 1;

    $('#popupToolPTTT').modal('show');
  }

  specialTool() {
    let flat = true;
    // phụ tùng thay thế
    this.lstPTTT.forEach((ele, value) => {
      let error = "";
      if (!this.isNotNullOrEmpty(ele.Part_Name))
        error = error + "Tên phụ tùng; ";
      if (!this.isNotNullOrEmpty(ele.QTY))
        error = error + "Số lượng; ";
      if (ele.SaleBy === 0 || ele.SaleBy === "")
        error = error + "Người báo giá; ";

      if (error.length > 0) {
        flat = false;
        this.toastService.error("'PHỤ TÙNG THAY THẾ'- Dòng thứ " + (value + 1) + " đang thiếu các trường thông tin sau: " + error);
      } else {
        ele.QTY = parseInt(ele.QTY);
        ele.Amount = parseFloat(ele.Amount);
        ele.ToolType = 1;
        ele.SaleBy = parseInt(ele.SaleBy);
      }
    })

    // phụ tùng phát sinh
    this.lstPTPS.forEach((ele, value) => {
      let error = "";
      if (!this.isNotNullOrEmpty(ele.Part_Name))
        error = error + "Tên phụ tùng; ";
      if (!this.isNotNullOrEmpty(ele.QTY))
        error = error + "Số lượng; ";
      if (ele.SaleBy === 0 || ele.SaleBy === "")
        error = error + "Người báo giá; ";

      if (error.length > 0) {
        flat = false;
        this.toastService.error("'PHỤ TÙNG PHÁT SINH'- Dòng thứ " + (value + 1) + " đang thiếu các trường thông tin sau: " + error);
      } else {
        ele.QTY = parseInt(ele.QTY);
        ele.Amount = parseFloat(ele.Amount);
        ele.ToolType = 2;
        ele.SaleBy = parseInt(ele.SaleBy);
      }
    })


    if (flat)
      return [...this.lstPTTT, ... this.lstPTPS];
    else
      return null;
  }

  removePTTT() {
    this.lstPTTT = this.lstPTTT.filter(x => x.IsCheck == false);
    this.calcAmount();
  }

  //#endregion

  //#region PHU TUNG PHAT SINH
  addPTPS() {
    let item = {
      Amount: 0,
      BillNo: this.objModel.Bill_NO,
      CreatedBy: this.currentUser.code,
      CreatedDate: new Date(),
      Id: 0,
      IsDeleted: false,
      Part_Name: "",
      Price_After_Discount: 0,
      QTY: 1,
      SaleBy: this.lstPTTT.length > 0 ? this.lstPTTT[0].SaleBy : this.lstAccount[0].UserID,
      SaleByName: this.lstPTTT.length > 0 ? this.lstPTTT[0].SaleByName : this.lstAccount[0].UserName,
      ServiceType: "",
      ToolType: 2,
      UniqId: null,
      UpdatedBy: this.currentUser.code,
      UpdatedDate: new Date(),
    }

    this.lstPTPS.push(item);

    this.objSpecialTool = item;
    this.indexSpecialTool = this.lstPTPS.length - 1;

    $('#popupToolPTPS').modal('show');

  }

  openSpecialTool(item, index, type) {

    this.objSpecialTool = item;
    this.indexSpecialTool = index;

    $('#popupTool' + type).modal('show');
  }

  changeQTYPTPS(index, event) {
    this.cdref.detectChanges();
    let qty = event;
    if (qty.toString().length == 0 || parseInt(qty) == 0) {
      this.lstPTPS[index].QTY = "1";
      this.lstPTPS[index].Amount = this.lstPTPS[index].Price_After_Discount;
    }
    else {
      this.lstPTPS[index].QTY = parseInt(qty).toString();
      this.lstPTPS[index].Amount = this.lstPTPS[index].Price_After_Discount * parseInt(qty);
    }
    this.calcAmount();
  }

  changePricePTPS(index, price) {
    this.cdref.detectChanges();
    this.lstPTPS[index].Price_After_Discount = price;
    this.lstPTPS[index].Amount = price * parseInt(this.lstPTPS[index].QTY);
    this.calcAmount();
  }

  removePTPS() {
    this.lstPTPS = this.lstPTPS.filter(x => x.IsCheck == false);
    this.calcAmount();
  }

  //#endregion

  //#region PHU TUNG TU MUA
  addPTTM() {
    let item = {
      BillNo: this.objModel.Bill_NO,
      Part_Name: "",
      Part_No: "",
      QTY: 1,
      Price_After_Discount: 0,
      OriginalPrice: 0,
      interest: 0,
      interestAmount: 0,
      Amount: 0,
      CreatedBy: this.currentUser.code,
      UpdatedBy: this.currentUser.code,
      CreatedDate: new Date(),
      UpdatedDate: new Date(),
      Cost: 0,
      ServiceType: "",
      IsDeleted: false
    }

    this.lstPTTM.push(item);

    this.objToolBuy = item;
    this.indexToolBuy = this.lstPTTM.length - 1;

    $('#popupToolInBillBuy').modal('show');

  }

  openToolBuy(item, index) {
    this.objToolBuy = item;
    this.indexToolBuy = index;

    $('#popupToolInBillBuy').modal('show');
  }

  changeOriginalPrice(index, price) {

    this.cdref.detectChanges();
    if (parseFloat(price) > this.lstPTTM[index].Price_After_Discount) {
      this.cdref.detectChanges();
      this.lstPTTM[index].OriginalPrice = this.lstPTTM[index].Price_After_Discount;
      this.lstPTTM[index].interest = 0;
      this.lstPTTM[index].interestAmount = 0;
      this.toastService.warning("Giá vốn không thể lớn giá bán !!!", "Thông báo");
      return;
    } else {
      this.lstPTTM[index].interest = this.lstPTTM[index].Price_After_Discount - price;
      this.lstPTTM[index].interestAmount = this.lstPTTM[index].interest * this.lstPTTM[index].QTY;
    }
  }

  changePriceAfterDiscount(index, price) {
    this.cdref.detectChanges();
    if (parseFloat(price) < this.lstPTTM[index].OriginalPrice) {
      this.lstPTTM[index].Price_After_Discount = this.lstPTTM[index].OriginalPrice;
      this.toastService.warning("Giá bán không thể nhỏ hơn giá vốn !!!", "Thông báo");
      return;
    } else {
      this.lstPTTM[index].interest = this.lstPTTM[index].Price_After_Discount - this.lstPTTM[index].OriginalPrice;
      this.lstPTTM[index].interestAmount = this.lstPTTM[index].interest * this.lstPTTM[index].QTY;
      this.lstPTTM[index].Amount = price * this.lstPTTM[index].QTY;
    }
  }

  changeQTYPTTM(index, event) {

    let qty = event;
    if (qty.toString().length == 0 || parseInt(qty) == 0) {
      this.lstPTTM[index].QTY = "1";
      this.lstPTTM[index].Amount = this.lstPTTM[index].Price_After_Discount;
    }
    else {
      this.lstPTTM[index].QTY = parseInt(qty).toString();
      this.lstPTTM[index].interestAmount = this.lstPTTM[index].interest * parseInt(qty);
      this.lstPTTM[index].Amount = this.lstPTTM[index].Price_After_Discount * parseInt(qty);
    }
  }

  removePTTM(index) {
    this.lstPTTM.splice(index, 1);
  }

  toolInBillBuy() {
    let flat = true;
    this.lstPTTM.forEach((ele, index) => {
      let error = "";
      if (!this.isNotNullOrEmpty(ele.Part_Name))
        error = error + "Tên phụ tùng; ";
      if (!this.isNotNullOrEmpty(ele.Part_No))
        error = error + "Mã phụ tùng; ";
      if (ele.Price_After_Discount === 0 || ele.Price_After_Discount === "")
        error = error + "Giá bán; ";
      if (ele.OriginalPrice === 0 || ele.OriginalPrice === "")
        error = error + "Giá vốn; ";

      if (error.length > 0) {
        flat = false;
        this.toastService.error("'PHỤ TÙNG TỰ MUA'- Dòng thứ " + (index + 1) + " đang thiếu các trường thông tin sau: " + error);
      } else {
        ele.QTY = parseInt(ele.QTY);
        ele.Amount = parseFloat(ele.Amount);
        ele.SaleBy = parseInt(ele.SaleBy);
        ele.ToolType = 2;
      }
    });
    return flat;
  }

  //#endregion

  //#region NHOT + PTT + PTN
  loadPhuTungDMS() {
    if (confirm("Khi bạn lấy lại phụ tùng từ DMS, các phụ tùng hiện tại của phiếu này sẽ bị xóa. Bạn có chắc lấy lại dữ liệu mới từ DMS")) {
      this.serviceBill.GetToolListHMS(this.objModel.Bill_NO, "L").subscribe(res => {
        this.ptToolLFinish(JSON.parse(res.obj));
        this.toastService.success("Đã load xong phụ tùng từ DMS !!!", "Thông báo");
        this.calcAmount();
      })
    }
  }

  toolInBill() {
    // loại bỏ nhớt + PTT + PTN
    let data = this.lstPTTool.filter(x => x.ToolName != "NHỚT" && x.ToolName != "PHỤ TÙNG TRONG" && x.ToolName != "PHỤ TÙNG NGOÀI");
    data.forEach(ele => {
    });
    return data;
  }

  //#endregion

  getUserName(userId: string): string {
    const user = this.lstAccount.find(acc => acc.UserID === userId);
    return user ? user.UserName : '';
  }

  getSaleOffReason(id: string): string {
    const reason = this.lstSaleOffRs.find(reas => reas.value == id);
    return reason ? reason.text : '';
  }

  docSo3ChuSo(baso: number): string {
    let tram = Math.floor(baso / 100);
    let chuc = Math.floor((baso % 100) / 10);
    let donvi = baso % 10;
    let KetQua = "";

    if (tram !== 0) {
      KetQua += this.ChuSo[tram] + " trăm";
      if (chuc === 0 && donvi !== 0) KetQua += " linh";
    }
    if (chuc !== 0 && chuc !== 1) {
      KetQua += this.ChuSo[chuc] + " mươi";
      if (chuc === 0 && donvi !== 0) KetQua += " linh";
    }
    if (chuc === 1) KetQua += " mười";

    switch (donvi) {
      case 1:
        KetQua += (chuc !== 0 && chuc !== 1) ? " mốt" : this.ChuSo[donvi];
        break;
      case 5:
        KetQua += (chuc === 0) ? this.ChuSo[donvi] : " lăm";
        break;
      default:
        if (donvi !== 0) KetQua += this.ChuSo[donvi];
        break;
    }
    return KetQua;
  }

  docTienBangChu(soTien: number, strTail: string): string {
    if (soTien < 0) return "Số tiền âm !";
    if (soTien === 0) return "Không đồng !";
    if (soTien > 8999999999999999) return "";

    let viTri: number[] = new Array(6).fill(0);
    let ketQua = "";
    let tmp = "";
    let so = Math.abs(soTien);

    viTri[5] = Math.floor(so / 1_000_000_000_000_000);
    so -= viTri[5] * 1_000_000_000_000_000;
    viTri[4] = Math.floor(so / 1_000_000_000_000);
    so -= viTri[4] * 1_000_000_000_000;
    viTri[3] = Math.floor(so / 1_000_000_000);
    so -= viTri[3] * 1_000_000_000;
    viTri[2] = Math.floor(so / 1_000_000);
    viTri[1] = Math.floor((so % 1_000_000) / 1_000);
    viTri[0] = so % 1_000;

    let lan = viTri.findIndex(v => v > 0);
    lan = lan === -1 ? 0 : 5 - lan;

    for (let i = lan; i >= 0; i--) {
      tmp = this.docSo3ChuSo(viTri[i]);
      ketQua += tmp;
      if (viTri[i] !== 0) ketQua += " " + this.Tien[i];
      if (i > 0 && tmp) ketQua += " .";
    }

    ketQua = ketQua.trim() + " " + strTail;
    return ketQua.charAt(0).toUpperCase() + ketQua.slice(1);
  }

  setTitle(billNo: String, name, sdt) {
    let title = billNo.substring(5, 13) + " - " + this.getLastName(name) + " - xx" + sdt.substring(sdt.length - 3, sdt.length);
    this.titleService.setTitle(title);
  }

  getLastName(fullName: string): string {
    if (!fullName) return '';

    // Tách các từ trong tên dựa trên dấu cách
    let words = fullName.trim().split(/\s+/);

    // Lấy từ cuối cùng
    let lastName = words[words.length - 1];

    // Loại bỏ ký tự đặc biệt, chỉ giữ lại chữ cái
    lastName = lastName.replace(/[^a-zA-ZÀ-ỹ]/g, '');

    return lastName;
  }

  formatNumberPlate(numberPlate: string) {
    numberPlate = numberPlate.replace(" ", "").replace("-", "");
    if (numberPlate.length > 4)
      numberPlate = numberPlate.substring(0, 3) + "-" + numberPlate.substring(4, numberPlate.length);

    return numberPlate;
  }

  validator(isFinish) {
    let flat = true;
    // check ngày giờ nhận xe có nằm trong khoảng từ 07h => 20h 

    if (!this.checkTimeWork(this.objModel.InputDate)) {
      this.toastService.error("Giờ nhận xe nằm ngoài thời gian làm việc", "Thông báo");
      return false;
    }

    // xử lý khi lưu hoàn thành
    if (isFinish) {
      // nếu số km lần trước lớn hơn hiện tại mà không ghi lý do thì cảnh báo
      if ((this.objModel.TotalPrevKm > this.objModel.TotalKms) && this.objModel.LyDoSaiSoKM.length == 0) {
        this.toastService.error("Số KM hiện tại <= Số KM lần trước, vui lòng nhập lý do !!!", "Thông báo");
        flat = false;
      }
      // kiểm tra số điện thoai
      if (this.objModel.Phone.length < 9 || this.objModel.length > 11) {
        this.toastService.error("Vui lòng kiểm tra lại số điện thoai; SĐT không hợp lệ", "Thông báo");
        flat = false;
      }
      // check thời gian sửa xe có nằm trong khoảng 07h => 20h 
      if (!this.checkTimeWork(this.objModel.RepairDate)) {
        this.toastService.error("Giờ bắt đầu sửa nằm ngoài thời gian làm việc", "Thông báo");
        flat = false;
      }

      // check thời gian kết thúc sửa có nằm trong khoảng 07h => 20h 
      if (!this.checkTimeWork(this.objModel.FinishDate)) {
        this.toastService.error("Giờ kết thúc sửa nằm ngoài thời gian làm việc", "Thông báo");
        flat = false;
      }

      // check thời gian giao xe có nằm trong khoảng 07h => 20h 
      if (!this.checkTimeWork(this.objModel.OutputDate)) {
        this.toastService.error("Giờ giao xe nằm ngoài thời gian làm việc", "Thông báo");
        flat = false;
      }

      // tên khách hàng
      if (!this.isNotNullOrEmpty(this.objModel.CustName)) {
        this.toastService.error("Vui lòng nhập tên khách hàng", "Thông báo");
        flat = false;
      }

      // loại xe
      if (!this.isNotNullOrEmpty(this.objModel.Model)) {
        this.toastService.error("Vui lòng chọn loại xe", "Thông báo");
        flat = false;
      }

      // biển số
      if (!this.isNotNullOrEmpty(this.objModel.NumberPlate)) {
        this.toastService.error("Vui lòng nhập biển số xe", "Thông báo");
        flat = false;
      }

      // nhân viên tiếp nhận
      if (!this.isNotNullOrEmpty(this.objModel.ReceivedBy)) {
        this.toastService.error("Vui lòng chọn nhân viên tiếp nhận", "Thông báo");
        flat = false;
      }

      // nhân viên sửa chữa
      if (!this.isNotNullOrEmpty(this.objModel.RepairedBy)) {
        this.toastService.error("Vui lòng chọn nhân viên sửa chữa", "Thông báo");
        flat = false;
      }

      // nhân viên kiểm tra cuối
      if (!this.isNotNullOrEmpty(this.objModel.CheckBy)) {
        this.toastService.error("Vui lòng chọn nhân viên kiểm tra xe ra", "Thông báo");
        flat = false;
      }

      // nhân viên thu ngân
      if (!this.isNotNullOrEmpty(this.objModel.Cashier)) {
        this.toastService.error("Vui lòng chọn nhân viên thu ngân", "Thông báo");
        flat = false;
      }

      // nếu có phụ tùng tự mua hoặc phụ tùng thay thế thì bắt buộc phải có phụ tùng từ DMS, nếu không có thì không hoàn thành
      // if ((this.lstPTTM.length > 0 || this.lstPTPS.length > 0) && (this.lstPTTool.length == 0 || this.lstPTTool.length == 3)) {
      //   this.toastService.error("Chưa có phụ tùng từ DMS vui lòng load lại phụ tùng DMS", "Thông báo");
      //   flat = false;
      // }

      // kiểm tra số khung đúng định dạng
      const regex = /^(M|R|Z)([A-Za-z]{4})(\w{12})$/;
      // không đúng số khung
      if (!this.getServiceType("RB") && !regex.test(this.objModel.SK)) {
        this.toastService.error("Số khung không đúng định dạng hoặc bỏ trống để điền lý do không có số khung", "Thông báo");
        flat = false;
      }

      // kiểm tra có nội dung không có số khung
      if (this.objModel.MaLyDoKhongCoSoKhung == "KHAC" && !this.isNotNullOrEmpty(this.objModel.TenLyDoKhongCoSoKhung)) {
        this.toastService.error("Vui lòng nhập lý do sai số khung", "Thông báo");
        flat = false;
      }

      // loại kiểm tra     
      if (!this.isNotNullOrEmpty(this.objModel.LoaiKiemTraCuoi)) {
        this.toastService.error("Vui lòng chọn loại kiểm tra cuối", "Thông báo");
        flat = false;
      }
      // xác nhận sửa chữa
      if (!this.isNotNullOrEmpty(this.objModel.XacNhanSuaChua)) {
        this.toastService.error("Vui lòng chọn xác nhận sửa chữa", "Thông báo");
        flat = false;
      }
    }
    return flat;
  }

  getServiceType(type) {
    let checkType = this.lstWage.filter(x => x.ServiceType == type);
    if (checkType.length > 0)
      return true;
    else
      return false;
  }

  checkTimeWork(inputDate) {
    let date = new Date(inputDate);
    let hoursInput = date.getHours();
    if (hoursInput > 20 || hoursInput < 7)
      return false;
    else
      return true;
  }

  normalizeItem(item: string): string {
    return item
      .normalize("NFD") // Tách dấu khỏi ký tự
      .replace(/[\u0300-\u036f]/g, "") // Xóa dấu
      .replace(/đ/g, "d") // Chuyển đổi 'đ' thành 'd'
      .replace(/Đ/g, "D") // Chuyển đổi 'Đ' thành 'D'
      .replace(/\s+/g, ""); // Xóa khoảng trắng
  }

  isNumeric(value: any): boolean {
    return !isNaN(parseFloat(value)) && isFinite(value);
  }
  allowOnlyNumbers(event: KeyboardEvent) {
    const charCode = event.which ? event.which : event.keyCode;
    // Cho phép: 0-9
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }

  onPaste(event: ClipboardEvent) {
    event.preventDefault(); // chặn dán
  }


  isNotNullOrEmpty(input): boolean {
    if (input === undefined || input === null || input === "" || input === "0" || input === 0)
      return false;
    else
      return true;
  }

}
