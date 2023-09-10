import { Inject, Injectable, Optional } from '@angular/core';
import { NGX_CURRENCY_MASK_CONFIG, NgxCurrencyMaskConfig } from './ngx-currency-mask.config';

@Injectable({
  providedIn: 'root'
})
export class NgxCurrencyMaskService {
  // Configuration variable
  locale: string = 'en-US';
  scale: string = '1.0-0';

  textAlign: string = 'left';

  constructor(
    @Optional() @Inject(NGX_CURRENCY_MASK_CONFIG) config: NgxCurrencyMaskConfig
  ) { 
    this.locale = config?.locale;
    this.scale = config?.scale;
  }

  getSeparator(locale: string): any {
    return {
      thousands: Number(1000).toLocaleString(locale).replace(/\d/g, ''),
      decimal: Number(0.1).toLocaleString(locale).replace(/\d/g, '')
    }
  }

}
