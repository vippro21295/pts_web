import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { LocationStrategy, HashLocationStrategy, DatePipe, DecimalPipe } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NumberFormatDirective } from './helps/numberFormat.directive';
import { DatetimePickerDirective } from './helps/datetime-picker.directive';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxMaskModule } from 'ngx-mask';
import { NgxPrintModule } from 'ngx-print';
// Import ngx-barcode module
import { NgxBarcode6Module } from 'ngx-barcode6';
import { HotTableModule } from '@handsontable/angular';
import { registerAllModules } from 'handsontable/registry';
registerAllModules();

import { IconModule, IconSetModule, IconSetService } from '@coreui/icons-angular';



import { AppComponent } from './app.component';

// Import containers
import { DefaultLayoutComponent } from './containers';

import { P404Component } from './views/error/404.component';
import { P500Component } from './views/error/500.component';
import { LoginComponent } from './views/login/login.component';
import { RegisterComponent } from './views/register/register.component';


const APP_CONTAINERS = [
  DefaultLayoutComponent
];

import {
  AppAsideModule,
  AppBreadcrumbModule,
  AppHeaderModule,
  AppFooterModule,
  AppSidebarModule,
} from '@coreui/angular';

// Import routing module
import { AppRoutingModule } from './app.routing';

// Import 3rd party components
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ChartsModule } from 'ng2-charts';
import { RoleComponent } from './views/systems/role/role.component';
import { UsersComponent } from './views/systems/users/users.component';
import { RoleService } from './services/role.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ModalModule } from 'ngx-bootstrap/modal';
import { AuthService } from './services/auth.service';
import { AuthGuard } from './auth.guard';
import { FormsModule } from '@angular/forms';
import { InterceptService } from './helps/intercept.service';
import { AgGridModule } from 'ag-grid-angular';
import { NgxSpinnerModule } from "ngx-spinner";
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { CustomPaginator } from './helps/customPaginator';
import { ToastrModule } from 'ngx-toastr';
import { MatRadioModule } from '@angular/material/radio';
import { ColorPickerModule } from 'ngx-color-picker';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTreeModule } from '@angular/material/tree';
import { PhoneNumberMaskPipe } from './helps/phone-number-mask.pipe';
import { ServiceBillComponent } from './views/service-bill/service-bill.component';
import { BillComponent } from './views/bill/bill.component';
import { ProgressBarComponent } from './views/bill/progress-bar/progress-bar.component';
import { DropdownCellComponent } from './render/dropdown-cell/dropdown-cell.component';
import { PrintToolComponent } from './views/bill/print-tool/print-tool.component';
import { LoadingComponent } from './views/loading/loading.component';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    AppAsideModule,
    AppBreadcrumbModule.forRoot(),
    AppFooterModule,
    AppHeaderModule,
    AppSidebarModule,
    PerfectScrollbarModule,
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    ChartsModule,
    IconModule,
    IconSetModule.forRoot(),
    HttpClientModule,
    ModalModule.forRoot(),
    FormsModule,
    MatTableModule,
    MatIconModule,
    MatSortModule,
    MatPaginatorModule,
    NgSelectModule,
    ToastrModule.forRoot(
      {
        positionClass: 'toast-bottom-right'
      }
    ),
    MatRadioModule,
    AgGridModule.withComponents([]),
    ToastrModule.forRoot(),
    NgxSpinnerModule,
    BrowserModule,
    ColorPickerModule,
    MatCheckboxModule,
    MatProgressBarModule,
    MatTreeModule,
    BrowserModule,
    NgxMaskModule.forRoot(),
    NgxPrintModule,
    NgxBarcode6Module,
    HotTableModule.forRoot()
  ],
  declarations: [
    AppComponent,
    ...APP_CONTAINERS,
    P404Component,
    P500Component,
    LoginComponent,
    RegisterComponent,
    RoleComponent,
    UsersComponent,
    UsersComponent,
    PhoneNumberMaskPipe,
    ServiceBillComponent,
    BillComponent,
    ProgressBarComponent,
    NumberFormatDirective,
    DatetimePickerDirective,
    DropdownCellComponent,
    LoadingComponent, PrintToolComponent
  ],
  providers: [
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptService,
      multi: true
    },
    {
      provide: MatPaginatorIntl, useValue: CustomPaginator()
    },
    IconSetService,
    RoleService,
    AuthService,
    AuthGuard,
    InterceptService,
    DatePipe,
    DecimalPipe
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [DatetimePickerDirective] // Xuất directive để dùng ở các component khác
})
export class AppModule { }
