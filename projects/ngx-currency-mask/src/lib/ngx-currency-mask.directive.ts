import { Directive, ElementRef, HostListener, Input, OnInit, forwardRef } from '@angular/core';
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
export class NgxCurrencyMaskDirective implements ControlValueAccessor, Validator, OnInit {
  @Input() locale: string = this.service.locale;
  @Input() scale: string = this.service.scale;
  minScale: number = 0;
  maxScale: number = 0;
  IntegerScale: number = 1;
  thousandsSeparator: string = ',';
  decimalSeparator: string = '.';

  private onChange: (value: any) => void = () => { };
  private onTouched: () => void = () => { };

  constructor(
    private el: ElementRef<HTMLInputElement>,
    private service: NgxCurrencyMaskService,
  ) { }

  ngOnInit(): void {
    if (this.locale) {
      const seperator = this.service.getSeparator(this.locale);
      this.thousandsSeparator = seperator.thousands;
      this.decimalSeparator = seperator.decimal;
    }
    if (this.scale) {
      const scaleArray = this.scale.split(/[^0-9]/).map(el => Number(el));
      this.IntegerScale = scaleArray[0];
      this.minScale = scaleArray[1];
      this.maxScale = scaleArray[2];
    }

  }


  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    const target: HTMLInputElement = event.target as HTMLInputElement;
    const selectionStart: number = target.selectionStart as number;

    if (event.key == 'Backspace') {
      if (target.value[selectionStart - 1] == this.thousandsSeparator) {
        this.setCursorPosition(selectionStart - 1);
        event.preventDefault();
      }
    }
  }


  @HostListener('keypress', ['$event'])
  onKeyPress(event: KeyboardEvent) {
    const target: HTMLInputElement = event.target as HTMLInputElement;
    const selectionStart: number = target.selectionStart as number;

    if (event.key == this.decimalSeparator) {
      if ((target.value.match(new RegExp(`\\${this.decimalSeparator}`, 'g'))?.length ?? 0) > 0 || selectionStart != target.value.length) {
        event.preventDefault();
      }
    }

    if (event.key.match(new RegExp(`[^0-9\\${this.decimalSeparator}\-]`, 'g'))) {
      event.preventDefault();
    }
  }


  @HostListener('input', ['$event'])
  onInput(event: InputEvent) {
    const target: HTMLInputElement = event.target as HTMLInputElement;
    const selectionStart: number = target.selectionStart ?? target.value.length;

    // Skip handling input methods that require composition
    if (event.isComposing) {
      return;
    }

    if (target.value.endsWith(this.decimalSeparator) && selectionStart == target.value.length) {
      return;
    }

    if (target.value) {
      let decimalNumber: number = this.getDecimalNumber(target.value);
      const decimalPart = target.value.split(this.decimalSeparator)[1];
      const decimalPlaces = decimalPart ? (decimalPart.length > this.maxScale ? this.maxScale : decimalPart.length) : 0;

      decimalNumber = this.truncateNumber(decimalNumber, decimalPlaces);
      const currencyFormat = Number(decimalNumber).toLocaleString(this.locale, {
        minimumFractionDigits: decimalPlaces,
        maximumFractionDigits: this.maxScale
      });

      const cursorOffset = currencyFormat.length - target.value.length;
      target.value = currencyFormat;
      this.setCursorPosition(selectionStart + cursorOffset);

      this.onChange(decimalNumber);
      this.onTouched();
    } else {
      this.onChange(undefined);
      this.onTouched();
    }
  }


  @HostListener('blur', ['$event'])
  onBlur(event: any) {
    const target: HTMLInputElement = event.target as HTMLInputElement;
    const selectionStart: number = target.selectionStart ?? target.value.length;

    if (target.value) {
      if (target.value.endsWith(this.decimalSeparator)) {
        target.value = target.value.slice(0, -1);
      }
      let decimalNumber: number = this.getDecimalNumber(target.value);
      decimalNumber = this.truncateNumber(decimalNumber, this.maxScale);
      const currencyFormat = Number(decimalNumber).toLocaleString(this.locale, {
        minimumIntegerDigits: this.IntegerScale,
        minimumFractionDigits: this.maxScale,
        maximumFractionDigits: this.maxScale
      });

      const cursorOffset = currencyFormat.length - target.value.length;
      target.value = currencyFormat;
      this.setCursorPosition(selectionStart + cursorOffset);

      this.onChange(decimalNumber);
    }
  }


  @HostListener('compositionend', ['$event'])
  onCompositionEnd(event: CompositionEvent): void {
    const target: HTMLInputElement = event.target as HTMLInputElement;
    const selectionStart: number = target.selectionStart ?? target.value.length;

    if (target.value) {
      const decimalFormat = this.getDecimalNumber(target.value);
      const currencyFormat = Number(decimalFormat).toLocaleString(this.locale);

      const cursorOffset = currencyFormat.length - target.value.length;
      target.value = currencyFormat;
      this.setCursorPosition(selectionStart + cursorOffset);

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
      this.el.nativeElement.value = Number(value).toLocaleString(this.locale, {
        minimumIntegerDigits: this.IntegerScale,
        minimumFractionDigits: this.minScale,
        maximumFractionDigits: this.maxScale
      });
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





  getDecimalNumber(value: string): number {
    const decimalFormat = value.replace(new RegExp(`[^0-9\\${this.decimalSeparator}\-]`, 'g'), '')
      .replace(new RegExp(`\\${this.decimalSeparator}`, 'g'), '.');
    return Number(decimalFormat);
  }


  /**
   * Truncates a number to a specified number of decimal places.
   * @param {number} number A number to be truncated.
   * @param {number} decimalPlaces A number of decimal places to truncate to.
   * @returns {number} The truncated number.
   */
  truncateNumber(number: number, decimalPlaces: number): number {
    const factor = Math.pow(10, decimalPlaces);
    return Math.floor(number * factor) / factor;
  }


  /**
   * Sets the cursor position within an HTMLInputElement.
   * @param {HTMLInputElement} el An input element to set the cursor position for.
   * @param {number} cursorPosition The desired cursor position to set.
   */
  setCursorPosition(cursorPosition: number): void {
    if (cursorPosition <= -1) {
      cursorPosition = 0;
    }
    this.el.nativeElement.setSelectionRange(cursorPosition, cursorPosition);
  }
}
