import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'phoneNumberMask'
})
export class PhoneNumberMaskPipe implements PipeTransform {
  transform(phoneNumber: string): string {
    debugger
    if (phoneNumber.length >= 3) {
      const maskedDigits = '*'.repeat(3);
      return phoneNumber.slice(0, -3) + maskedDigits;
    } else {
      return phoneNumber;
    }
  }
}
