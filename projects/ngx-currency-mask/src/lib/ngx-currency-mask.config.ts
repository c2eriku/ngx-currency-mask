import { InjectionToken } from "@angular/core";

export class NgxCurrencyMaskConfig {
    locale: string = 'en-US';
    minimumFractionDigits: number = 0;
    maximumFractionDigits: number = 0;
    textAlign: string = 'left';
    groupSymbol: string = ',';
    decimalSymbol: string = '.';
}

export const NGX_CURRENCY_MASK_CONFIG = new InjectionToken<NgxCurrencyMaskConfig>('ngxCurrencyMask.config');