import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[appNumberFormat]'
})
export class NumberFormatDirective {
  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event']) onInput(event: Event) {
    let input = this.el.nativeElement;
    
    // Loại bỏ ký tự không phải số
    let value = input.value.replace(/[^0-9]/g, '');
    
    // Thêm dấu phẩy sau mỗi 3 chữ số
    value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    // Gán lại giá trị đã được định dạng
    input.value = value;
  }
}