import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { RoleService } from '../../../services/role.service';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss']
})
export class RoleComponent implements OnInit {
  @ViewChild('modalCreate') modalCreate: ModalDirective;
  @ViewChild('modalDel') modalDel: ModalDirective;
  displayedColumns: string[] = ['name', 'createdDate','updatedDate','action'];
  rowData: any = [];
  paginationPageSize = 10;
  model = {} as any;
  isCreate = true;
  titleCreateModal='Tạo mới hãng xe';
  brands: any;
  constructor(private apiService: RoleService,private toastr:ToastrService) { }
  urlsApi = {
    getList: '/api/v1/role/list',
    create_update: '/api/v1/role',

  }
  totalRows = 0;
  pageSize = 5;
  currentPage = 0;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  ngOnInit(): void {
    this.loadData();
  }
  loadData() {
    this.apiService.GetRoles().subscribe(respone => {
      this.dataSource = new MatTableDataSource<any>(respone.data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }
  
  pageChanged(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.loadData();
  }
  showModaledit(item) {
    this.titleCreateModal='Chỉnh sửa mẫu xe';
    this.model = {
      id: item.id,
      name: item.name,
      description: item.description
    };
    this.isCreate = false;
    this.modalCreate.show();
  }
  showModaldel(item) {
    this.model = {
      id: item.id
    };
    this.modalDel.show();
  }
  onHide(e) {
    this.model = {} as any;
    this.isCreate = true;
    this.titleCreateModal='Tạo mới mẫu xe';
  }

  del(){
    
  }
  
}
