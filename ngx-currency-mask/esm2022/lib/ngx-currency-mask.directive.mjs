import { Directive, HostListener, Input, forwardRef } from '@angular/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import * as i0 from "@angular/core";
import * as i1 from "./ngx-currency-mask.service";
export class NgxCurrencyMaskDirective {
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.2", ngImport: i0, type: NgxCurrencyMaskDirective, deps: [{ token: i0.ElementRef }, { token: i1.NgxCurrencyMaskService }], target: i0.ɵɵFactoryTarget.Directive }); }
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
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i1.NgxCurrencyMaskService }]; }, propDecorators: { locale: [{
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWN1cnJlbmN5LW1hc2suZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMvbmd4LWN1cnJlbmN5LW1hc2svc3JjL2xpYi9uZ3gtY3VycmVuY3ktbWFzay5kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBYyxZQUFZLEVBQUUsS0FBSyxFQUFVLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMvRixPQUFPLEVBQXlDLGFBQWEsRUFBRSxpQkFBaUIsRUFBK0IsTUFBTSxnQkFBZ0IsQ0FBQzs7O0FBcUJ0SSxNQUFNLE9BQU8sd0JBQXdCO0lBb0JuQyxZQUNVLEVBQWdDLEVBQ2hDLE9BQStCO1FBRC9CLE9BQUUsR0FBRixFQUFFLENBQThCO1FBQ2hDLFlBQU8sR0FBUCxPQUFPLENBQXdCO1FBckJoQyxXQUFNLEdBQVcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUM7UUFDckMsVUFBSyxHQUFXLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDO1FBS25DLFdBQU0sR0FBVyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQztRQUNyQyxZQUFPLEdBQVcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUM7UUFFaEQsYUFBUSxHQUFXLENBQUMsQ0FBQztRQUNyQixhQUFRLEdBQVcsQ0FBQyxDQUFDO1FBQ3JCLGlCQUFZLEdBQVcsQ0FBQyxDQUFDO1FBRXpCLHVCQUFrQixHQUFXLEdBQUcsQ0FBQztRQUNqQyxxQkFBZ0IsR0FBVyxHQUFHLENBQUM7UUFFdkIsYUFBUSxHQUF5QixHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDM0MsY0FBUyxHQUFlLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztJQUt0QyxDQUFDO0lBRUwsUUFBUTtRQUNOLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRTtZQUNmLE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUN6RCxJQUFJLENBQUMsa0JBQWtCLEdBQUcsU0FBUyxDQUFDLFNBQVMsQ0FBQztZQUM5QyxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQztTQUMzQztRQUNELElBQUksSUFBSSxDQUFDLEtBQUssRUFBRTtZQUNkLE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ3BFLElBQUksQ0FBQyxZQUFZLEdBQUcsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2xDLElBQUksQ0FBQyxRQUFRLEdBQUcsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzlCLElBQUksQ0FBQyxRQUFRLEdBQUcsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQy9CO0lBQ0gsQ0FBQztJQUlELFNBQVMsQ0FBQyxLQUFvQjtRQUM1QixNQUFNLE1BQU0sR0FBcUIsS0FBSyxDQUFDLE1BQTBCLENBQUM7UUFDbEUsTUFBTSxjQUFjLEdBQVcsTUFBTSxDQUFDLGNBQXdCLENBQUM7UUFFL0QsSUFBSSxLQUFLLENBQUMsR0FBRyxJQUFJLFdBQVcsRUFBRTtZQUM1QixJQUFJLE1BQU0sQ0FBQyxLQUFLLENBQUMsY0FBYyxHQUFHLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxrQkFBa0IsRUFBRTtnQkFDL0QsSUFBSSxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLGNBQWMsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDNUQsS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDO2FBQ3hCO1NBQ0Y7SUFDSCxDQUFDO0lBSUQsVUFBVSxDQUFDLEtBQW9CO1FBQzdCLE1BQU0sTUFBTSxHQUFxQixLQUFLLENBQUMsTUFBMEIsQ0FBQztRQUNsRSxNQUFNLGNBQWMsR0FBVyxNQUFNLENBQUMsY0FBd0IsQ0FBQztRQUUvRCxJQUFJLEtBQUssQ0FBQyxHQUFHLElBQUksSUFBSSxDQUFDLGdCQUFnQixFQUFFO1lBQ3RDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLE1BQU0sQ0FBQyxLQUFLLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxFQUFFLEdBQUcsQ0FBQyxDQUFDLEVBQUUsTUFBTSxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxjQUFjLElBQUksTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUU7Z0JBQ2pJLEtBQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQzthQUN4QjtTQUNGO1FBRUQsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLE1BQU0sQ0FBQyxVQUFVLElBQUksQ0FBQyxnQkFBZ0IsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEVBQUU7WUFDMUUsS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDO1NBQ3hCO0lBQ0gsQ0FBQztJQUlELE9BQU8sQ0FBQyxLQUFpQjtRQUN2QixNQUFNLE1BQU0sR0FBcUIsS0FBSyxDQUFDLE1BQTBCLENBQUM7UUFDbEUsSUFBSSxjQUFjLEdBQVcsTUFBTSxDQUFDLGNBQWMsSUFBSSxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQztRQUUxRSx1REFBdUQ7UUFDdkQsSUFBSSxLQUFLLENBQUMsV0FBVyxFQUFFO1lBQ3JCLE9BQU87U0FDUjtRQUVELElBQUksTUFBTSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEVBQUU7WUFDaEQsSUFBSSxjQUFjLElBQUksTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUU7Z0JBQ3pDLE9BQU87YUFDUjtZQUNELGNBQWMsRUFBRSxDQUFDO1NBQ2xCO1FBRUQsSUFBSSxNQUFNLENBQUMsS0FBSyxFQUFFO1lBQ2hCLElBQUksYUFBYSxHQUFXLElBQUksQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUM7WUFDOUYsTUFBTSxXQUFXLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDakUsTUFBTSxhQUFhLEdBQUcsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFFbEgsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDbEcsTUFBTSxhQUFhLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUU3QyxNQUFNLGNBQWMsR0FBRyxhQUFhLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUU7Z0JBQy9ELHFCQUFxQixFQUFFLGFBQWE7Z0JBQ3BDLHFCQUFxQixFQUFFLElBQUksQ0FBQyxRQUFRO2FBQ3JDLENBQUMsQ0FBQztZQUVILE1BQU0sWUFBWSxHQUFHLGNBQWMsQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxNQUFNLEdBQUcsSUFBSSxDQUFDLE9BQU8sRUFBRSxNQUFNLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQztZQUNoSSxNQUFNLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxNQUFNLEdBQUcsY0FBYyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7WUFDM0QsSUFBSSxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLGNBQWMsR0FBRyxZQUFZLENBQUMsQ0FBQztZQUV2RSxJQUFJLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBQzdCLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztTQUNsQjthQUFNO1lBQ0wsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUN6QixJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7U0FDbEI7SUFDSCxDQUFDO0lBSUQsTUFBTSxDQUFDLEtBQVU7UUFDZixNQUFNLE1BQU0sR0FBcUIsS0FBSyxDQUFDLE1BQTBCLENBQUM7UUFFbEUsSUFBSSxNQUFNLENBQUMsS0FBSyxFQUFFO1lBQ2hCLElBQUksTUFBTSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEVBQUU7Z0JBQ2hELE1BQU0sQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDMUM7WUFFRCxJQUFJLGFBQWEsR0FBVyxJQUFJLENBQUMsT0FBTyxDQUFDLGVBQWUsQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1lBQzlGLE1BQU0sYUFBYSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLGdCQUFnQixFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUVySCxNQUFNLGNBQWMsR0FBRyxhQUFhLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUU7Z0JBQy9ELG9CQUFvQixFQUFFLElBQUksQ0FBQyxZQUFZO2dCQUN2QyxxQkFBcUIsRUFBRSxJQUFJLENBQUMsUUFBUTtnQkFDcEMscUJBQXFCLEVBQUUsSUFBSSxDQUFDLFFBQVE7YUFDckMsQ0FBQyxDQUFDO1lBRUgsTUFBTSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsTUFBTSxHQUFHLGNBQWMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDO1lBRTNELElBQUksQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLENBQUM7U0FDOUI7SUFDSCxDQUFDO0lBSUQsZ0JBQWdCLENBQUMsS0FBdUI7UUFDdEMsTUFBTSxNQUFNLEdBQXFCLEtBQUssQ0FBQyxNQUEwQixDQUFDO1FBQ2xFLE1BQU0sY0FBYyxHQUFXLE1BQU0sQ0FBQyxjQUFjLElBQUksTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUM7UUFFNUUsSUFBSSxNQUFNLENBQUMsS0FBSyxFQUFFO1lBQ2hCLE1BQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUM7WUFDeEYsTUFBTSxjQUFjLEdBQUcsTUFBTSxDQUFDLGFBQWEsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7WUFFekUsTUFBTSxZQUFZLEdBQUcsY0FBYyxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQztZQUNqRSxNQUFNLENBQUMsS0FBSyxHQUFHLGNBQWMsQ0FBQztZQUM5QixJQUFJLENBQUMsT0FBTyxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsY0FBYyxHQUFHLFlBQVksQ0FBQyxDQUFDO1lBRXZFLElBQUksQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLENBQUM7WUFDN0IsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO1NBQ2xCO0lBQ0gsQ0FBQztJQUtELGVBQWU7SUFDZixRQUFRLENBQUMsT0FBa0M7UUFDekMsSUFBSSxJQUFJLENBQUMsR0FBRyxJQUFJLElBQUksQ0FBQyxHQUFHLEdBQUcsT0FBTyxDQUFDLEtBQUssRUFBRTtZQUN4QyxPQUFPLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxDQUFDO1NBQ3RCO1FBQ0QsSUFBSSxJQUFJLENBQUMsR0FBRyxJQUFJLElBQUksQ0FBQyxHQUFHLEdBQUcsT0FBTyxDQUFDLEtBQUssRUFBRTtZQUN4QyxPQUFPLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxDQUFDO1NBQ3RCO1FBQ0QsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBS0QsMEJBQTBCO0lBQzFCLFVBQVUsQ0FBQyxLQUFVO1FBQ25CLElBQUksS0FBSyxFQUFFO1lBQ1QsSUFBSSxDQUFDLEVBQUUsQ0FBQyxhQUFhLENBQUMsS0FBSztnQkFDekIsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUU7b0JBQ3RELG9CQUFvQixFQUFFLElBQUksQ0FBQyxZQUFZO29CQUN2QyxxQkFBcUIsRUFBRSxJQUFJLENBQUMsUUFBUTtvQkFDcEMscUJBQXFCLEVBQUUsSUFBSSxDQUFDLFFBQVE7aUJBQ3JDLENBQUMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDO1NBRXJCO0lBQ0gsQ0FBQztJQUVELGdCQUFnQixDQUFDLEVBQU87UUFDdEIsSUFBSSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7SUFDckIsQ0FBQztJQUVELGlCQUFpQixDQUFDLEVBQU87UUFDdkIsSUFBSSxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUM7SUFDdEIsQ0FBQztJQUVELGdCQUFnQixDQUFFLFVBQW1CO1FBQ25DLElBQUksQ0FBQyxFQUFFLENBQUMsYUFBYSxDQUFDLFFBQVEsR0FBRyxVQUFVLENBQUM7SUFDOUMsQ0FBQzs4R0FyTVUsd0JBQXdCO2tHQUF4Qix3QkFBd0IsNllBYnhCO1lBQ1Q7Z0JBQ0UsT0FBTyxFQUFFLGlCQUFpQjtnQkFDMUIsV0FBVyxFQUFFLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyx3QkFBd0IsQ0FBQztnQkFDdkQsS0FBSyxFQUFFLElBQUk7YUFDWjtZQUNEO2dCQUNFLE9BQU8sRUFBRSxhQUFhO2dCQUN0QixXQUFXLEVBQUUsVUFBVSxDQUFDLEdBQUcsRUFBRSxDQUFDLHdCQUF3QixDQUFDO2dCQUN2RCxLQUFLLEVBQUUsSUFBSTthQUNaO1NBQ0Y7OzJGQUVVLHdCQUF3QjtrQkFsQnBDLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLGdCQUFnQjtvQkFDMUIsSUFBSSxFQUFFO3dCQUNKLG9CQUFvQixFQUFFLG1CQUFtQjtxQkFDMUM7b0JBQ0QsU0FBUyxFQUFFO3dCQUNUOzRCQUNFLE9BQU8sRUFBRSxpQkFBaUI7NEJBQzFCLFdBQVcsRUFBRSxVQUFVLENBQUMsR0FBRyxFQUFFLHlCQUF5QixDQUFDOzRCQUN2RCxLQUFLLEVBQUUsSUFBSTt5QkFDWjt3QkFDRDs0QkFDRSxPQUFPLEVBQUUsYUFBYTs0QkFDdEIsV0FBVyxFQUFFLFVBQVUsQ0FBQyxHQUFHLEVBQUUseUJBQXlCLENBQUM7NEJBQ3ZELEtBQUssRUFBRSxJQUFJO3lCQUNaO3FCQUNGO2lCQUNGO3NJQUVVLE1BQU07c0JBQWQsS0FBSztnQkFDRyxLQUFLO3NCQUFiLEtBQUs7Z0JBRUcsR0FBRztzQkFBWCxLQUFLO2dCQUNHLEdBQUc7c0JBQVgsS0FBSztnQkFFRyxNQUFNO3NCQUFkLEtBQUs7Z0JBQ0csT0FBTztzQkFBZixLQUFLO2dCQWlDTixTQUFTO3NCQURSLFlBQVk7dUJBQUMsU0FBUyxFQUFFLENBQUMsUUFBUSxDQUFDO2dCQWVuQyxVQUFVO3NCQURULFlBQVk7dUJBQUMsVUFBVSxFQUFFLENBQUMsUUFBUSxDQUFDO2dCQWtCcEMsT0FBTztzQkFETixZQUFZO3VCQUFDLE9BQU8sRUFBRSxDQUFDLFFBQVEsQ0FBQztnQkE0Q2pDLE1BQU07c0JBREwsWUFBWTt1QkFBQyxNQUFNLEVBQUUsQ0FBQyxRQUFRLENBQUM7Z0JBMEJoQyxnQkFBZ0I7c0JBRGYsWUFBWTt1QkFBQyxnQkFBZ0IsRUFBRSxDQUFDLFFBQVEsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IERpcmVjdGl2ZSwgRWxlbWVudFJlZiwgSG9zdExpc3RlbmVyLCBJbnB1dCwgT25Jbml0LCBmb3J3YXJkUmVmIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEFic3RyYWN0Q29udHJvbCwgQ29udHJvbFZhbHVlQWNjZXNzb3IsIE5HX1ZBTElEQVRPUlMsIE5HX1ZBTFVFX0FDQ0VTU09SLCBWYWxpZGF0aW9uRXJyb3JzLCBWYWxpZGF0b3IgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XHJcbmltcG9ydCB7IE5neEN1cnJlbmN5TWFza1NlcnZpY2UgfSBmcm9tICcuL25neC1jdXJyZW5jeS1tYXNrLnNlcnZpY2UnO1xyXG5cclxuQERpcmVjdGl2ZSh7XHJcbiAgc2VsZWN0b3I6ICdbY3VycmVuY3lNYXNrXScsXHJcbiAgaG9zdDoge1xyXG4gICAgJ1tzdHlsZS50ZXh0LWFsaWduXSc6ICdzZXJ2aWNlLnRleHRBbGlnbicsXHJcbiAgfSxcclxuICBwcm92aWRlcnM6IFtcclxuICAgIHtcclxuICAgICAgcHJvdmlkZTogTkdfVkFMVUVfQUNDRVNTT1IsXHJcbiAgICAgIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IE5neEN1cnJlbmN5TWFza0RpcmVjdGl2ZSksXHJcbiAgICAgIG11bHRpOiB0cnVlLFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgcHJvdmlkZTogTkdfVkFMSURBVE9SUyxcclxuICAgICAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gTmd4Q3VycmVuY3lNYXNrRGlyZWN0aXZlKSxcclxuICAgICAgbXVsdGk6IHRydWUsXHJcbiAgICB9LFxyXG4gIF0sXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBOZ3hDdXJyZW5jeU1hc2tEaXJlY3RpdmUgaW1wbGVtZW50cyBDb250cm9sVmFsdWVBY2Nlc3NvciwgVmFsaWRhdG9yLCBPbkluaXQge1xyXG4gIEBJbnB1dCgpIGxvY2FsZTogc3RyaW5nID0gdGhpcy5zZXJ2aWNlLmxvY2FsZTtcclxuICBASW5wdXQoKSBzY2FsZTogc3RyaW5nID0gdGhpcy5zZXJ2aWNlLnNjYWxlO1xyXG5cclxuICBASW5wdXQoKSBtYXghOiBudW1iZXIgfCBzdHJpbmc7XHJcbiAgQElucHV0KCkgbWluITogbnVtYmVyIHwgc3RyaW5nO1xyXG5cclxuICBASW5wdXQoKSBwcmVmaXg6IHN0cmluZyA9IHRoaXMuc2VydmljZS5wcmVmaXg7XHJcbiAgQElucHV0KCkgcG9zdGZpeDogc3RyaW5nID0gdGhpcy5zZXJ2aWNlLnBvc3RmaXg7XHJcblxyXG4gIG1pblNjYWxlOiBudW1iZXIgPSAwO1xyXG4gIG1heFNjYWxlOiBudW1iZXIgPSAwO1xyXG4gIGludGVnZXJTY2FsZTogbnVtYmVyID0gMTtcclxuXHJcbiAgdGhvdXNhbmRzU2VwYXJhdG9yOiBzdHJpbmcgPSAnLCc7XHJcbiAgZGVjaW1hbFNlcGFyYXRvcjogc3RyaW5nID0gJy4nO1xyXG5cclxuICBwcml2YXRlIG9uQ2hhbmdlOiAodmFsdWU6IGFueSkgPT4gdm9pZCA9ICgpID0+IHsgfTtcclxuICBwcml2YXRlIG9uVG91Y2hlZDogKCkgPT4gdm9pZCA9ICgpID0+IHsgfTtcclxuXHJcbiAgY29uc3RydWN0b3IoXHJcbiAgICBwcml2YXRlIGVsOiBFbGVtZW50UmVmPEhUTUxJbnB1dEVsZW1lbnQ+LFxyXG4gICAgcHJpdmF0ZSBzZXJ2aWNlOiBOZ3hDdXJyZW5jeU1hc2tTZXJ2aWNlLFxyXG4gICkgeyB9XHJcblxyXG4gIG5nT25Jbml0KCk6IHZvaWQge1xyXG4gICAgaWYgKHRoaXMubG9jYWxlKSB7XHJcbiAgICAgIGNvbnN0IHNlcGVyYXRvciA9IHRoaXMuc2VydmljZS5nZXRTZXBhcmF0b3IodGhpcy5sb2NhbGUpO1xyXG4gICAgICB0aGlzLnRob3VzYW5kc1NlcGFyYXRvciA9IHNlcGVyYXRvci50aG91c2FuZHM7XHJcbiAgICAgIHRoaXMuZGVjaW1hbFNlcGFyYXRvciA9IHNlcGVyYXRvci5kZWNpbWFsO1xyXG4gICAgfVxyXG4gICAgaWYgKHRoaXMuc2NhbGUpIHtcclxuICAgICAgY29uc3Qgc2NhbGVBcnJheSA9IHRoaXMuc2NhbGUuc3BsaXQoL1teMC05XS8pLm1hcChlbCA9PiBOdW1iZXIoZWwpKTtcclxuICAgICAgdGhpcy5pbnRlZ2VyU2NhbGUgPSBzY2FsZUFycmF5WzBdO1xyXG4gICAgICB0aGlzLm1pblNjYWxlID0gc2NhbGVBcnJheVsxXTtcclxuICAgICAgdGhpcy5tYXhTY2FsZSA9IHNjYWxlQXJyYXlbMl07XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuXHJcbiAgQEhvc3RMaXN0ZW5lcigna2V5ZG93bicsIFsnJGV2ZW50J10pXHJcbiAgb25LZXlEb3duKGV2ZW50OiBLZXlib2FyZEV2ZW50KSB7XHJcbiAgICBjb25zdCB0YXJnZXQ6IEhUTUxJbnB1dEVsZW1lbnQgPSBldmVudC50YXJnZXQgYXMgSFRNTElucHV0RWxlbWVudDtcclxuICAgIGNvbnN0IHNlbGVjdGlvblN0YXJ0OiBudW1iZXIgPSB0YXJnZXQuc2VsZWN0aW9uU3RhcnQgYXMgbnVtYmVyO1xyXG5cclxuICAgIGlmIChldmVudC5rZXkgPT0gJ0JhY2tzcGFjZScpIHtcclxuICAgICAgaWYgKHRhcmdldC52YWx1ZVtzZWxlY3Rpb25TdGFydCAtIDFdID09IHRoaXMudGhvdXNhbmRzU2VwYXJhdG9yKSB7XHJcbiAgICAgICAgdGhpcy5zZXJ2aWNlLnNldEN1cnNvclBvc2l0aW9uKHRoaXMuZWwsIHNlbGVjdGlvblN0YXJ0IC0gMSk7XHJcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcblxyXG4gIEBIb3N0TGlzdGVuZXIoJ2tleXByZXNzJywgWyckZXZlbnQnXSlcclxuICBvbktleVByZXNzKGV2ZW50OiBLZXlib2FyZEV2ZW50KSB7XHJcbiAgICBjb25zdCB0YXJnZXQ6IEhUTUxJbnB1dEVsZW1lbnQgPSBldmVudC50YXJnZXQgYXMgSFRNTElucHV0RWxlbWVudDtcclxuICAgIGNvbnN0IHNlbGVjdGlvblN0YXJ0OiBudW1iZXIgPSB0YXJnZXQuc2VsZWN0aW9uU3RhcnQgYXMgbnVtYmVyO1xyXG5cclxuICAgIGlmIChldmVudC5rZXkgPT0gdGhpcy5kZWNpbWFsU2VwYXJhdG9yKSB7XHJcbiAgICAgIGlmICgodGFyZ2V0LnZhbHVlLm1hdGNoKG5ldyBSZWdFeHAoYFxcXFwke3RoaXMuZGVjaW1hbFNlcGFyYXRvcn1gLCAnZycpKT8ubGVuZ3RoID8/IDApID4gMCB8fCBzZWxlY3Rpb25TdGFydCAhPSB0YXJnZXQudmFsdWUubGVuZ3RoKSB7XHJcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmIChldmVudC5rZXkubWF0Y2gobmV3IFJlZ0V4cChgW14wLTlcXFxcJHt0aGlzLmRlY2ltYWxTZXBhcmF0b3J9XFwtXWAsICdnJykpKSB7XHJcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuXHJcbiAgQEhvc3RMaXN0ZW5lcignaW5wdXQnLCBbJyRldmVudCddKVxyXG4gIG9uSW5wdXQoZXZlbnQ6IElucHV0RXZlbnQpIHtcclxuICAgIGNvbnN0IHRhcmdldDogSFRNTElucHV0RWxlbWVudCA9IGV2ZW50LnRhcmdldCBhcyBIVE1MSW5wdXRFbGVtZW50O1xyXG4gICAgbGV0IHNlbGVjdGlvbkluZGV4OiBudW1iZXIgPSB0YXJnZXQuc2VsZWN0aW9uU3RhcnQgPz8gdGFyZ2V0LnZhbHVlLmxlbmd0aDtcclxuXHJcbiAgICAvLyBTa2lwIGhhbmRsaW5nIGlucHV0IG1ldGhvZHMgdGhhdCByZXF1aXJlIGNvbXBvc2l0aW9uXHJcbiAgICBpZiAoZXZlbnQuaXNDb21wb3NpbmcpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0YXJnZXQudmFsdWUuZW5kc1dpdGgodGhpcy5kZWNpbWFsU2VwYXJhdG9yKSkge1xyXG4gICAgICBpZiAoc2VsZWN0aW9uSW5kZXggPT0gdGFyZ2V0LnZhbHVlLmxlbmd0aCkge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG4gICAgICBzZWxlY3Rpb25JbmRleCsrO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0YXJnZXQudmFsdWUpIHtcclxuICAgICAgbGV0IGRlY2ltYWxGb3JtYXQ6IHN0cmluZyA9IHRoaXMuc2VydmljZS50b0RlY2ltYWxGb3JtYXQodGFyZ2V0LnZhbHVlLCB0aGlzLmRlY2ltYWxTZXBhcmF0b3IpO1xyXG4gICAgICBjb25zdCBkZWNpbWFsUGFydCA9IHRhcmdldC52YWx1ZS5zcGxpdCh0aGlzLmRlY2ltYWxTZXBhcmF0b3IpWzFdO1xyXG4gICAgICBjb25zdCBkZWNpbWFsUGxhY2VzID0gZGVjaW1hbFBhcnQgPyAoZGVjaW1hbFBhcnQubGVuZ3RoID4gdGhpcy5tYXhTY2FsZSA/IHRoaXMubWF4U2NhbGUgOiBkZWNpbWFsUGFydC5sZW5ndGgpIDogMDtcclxuXHJcbiAgICAgIGNvbnN0IHRydW5jUnRuID0gdGhpcy5zZXJ2aWNlLnRydW5jYXRlTnVtYmVyKGRlY2ltYWxGb3JtYXQsIHRoaXMuZGVjaW1hbFNlcGFyYXRvciwgdGhpcy5tYXhTY2FsZSk7XHJcbiAgICAgIGNvbnN0IGRlY2ltYWxOdW1iZXIgPSBOdW1iZXIodHJ1bmNSdG4udmFsdWUpO1xyXG5cclxuICAgICAgY29uc3QgY3VycmVuY3lGb3JtYXQgPSBkZWNpbWFsTnVtYmVyLnRvTG9jYWxlU3RyaW5nKHRoaXMubG9jYWxlLCB7XHJcbiAgICAgICAgbWluaW11bUZyYWN0aW9uRGlnaXRzOiBkZWNpbWFsUGxhY2VzLFxyXG4gICAgICAgIG1heGltdW1GcmFjdGlvbkRpZ2l0czogdGhpcy5tYXhTY2FsZVxyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIGNvbnN0IGN1cnNvck9mZnNldCA9IGN1cnJlbmN5Rm9ybWF0Lmxlbmd0aCArIHRoaXMucHJlZml4Py5sZW5ndGggKyB0aGlzLnBvc3RmaXg/Lmxlbmd0aCAtIHRhcmdldC52YWx1ZS5sZW5ndGggKyB0cnVuY1J0bi5vZmZzZXQ7XHJcbiAgICAgIHRhcmdldC52YWx1ZSA9IHRoaXMucHJlZml4ICsgY3VycmVuY3lGb3JtYXQgKyB0aGlzLnBvc3RmaXg7XHJcbiAgICAgIHRoaXMuc2VydmljZS5zZXRDdXJzb3JQb3NpdGlvbih0aGlzLmVsLCBzZWxlY3Rpb25JbmRleCArIGN1cnNvck9mZnNldCk7XHJcblxyXG4gICAgICB0aGlzLm9uQ2hhbmdlKGRlY2ltYWxOdW1iZXIpO1xyXG4gICAgICB0aGlzLm9uVG91Y2hlZCgpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5vbkNoYW5nZSh1bmRlZmluZWQpO1xyXG4gICAgICB0aGlzLm9uVG91Y2hlZCgpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcblxyXG4gIEBIb3N0TGlzdGVuZXIoJ2JsdXInLCBbJyRldmVudCddKVxyXG4gIG9uQmx1cihldmVudDogYW55KSB7XHJcbiAgICBjb25zdCB0YXJnZXQ6IEhUTUxJbnB1dEVsZW1lbnQgPSBldmVudC50YXJnZXQgYXMgSFRNTElucHV0RWxlbWVudDtcclxuXHJcbiAgICBpZiAodGFyZ2V0LnZhbHVlKSB7XHJcbiAgICAgIGlmICh0YXJnZXQudmFsdWUuZW5kc1dpdGgodGhpcy5kZWNpbWFsU2VwYXJhdG9yKSkge1xyXG4gICAgICAgIHRhcmdldC52YWx1ZSA9IHRhcmdldC52YWx1ZS5zbGljZSgwLCAtMSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGxldCBkZWNpbWFsRm9ybWF0OiBzdHJpbmcgPSB0aGlzLnNlcnZpY2UudG9EZWNpbWFsRm9ybWF0KHRhcmdldC52YWx1ZSwgdGhpcy5kZWNpbWFsU2VwYXJhdG9yKTtcclxuICAgICAgY29uc3QgZGVjaW1hbE51bWJlciA9IE51bWJlcih0aGlzLnNlcnZpY2UudHJ1bmNhdGVOdW1iZXIoZGVjaW1hbEZvcm1hdCwgdGhpcy5kZWNpbWFsU2VwYXJhdG9yLCB0aGlzLm1heFNjYWxlKS52YWx1ZSk7XHJcblxyXG4gICAgICBjb25zdCBjdXJyZW5jeUZvcm1hdCA9IGRlY2ltYWxOdW1iZXIudG9Mb2NhbGVTdHJpbmcodGhpcy5sb2NhbGUsIHtcclxuICAgICAgICBtaW5pbXVtSW50ZWdlckRpZ2l0czogdGhpcy5pbnRlZ2VyU2NhbGUsXHJcbiAgICAgICAgbWluaW11bUZyYWN0aW9uRGlnaXRzOiB0aGlzLm1heFNjYWxlLFxyXG4gICAgICAgIG1heGltdW1GcmFjdGlvbkRpZ2l0czogdGhpcy5tYXhTY2FsZVxyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIHRhcmdldC52YWx1ZSA9IHRoaXMucHJlZml4ICsgY3VycmVuY3lGb3JtYXQgKyB0aGlzLnBvc3RmaXg7XHJcblxyXG4gICAgICB0aGlzLm9uQ2hhbmdlKGRlY2ltYWxOdW1iZXIpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcblxyXG4gIEBIb3N0TGlzdGVuZXIoJ2NvbXBvc2l0aW9uZW5kJywgWyckZXZlbnQnXSlcclxuICBvbkNvbXBvc2l0aW9uRW5kKGV2ZW50OiBDb21wb3NpdGlvbkV2ZW50KTogdm9pZCB7XHJcbiAgICBjb25zdCB0YXJnZXQ6IEhUTUxJbnB1dEVsZW1lbnQgPSBldmVudC50YXJnZXQgYXMgSFRNTElucHV0RWxlbWVudDtcclxuICAgIGNvbnN0IHNlbGVjdGlvblN0YXJ0OiBudW1iZXIgPSB0YXJnZXQuc2VsZWN0aW9uU3RhcnQgPz8gdGFyZ2V0LnZhbHVlLmxlbmd0aDtcclxuXHJcbiAgICBpZiAodGFyZ2V0LnZhbHVlKSB7XHJcbiAgICAgIGNvbnN0IGRlY2ltYWxGb3JtYXQgPSB0aGlzLnNlcnZpY2UudG9EZWNpbWFsRm9ybWF0KHRhcmdldC52YWx1ZSwgdGhpcy5kZWNpbWFsU2VwYXJhdG9yKTtcclxuICAgICAgY29uc3QgY3VycmVuY3lGb3JtYXQgPSBOdW1iZXIoZGVjaW1hbEZvcm1hdCkudG9Mb2NhbGVTdHJpbmcodGhpcy5sb2NhbGUpO1xyXG5cclxuICAgICAgY29uc3QgY3Vyc29yT2Zmc2V0ID0gY3VycmVuY3lGb3JtYXQubGVuZ3RoIC0gdGFyZ2V0LnZhbHVlLmxlbmd0aDtcclxuICAgICAgdGFyZ2V0LnZhbHVlID0gY3VycmVuY3lGb3JtYXQ7XHJcbiAgICAgIHRoaXMuc2VydmljZS5zZXRDdXJzb3JQb3NpdGlvbih0aGlzLmVsLCBzZWxlY3Rpb25TdGFydCArIGN1cnNvck9mZnNldCk7XHJcblxyXG4gICAgICB0aGlzLm9uQ2hhbmdlKGRlY2ltYWxGb3JtYXQpO1xyXG4gICAgICB0aGlzLm9uVG91Y2hlZCgpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcblxyXG5cclxuXHJcbiAgLyogVmFsaWRhdG9yICovXHJcbiAgdmFsaWRhdGUoY29udHJvbDogQWJzdHJhY3RDb250cm9sPGFueSwgYW55Pik6IFZhbGlkYXRpb25FcnJvcnMgfCBudWxsIHtcclxuICAgIGlmICh0aGlzLm1heCAmJiB0aGlzLm1heCA8IGNvbnRyb2wudmFsdWUpIHtcclxuICAgICAgcmV0dXJuIHsgbWF4OiB0cnVlIH07XHJcbiAgICB9XHJcbiAgICBpZiAodGhpcy5taW4gJiYgdGhpcy5taW4gPiBjb250cm9sLnZhbHVlKSB7XHJcbiAgICAgIHJldHVybiB7IG1pbjogdHJ1ZSB9O1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIG51bGw7XHJcbiAgfVxyXG5cclxuXHJcblxyXG5cclxuICAvKiBDb250cm9sVmFsdWVBY2Nlc3NvciAqL1xyXG4gIHdyaXRlVmFsdWUodmFsdWU6IGFueSk6IHZvaWQge1xyXG4gICAgaWYgKHZhbHVlKSB7XHJcbiAgICAgIHRoaXMuZWwubmF0aXZlRWxlbWVudC52YWx1ZSA9XHJcbiAgICAgICAgdGhpcy5wcmVmaXggKyBOdW1iZXIodmFsdWUpLnRvTG9jYWxlU3RyaW5nKHRoaXMubG9jYWxlLCB7XHJcbiAgICAgICAgICBtaW5pbXVtSW50ZWdlckRpZ2l0czogdGhpcy5pbnRlZ2VyU2NhbGUsXHJcbiAgICAgICAgICBtaW5pbXVtRnJhY3Rpb25EaWdpdHM6IHRoaXMubWluU2NhbGUsXHJcbiAgICAgICAgICBtYXhpbXVtRnJhY3Rpb25EaWdpdHM6IHRoaXMubWF4U2NhbGVcclxuICAgICAgICB9KSArIHRoaXMucG9zdGZpeDtcclxuXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZWdpc3Rlck9uQ2hhbmdlKGZuOiBhbnkpOiB2b2lkIHtcclxuICAgIHRoaXMub25DaGFuZ2UgPSBmbjtcclxuICB9XHJcblxyXG4gIHJlZ2lzdGVyT25Ub3VjaGVkKGZuOiBhbnkpOiB2b2lkIHtcclxuICAgIHRoaXMub25Ub3VjaGVkID0gZm47XHJcbiAgfVxyXG5cclxuICBzZXREaXNhYmxlZFN0YXRlPyhpc0Rpc2FibGVkOiBib29sZWFuKTogdm9pZCB7XHJcbiAgICB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQuZGlzYWJsZWQgPSBpc0Rpc2FibGVkO1xyXG4gIH1cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcbn1cclxuIl19