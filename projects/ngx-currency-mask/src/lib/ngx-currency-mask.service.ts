import { Inject, Injectable, Optional } from '@angular/core';
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

  /**
   * Truncates a number to a specified number of decimal places.
   * @param {number} number A number to be truncated.
   * @param {number} decimalPlaces A number of decimal places to truncate to.
   * @returns {number} The truncated number.
   */
  truncateNumber(number: number, decimalPlaces: number): number {
    const factor = Math.pow(10, decimalPlaces);
    return Math.round(number * factor) / factor;
  }

}
