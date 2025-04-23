import { Component } from "@angular/core";
import { ICellEditorAngularComp } from "ag-grid-angular";

@Component({
  selector: "app-dropdown-cell-editor",
  template: `
 <ng-select [searchable]="true" placeholder="Chọn một mục">
  <ng-option [value]="'option1'">Tùy chọn 1</ng-option>
  <ng-option [value]="'option2'">Tùy chọn 2</ng-option>
  <ng-option [value]="'option3'">Tùy chọn 3</ng-option>
</ng-select>
  `,
  styles: [`
    .custom-dropdown {
      width: 100%;
    }
  `]
})
export class DropdownCellEditorComponent implements ICellEditorAngularComp {
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
