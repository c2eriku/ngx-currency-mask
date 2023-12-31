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
        this.service.setCursorPosition(this.el, selectionStart - 1);
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
      let decimalFormat: string = this.service.toDecimalFormat(target.value, this.decimalSeparator);
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

      let decimalFormat: string = this.service.toDecimalFormat(target.value, this.decimalSeparator);
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


  @HostListener('compositionend', ['$event'])
  onCompositionEnd(event: CompositionEvent): void {
    const target: HTMLInputElement = event.target as HTMLInputElement;
    const selectionStart: number = target.selectionStart ?? target.value.length;

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
    } else {
      this.el.nativeElement.value = '';
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
