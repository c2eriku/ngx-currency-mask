import { ElementRef, Inject, Injectable, Optional } from '@angular/core';
import { NGX_CURRENCY_MASK_CONFIG, NgxCurrencyMaskConfig } from './ngx-currency-mask.config';

@Injectable({
  providedIn: 'root'
})
export class NgxCurrencyMaskService {
  // Configuration variable
  locale: string = 'en-US';
  scale: string = '1.0-0';

  align: string = 'left';
  prefix: string = '';
  postfix: string = '';

  constructor(
    @Optional() @Inject(NGX_CURRENCY_MASK_CONFIG) config: NgxCurrencyMaskConfig
  ) {
    this.locale = config?.locale;
    this.scale = config?.scale;
    this.align = config?.align;
    this.prefix = config?.prefix ?? '';
    this.postfix = config?.postfix ?? '';
  }

  getSeparator(locale: string): any {
    return {
      thousands: Number(1000).toLocaleString(locale).replace(/\d/g, ''),
      decimal: Number(0.1).toLocaleString(locale).replace(/\d/g, '')
    }
  }

  toDecimalFormat(value: string, decimalSeparator: string): string {
    const decimalFormat = value.replace(new RegExp(`[^0-9\\${decimalSeparator}\-]`, 'g'), '')
      .replace(new RegExp(`\\${decimalSeparator}`, 'g'), '.');
    return decimalFormat;
  }

  truncateNumber(numStr: string, decimalSeparator: string, maxScale: number): any {
    if (isNaN(Number(numStr))) { throw new Error('It\'s not a Number!'); }
    const separatorIndex = numStr.search(new RegExp(`\\${decimalSeparator}`, 'g'));
    if (separatorIndex > -1) {
      const truncateNumber = numStr.slice(0, separatorIndex + maxScale + 1);
      return {
        value: truncateNumber,
        offset: numStr.length - truncateNumber.length
      };
    }

    return {
      value: numStr,
      offset: 0
    }
  }

  /**
   * Sets the cursor position within an HTMLInputElement.
   * @param {HTMLInputElement} el An input element to set the cursor position for.
   * @param {number} cursorPosition The desired cursor position to set.
   */
  setCursorPosition(el: ElementRef<HTMLInputElement>, cursorPosition: number): void {
    if (cursorPosition <= -1) {
      cursorPosition = 0;
    }
    el.nativeElement.setSelectionRange(cursorPosition, cursorPosition);
  }

}
