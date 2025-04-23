import { AfterViewInit, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dropdown-cell',
  templateUrl: './dropdown-cell.component.html',
  styleUrls: ['./dropdown-cell.component.scss']
})
export class DropdownCellComponent implements AfterViewInit {

  ngAfterViewInit(): void {
    throw new Error('Method not implemented.');
  }
  
  params: any;
  options: string[] = [];
  selectedValue: string = "";

  items = [
    { id: 1, name: "Option 1" },
    { id: 2, name: "Option 2" },
    { id: 3, name: "Option 3" },
  ];

  agInit(params: any): void {
    debugger;
    this.params = params;
    this.options = params.values;
    this.selectedValue = params.value;
  }

  getValue(): any {
    return this.selectedValue;
  }

  onSelect(event: any) {
    this.selectedValue = event;
  }
}
