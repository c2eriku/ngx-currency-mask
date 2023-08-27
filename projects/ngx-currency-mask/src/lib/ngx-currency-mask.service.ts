import { Inject, Injectable, Optional } from '@angular/core';
import { NGX_CURRENCY_MASK_CONFIG, NgxCurrencyMaskConfig } from './ngx-currency-mask.config';

@Injectable({
  providedIn: 'root'
})
export class NgxCurrencyMaskService {
  // Configuration variable
  locale: string = 'en-US';

  minimumFractionDigits: number = 0;
  maximumFractionDigits: number = 0;

  textAlign: string = 'left';

  groupSymbol: string = ',';
  decimalSymbol: string = '.';

  // General variable
  nonDigitsPattern: RegExp = new RegExp(`[^0-9\\${this.decimalSymbol}\-]`, 'g');
  groupSymbolPattern: RegExp = new RegExp(`\\${this.groupSymbol}`, 'g');
  decimalSymbolPattern: RegExp = new RegExp(`\\${this.decimalSymbol}`, 'g');

  constructor(
    @Optional() @Inject(NGX_CURRENCY_MASK_CONFIG) config: NgxCurrencyMaskConfig
  ) {
    this.locale = config?.locale;
    this.textAlign = config?.textAlign;
    this.minimumFractionDigits = config?.minimumFractionDigits;
    this.maximumFractionDigits = config?.maximumFractionDigits;

    this.setLocaleSymbols();
    // this.groupSymbol = config?.groupSymbol;
    // this.decimalSymbol = config?.decimalSymbol;
  }


  /**
   * Sets grouping and decimal symbols based on current locale.
   */
  setLocaleSymbols(): void {
    const numberFormatter = new Intl.NumberFormat(this.locale);
    const groupValue = numberFormatter.format(9999);
    const decimalValue = numberFormatter.format(9.99);

    // Extract the decimal and group symbols
    this.groupSymbol = groupValue.replace(/\d/g, '');
    this.decimalSymbol = decimalValue.replace(/\d/g, '');
  }



  /**
   * Sets the cursor position within an HTMLInputElement.
   * @param {HTMLInputElement} el An input element to set the cursor position for.
   * @param {number} cursorPosition The desired cursor position to set.
   */
  setCursorPosition(el: HTMLInputElement, cursorPosition: number): void {
    if (cursorPosition <= -1) {
      cursorPosition = 0;
    }
    el.setSelectionRange(cursorPosition, cursorPosition);
  }


  /**
   * Calculates the number of decimal places in a string representation of a number.
   * @param {string} str A string representation of the number.
   * @returns {number} Counts of decimal places in input string.
   */
  getDecimalPlaces(str: string): number {
    const decimalPart = str.split(this.decimalSymbol)[1];
    return decimalPart ? (decimalPart.length > this.maximumFractionDigits ? this.maximumFractionDigits : decimalPart.length) : 0;
  }


  /**
   * Formats a string representation of a number by removing grouping symbols
   * and truncating to a specific number of decimal places.
   * @param {string} value A string representation of the number.
   * @param {number} decimalPlaces Number of decimal places to retain.
   * @returns {string} A decimal formatted number as a string.
   */
  formatDecimal(value: string, decimalPlaces: number = this.maximumFractionDigits): string {
    const decimalFormat = value?.replace(this.groupSymbolPattern, '').replace(this.groupSymbolPattern, '.');
    return this.truncateNumber(parseFloat(decimalFormat), decimalPlaces)?.toString();
  }


  /**
   * Formats a string representation of a number as a currency formatted value.
   * @param {string} value A string representation of the number.
   * @param {number} minimumFractionDigits The minimum number of decimal places.
   * @param {number} maximumFractionDigits The maximum number of decimal places.
   * @returns {string} A formatted currency value as a string.
   */
  formatCurrency(value: string, minimumFractionDigits: number = this.minimumFractionDigits, maximumFractionDigits: number = this.maximumFractionDigits): string {
    const currencyFormat = Number(value).toLocaleString(this.locale,
      {
        minimumFractionDigits: minimumFractionDigits,
        maximumFractionDigits: maximumFractionDigits
      });
    return currencyFormat;
  }


  /**
   * Truncates a number to a specified number of decimal places.
   * @param {number} number A number to be truncated.
   * @param {number} decimalPlaces A number of decimal places to truncate to.
   * @returns {number} The truncated number.
   */
  truncateNumber(number: number, decimalPlaces: number = this.maximumFractionDigits): number {
    const factor = Math.pow(10, decimalPlaces);
    return Math.floor(number * factor) / factor;
  }
}
