import * as i0 from '@angular/core';
import { InjectionToken, Injectable, Optional, Inject, forwardRef, Directive, Input, HostListener, NgModule } from '@angular/core';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS } from '@angular/forms';

class NgxCurrencyMaskConfig {
}
const NGX_CURRENCY_MASK_CONFIG = new InjectionToken('ngxCurrencyMask.config');

class NgxCurrencyMaskService {
    constructor(config) {
        // Configuration variable
        this.locale = 'en-US';
        this.scale = '1.0-0';
        this.align = 'left';
        this.prefix = '';
        this.postfix = '';
        this.locale = config?.locale;
        this.scale = config?.scale;
        this.align = config?.align;
        this.prefix = config?.prefix ?? '';
        this.postfix = config?.postfix ?? '';
    }
    getSeparator(locale) {
        return {
            thousands: Number(1000).toLocaleString(locale).replace(/\d/g, ''),
            decimal: Number(0.1).toLocaleString(locale).replace(/\d/g, '')
        };
    }
    toDecimalFormat(value, decimalSeparator) {
        const decimalFormat = value.replace(new RegExp(`[^0-9\\${decimalSeparator}\-]`, 'g'), '')
            .replace(new RegExp(`\\${decimalSeparator}`, 'g'), '.');
        return decimalFormat;
    }
    truncateNumber(numStr, decimalSeparator, maxScale) {
        if (isNaN(Number(numStr))) {
            throw new Error('It\'s not a Number!');
        }
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
        };
    }
    /**
     * Sets the cursor position within an HTMLInputElement.
     * @param {HTMLInputElement} el An input element to set the cursor position for.
     * @param {number} cursorPosition The desired cursor position to set.
     */
    setCursorPosition(el, cursorPosition) {
        if (cursorPosition <= -1) {
            cursorPosition = 0;
        }
        el.nativeElement.setSelectionRange(cursorPosition, cursorPosition);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.2", ngImport: i0, type: NgxCurrencyMaskService, deps: [{ token: NGX_CURRENCY_MASK_CONFIG, optional: true }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "16.2.2", ngImport: i0, type: NgxCurrencyMaskService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.2", ngImport: i0, type: NgxCurrencyMaskService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: function () { return [{ type: NgxCurrencyMaskConfig, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [NGX_CURRENCY_MASK_CONFIG]
                }] }]; } });

class NgxCurrencyMaskDirective {
    constructor(el, service) {
        this.el = el;
        this.service = service;
        this.locale = this.service.locale;
        this.scale = this.service.scale;
        this.prefix = this.service.prefix;
        this.postfix = this.service.postfix;
        this.minScale = 0;
        this.maxScale = 0;
        this.integerScale = 1;
        this.thousandsSeparator = ',';
        this.decimalSeparator = '.';
        this.onChange = () => { };
        this.onTouched = () => { };
    }
    ngOnInit() {
        if (this.locale) {
            const seperator = this.service.getSeparator(this.locale);
            this.thousandsSeparator = seperator.thousands;
            this.decimalSeparator = seperator.decimal;
        }
        if (this.scale) {
            const scaleArray = this.scale.split(/[^0-9]/).map(el => Number(el));
            this.integerScale = scaleArray[0];
            this.minScale = scaleArray[1];
            this.maxScale = scaleArray[2];
        }
    }
    onKeyDown(event) {
        const target = event.target;
        const selectionStart = target.selectionStart;
        if (event.key == 'Backspace') {
            if (target.value[selectionStart - 1] == this.thousandsSeparator) {
                this.service.setCursorPosition(this.el, selectionStart - 1);
                event.preventDefault();
            }
        }
    }
    onKeyPress(event) {
        const target = event.target;
        const selectionStart = target.selectionStart;
        if (event.key == this.decimalSeparator) {
            if ((target.value.match(new RegExp(`\\${this.decimalSeparator}`, 'g'))?.length ?? 0) > 0 || selectionStart != target.value.length) {
                event.preventDefault();
            }
        }
        if (event.key.match(new RegExp(`[^0-9\\${this.decimalSeparator}\-]`, 'g'))) {
            event.preventDefault();
        }
    }
    onInput(event) {
        const target = event.target;
        let selectionIndex = target.selectionStart ?? target.value.length;
        // Skip handling input methods that require composition
        if (event.isComposing) {
            return;
        }
        if (target.value.endsWith(this.decimalSeparator)) {
            if (selectionIndex == target.value.length) {
                return;
            }
            selectionIndex++;
        }
        if (target.value) {
            let decimalFormat = this.service.toDecimalFormat(target.value, this.decimalSeparator);
            const decimalPart = target.value.split(this.decimalSeparator)[1];
            const decimalPlaces = decimalPart ? (decimalPart.length > this.maxScale ? this.maxScale : decimalPart.length) : 0;
            const truncRtn = this.service.truncateNumber(decimalFormat, this.decimalSeparator, this.maxScale);
            const decimalNumber = Number(truncRtn.value);
            const currencyFormat = decimalNumber.toLocaleString(this.locale, {
                minimumFractionDigits: decimalPlaces,
                maximumFractionDigits: this.maxScale
            });
            const cursorOffset = currencyFormat.length + this.prefix?.length + this.postfix?.length - target.value.length + truncRtn.offset;
            target.value = this.prefix + currencyFormat + this.postfix;
            this.service.setCursorPosition(this.el, selectionIndex + cursorOffset);
            this.onChange(decimalNumber);
            this.onTouched();
        }
        else {
            this.onChange(undefined);
            this.onTouched();
        }
    }
    onBlur(event) {
        const target = event.target;
        if (target.value) {
            if (target.value.endsWith(this.decimalSeparator)) {
                target.value = target.value.slice(0, -1);
            }
            let decimalFormat = this.service.toDecimalFormat(target.value, this.decimalSeparator);
            const decimalNumber = Number(this.service.truncateNumber(decimalFormat, this.decimalSeparator, this.maxScale).value);
            const currencyFormat = decimalNumber.toLocaleString(this.locale, {
                minimumIntegerDigits: this.integerScale,
                minimumFractionDigits: this.maxScale,
                maximumFractionDigits: this.maxScale
            });
            target.value = this.prefix + currencyFormat + this.postfix;
            this.onChange(decimalNumber);
        }
    }
    onCompositionEnd(event) {
        const target = event.target;
        const selectionStart = target.selectionStart ?? target.value.length;
        if (target.value) {
            const decimalFormat = this.service.toDecimalFormat(target.value, this.decimalSeparator);
            const currencyFormat = Number(decimalFormat).toLocaleString(this.locale);
            const cursorOffset = currencyFormat.length - target.value.length;
            target.value = currencyFormat;
            this.service.setCursorPosition(this.el, selectionStart + cursorOffset);
            this.onChange(decimalFormat);
            this.onTouched();
        }
    }
    /* Validator */
    validate(control) {
        if (this.max && this.max < control.value) {
            return { max: true };
        }
        if (this.min && this.min > control.value) {
            return { min: true };
        }
        return null;
    }
    /* ControlValueAccessor */
    writeValue(value) {
        if (value) {
            this.el.nativeElement.value =
                this.prefix + Number(value).toLocaleString(this.locale, {
                    minimumIntegerDigits: this.integerScale,
                    minimumFractionDigits: this.minScale,
                    maximumFractionDigits: this.maxScale
                }) + this.postfix;
        }
    }
    registerOnChange(fn) {
        this.onChange = fn;
    }
    registerOnTouched(fn) {
        this.onTouched = fn;
    }
    setDisabledState(isDisabled) {
        this.el.nativeElement.disabled = isDisabled;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.2", ngImport: i0, type: NgxCurrencyMaskDirective, deps: [{ token: i0.ElementRef }, { token: NgxCurrencyMaskService }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.2.2", type: NgxCurrencyMaskDirective, selector: "[currencyMask]", inputs: { locale: "locale", scale: "scale", max: "max", min: "min", prefix: "prefix", postfix: "postfix" }, host: { listeners: { "keydown": "onKeyDown($event)", "keypress": "onKeyPress($event)", "input": "onInput($event)", "blur": "onBlur($event)", "compositionend": "onCompositionEnd($event)" }, properties: { "style.text-align": "service.textAlign" } }, providers: [
            {
                provide: NG_VALUE_ACCESSOR,
                useExisting: forwardRef(() => NgxCurrencyMaskDirective),
                multi: true,
            },
            {
                provide: NG_VALIDATORS,
                useExisting: forwardRef(() => NgxCurrencyMaskDirective),
                multi: true,
            },
        ], ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.2", ngImport: i0, type: NgxCurrencyMaskDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[currencyMask]',
                    host: {
                        '[style.text-align]': 'service.textAlign',
                    },
                    providers: [
                        {
                            provide: NG_VALUE_ACCESSOR,
                            useExisting: forwardRef(() => NgxCurrencyMaskDirective),
                            multi: true,
                        },
                        {
                            provide: NG_VALIDATORS,
                            useExisting: forwardRef(() => NgxCurrencyMaskDirective),
                            multi: true,
                        },
                    ],
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: NgxCurrencyMaskService }]; }, propDecorators: { locale: [{
                type: Input
            }], scale: [{
                type: Input
            }], max: [{
                type: Input
            }], min: [{
                type: Input
            }], prefix: [{
                type: Input
            }], postfix: [{
                type: Input
            }], onKeyDown: [{
                type: HostListener,
                args: ['keydown', ['$event']]
            }], onKeyPress: [{
                type: HostListener,
                args: ['keypress', ['$event']]
            }], onInput: [{
                type: HostListener,
                args: ['input', ['$event']]
            }], onBlur: [{
                type: HostListener,
                args: ['blur', ['$event']]
            }], onCompositionEnd: [{
                type: HostListener,
                args: ['compositionend', ['$event']]
            }] } });

class NgxCurrencyMaskModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.2", ngImport: i0, type: NgxCurrencyMaskModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "16.2.2", ngImport: i0, type: NgxCurrencyMaskModule, declarations: [NgxCurrencyMaskDirective], exports: [NgxCurrencyMaskDirective] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "16.2.2", ngImport: i0, type: NgxCurrencyMaskModule }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.2", ngImport: i0, type: NgxCurrencyMaskModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [
                        NgxCurrencyMaskDirective
                    ],
                    imports: [],
                    exports: [
                        NgxCurrencyMaskDirective
                    ]
                }]
        }] });

/*
 * Public API Surface of ngx-currency-mask
 */

/**
 * Generated bundle index. Do not edit.
 */

export { NGX_CURRENCY_MASK_CONFIG, NgxCurrencyMaskConfig, NgxCurrencyMaskDirective, NgxCurrencyMaskModule };
//# sourceMappingURL=ngx-currency-mask.mjs.map
