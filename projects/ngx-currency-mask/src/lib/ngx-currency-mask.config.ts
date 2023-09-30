import { InjectionToken } from "@angular/core";

export class NgxCurrencyMaskConfig {
    locale!: string;
    scale!: string;
    align!: string;
    prefix!: string;
    postfix!: string;
}

export const NGX_CURRENCY_MASK_CONFIG = new InjectionToken<NgxCurrencyMaskConfig>('ngxCurrencyMask.config');