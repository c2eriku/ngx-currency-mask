import { Directive, ElementRef, HostListener, forwardRef } from '@angular/core';
import { AbstractControl, ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator } from '@angular/forms';
import { NgxCurrencyMaskService } from './ngx-currency-mask.service';

@Directive({
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
})
export class NgxCurrencyMaskDirective implements ControlValueAccessor, Validator {
  private onChange: (value: any) => void = () => { };
  private onTouched: () => void = () => { };

  constructor(
    private el: ElementRef<HTMLInputElement>,
    private service: NgxCurrencyMaskService,
  ) { }


  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    const target: HTMLInputElement = event.target as HTMLInputElement;
    const selectionStart: number = target.selectionStart as number;

    if (event.key == 'Backspace') {
      if (target.value[selectionStart - 1] == this.service.groupSymbol) {
        this.service.setCursorPosition(target, selectionStart - 1)
        event.preventDefault();
      }
    }
  }


  @HostListener('keypress', ['$event'])
  onKeyPress(event: KeyboardEvent) {
    const target: HTMLInputElement = event.target as HTMLInputElement;
    const selectionStart: number = target.selectionStart as number;

    if (event.key == '.') {
      if ((target.value.match(/\./g)?.length ?? 0) > 0 || selectionStart != target.value.length) {
        event.preventDefault();
      }
    }

    if (event.key.match(this.service.nonDigitsPattern)) {
      event.preventDefault();
    }
  }


  @HostListener('input', ['$event'])
  onInput(event: InputEvent) {
    const target: HTMLInputElement = event.target as HTMLInputElement;
    const value: string = target.value;
    const selectionStart: number = target.selectionStart ?? value.length;

    // Skip handling input methods that require composition
    if (event.isComposing) {
      return;
    }

    if (value.match(this.service.decimalSymbolPattern) && selectionStart == value.length) {
      return;
    }

    if (target.value) {
      const decimalFormat = this.service.formatDecimal(value);
      const currencyFormat = this.service.formatCurrency(decimalFormat, 0, this.service.maximumFractionDigits);
      target.value = currencyFormat;
      const cursorOffset = currencyFormat.length - value.length;
      this.service.setCursorPosition(target, selectionStart + cursorOffset);
      this.onChange(decimalFormat);
      this.onTouched();
    }
  }


  @HostListener('blur', ['$event'])
  onBlur(event: any) {
    const target: HTMLInputElement = event.target as HTMLInputElement;
    const selectionStart: number = target.selectionStart ?? target.value.length;
    if (target.value) {
      if (target.value.endsWith(this.service.decimalSymbol)) {
        target.value = target.value.slice(0, -1);
      }
      const decimalFormat = this.service.formatDecimal(target.value);
      const currencyFormat = this.service.formatCurrency(decimalFormat);
      target.value = currencyFormat;
      const cursorOffset = currencyFormat.length - target.value.length;
      this.service.setCursorPosition(target, selectionStart + cursorOffset);
      this.onChange(decimalFormat);
    }
  }


  @HostListener('compositionend', ['$event'])
  onCompositionEnd(event: CompositionEvent): void {
    const target: HTMLInputElement = event.target as HTMLInputElement;
    const value: string = target.value;
    const selectionStart: number = target.selectionStart ?? value.length;

    if (target.value) {
      const decimalFormat = this.service.formatDecimal(target.value.replace(this.service.nonDigitsPattern, ''));
      const currencyFormat = this.service.formatCurrency(decimalFormat);
      target.value = currencyFormat;
      const cursorOffset = currencyFormat.length - value.length;
      this.service.setCursorPosition(target, selectionStart + cursorOffset);

      this.onChange(decimalFormat);
      this.onTouched();
    }
  }




  /* Validator */
  validate(control: AbstractControl<any, any>): ValidationErrors | null {
    return null;
  }




  /* ControlValueAccessor */
  writeValue(value: any): void {
    if (value) {
      this.el.nativeElement.value = this.service.formatCurrency(value);
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.el.nativeElement.disabled = isDisabled;
  }
}
