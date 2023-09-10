import { InjectionToken } from "@angular/core";

export class NgxCurrencyMaskConfig {
    locale: string = 'en-US';
    scale: string = '1.0-0';
}

export const NGX_CURRENCY_MASK_CONFIG = new InjectionToken<NgxCurrencyMaskConfig>('ngxCurrencyMask.config');