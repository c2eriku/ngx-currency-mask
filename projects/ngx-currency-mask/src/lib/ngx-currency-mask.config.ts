import { InjectionToken } from "@angular/core";

export class NgxCurrencyMaskConfig {
    locale: string = 'en-US';
    scale: string = '0-0';
    textAlign: string = 'left';
    groupSymbol: string = ',';
    decimalSymbol: string = '.';
}

export const NGX_CURRENCY_MASK_CONFIG = new InjectionToken<NgxCurrencyMaskConfig>('ngxCurrencyMask.config');