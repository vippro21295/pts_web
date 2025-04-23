import { Directive, ElementRef, Input, OnInit, Renderer2, HostListener, forwardRef } from '@angular/core';
import flatpickr from 'flatpickr';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

@Directive({
  selector: '[appDatetimePicker]',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => DatetimePickerDirective),
    multi: true
  }]
})
export class DatetimePickerDirective implements OnInit, ControlValueAccessor {
  @Input() dateFormat: string = 'd/m/Y H:i';
  @Input() enableTime: boolean = true;
  private picker: any;
  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit() {
    this.picker = flatpickr(this.el.nativeElement, {
      enableTime: this.enableTime,
      dateFormat: this.dateFormat,
      time_24hr: true,
      defaultDate: this.parseDate(this.el.nativeElement.value), // Đọc từ input nếu có sẵn
      onChange: (selectedDates) => {
        this.onChange(selectedDates[0]); // Cập nhật giá trị vào ngModel
      }
    });
  }

  // Chuyển string từ ngModel thành Date
  writeValue(value: any): void {
    if (value) {
      const parsedDate = this.parseDate(value);
      this.picker.setDate(parsedDate, false); // Không trigger onChange khi gán giá trị
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  // Chuyển đổi string thành Date
  private parseDate(value: any): Date | undefined {
    if (!value) return undefined;
    if (value instanceof Date) return value;
    
    // Parse string theo format dd/MM/yyyy HH:mm
    const parts = value.match(/(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2})/);
    if (parts) {
      return new Date(+parts[3], +parts[2] - 1, +parts[1], +parts[4], +parts[5]);
    }
    return undefined;
  }
}
