import { ElementRef } from '@angular/core';
import { NgxCurrencyMaskConfig } from './ngx-currency-mask.config';
import * as i0 from "@angular/core";
export declare class NgxCurrencyMaskService {
    locale: string;
    scale: string;
    align: string;
    prefix: string;
    postfix: string;
    constructor(config: NgxCurrencyMaskConfig);
    getSeparator(locale: string): any;
    toDecimalFormat(value: string, decimalSeparator: string): string;
    truncateNumber(numStr: string, decimalSeparator: string, maxScale: number): any;
    /**
     * Sets the cursor position within an HTMLInputElement.
     * @param {HTMLInputElement} el An input element to set the cursor position for.
     * @param {number} cursorPosition The desired cursor position to set.
     */
    setCursorPosition(el: ElementRef<HTMLInputElement>, cursorPosition: number): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<NgxCurrencyMaskService, [{ optional: true; }]>;
    static ɵprov: i0.ɵɵInjectableDeclaration<NgxCurrencyMaskService>;
}
