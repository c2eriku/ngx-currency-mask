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

  @Input() max!: number | string;
  @Input() min!: number | string;

  @Input() prefix: string = this.service.prefix;
  @Input() postfix: string = this.service.postfix;

  minScale: number = 0;
  maxScale: number = 0;
  integerScale: number = 1;

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
      this.integerScale = scaleArray[0];
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
    let selectionIndex: number = target.selectionStart ?? target.value.length;

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
      let decimalFormat: string = this.toDecimalFormat(target.value);
      const decimalPart = target.value.split(this.decimalSeparator)[1];
      const decimalPlaces = decimalPart ? (decimalPart.length > this.maxScale ? this.maxScale : decimalPart.length) : 0;

      const truncRtn = this.truncateNumber(decimalFormat);
      const decimalNumber = Number(truncRtn.value);

      const currencyFormat = decimalNumber.toLocaleString(this.locale, {
        minimumFractionDigits: decimalPlaces,
        maximumFractionDigits: this.maxScale
      });

      const cursorOffset = currencyFormat.length + this.prefix?.length + this.postfix?.length - target.value.length + truncRtn.offset;
      target.value = this.prefix + currencyFormat + this.postfix;
      this.setCursorPosition(selectionIndex + cursorOffset);

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

    if (target.value) {
      if (target.value.endsWith(this.decimalSeparator)) {
        target.value = target.value.slice(0, -1);
      }

      let decimalFormat: string = this.toDecimalFormat(target.value);
      const decimalNumber = Number(this.truncateNumber(decimalFormat).value);

      const currencyFormat = decimalNumber.toLocaleString(this.locale, {
        minimumIntegerDigits: this.integerScale,
        minimumFractionDigits: this.maxScale,
        maximumFractionDigits: this.maxScale
      });

      target.value = this.prefix + currencyFormat + this.postfix;

      this.onChange(decimalNumber);
    }
  }


  @HostListener('compositionend', ['$event'])
  onCompositionEnd(event: CompositionEvent): void {
    const target: HTMLInputElement = event.target as HTMLInputElement;
    const selectionStart: number = target.selectionStart ?? target.value.length;

    if (target.value) {
      const decimalFormat = this.toDecimalFormat(target.value);
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
    if (this.max && this.max < control.value) {
      return { max: true };
    }
    if (this.min && this.min > control.value) {
      return { min: true };
    }
    return null;
  }




  /* ControlValueAccessor */
  writeValue(value: any): void {
    if (value) {
      this.el.nativeElement.value =
        this.prefix + Number(value).toLocaleString(this.locale, {
          minimumIntegerDigits: this.integerScale,
          minimumFractionDigits: this.minScale,
          maximumFractionDigits: this.maxScale
        }) + this.postfix;

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

  
  toDecimalFormat(value: string): string {
    const decimalFormat = value.replace(new RegExp(`[^0-9\\${this.decimalSeparator}\-]`, 'g'), '')
      .replace(new RegExp(`\\${this.decimalSeparator}`, 'g'), '.');
    return decimalFormat;
  }


  truncateNumber(numStr: string): any {
    if (isNaN(Number(numStr))) { throw new Error('It\'s not a Number!'); }
    const separatorIndex = numStr.search(new RegExp(`\\${this.decimalSeparator}`, 'g'));
    if (separatorIndex > -1) {
      const truncateNumber = numStr.slice(0, separatorIndex + this.maxScale + 1);
      return {
        value: truncateNumber,
        offset: numStr.length - truncateNumber.length
      };
    }

    return {
      value: numStr,
      offset: 0
    }
  }
}
