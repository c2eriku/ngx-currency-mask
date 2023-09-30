import { Inject, Injectable, Optional } from '@angular/core';
import { NGX_CURRENCY_MASK_CONFIG } from './ngx-currency-mask.config';
import * as i0 from "@angular/core";
import * as i1 from "./ngx-currency-mask.config";
export class NgxCurrencyMaskService {
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
        }], ctorParameters: function () { return [{ type: i1.NgxCurrencyMaskConfig, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [NGX_CURRENCY_MASK_CONFIG]
                }] }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWN1cnJlbmN5LW1hc2suc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL25neC1jdXJyZW5jeS1tYXNrL3NyYy9saWIvbmd4LWN1cnJlbmN5LW1hc2suc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQWMsTUFBTSxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDekUsT0FBTyxFQUFFLHdCQUF3QixFQUF5QixNQUFNLDRCQUE0QixDQUFDOzs7QUFLN0YsTUFBTSxPQUFPLHNCQUFzQjtJQVNqQyxZQUNnRCxNQUE2QjtRQVQ3RSx5QkFBeUI7UUFDekIsV0FBTSxHQUFXLE9BQU8sQ0FBQztRQUN6QixVQUFLLEdBQVcsT0FBTyxDQUFDO1FBRXhCLFVBQUssR0FBVyxNQUFNLENBQUM7UUFDdkIsV0FBTSxHQUFXLEVBQUUsQ0FBQztRQUNwQixZQUFPLEdBQVcsRUFBRSxDQUFDO1FBS25CLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxFQUFFLE1BQU0sQ0FBQztRQUM3QixJQUFJLENBQUMsS0FBSyxHQUFHLE1BQU0sRUFBRSxLQUFLLENBQUM7UUFDM0IsSUFBSSxDQUFDLEtBQUssR0FBRyxNQUFNLEVBQUUsS0FBSyxDQUFDO1FBQzNCLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxFQUFFLE1BQU0sSUFBSSxFQUFFLENBQUM7UUFDbkMsSUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLEVBQUUsT0FBTyxJQUFJLEVBQUUsQ0FBQztJQUN2QyxDQUFDO0lBRUQsWUFBWSxDQUFDLE1BQWM7UUFDekIsT0FBTztZQUNMLFNBQVMsRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDO1lBQ2pFLE9BQU8sRUFBRSxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDO1NBQy9ELENBQUE7SUFDSCxDQUFDO0lBRUQsZUFBZSxDQUFDLEtBQWEsRUFBRSxnQkFBd0I7UUFDckQsTUFBTSxhQUFhLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLE1BQU0sQ0FBQyxVQUFVLGdCQUFnQixLQUFLLEVBQUUsR0FBRyxDQUFDLEVBQUUsRUFBRSxDQUFDO2FBQ3RGLE9BQU8sQ0FBQyxJQUFJLE1BQU0sQ0FBQyxLQUFLLGdCQUFnQixFQUFFLEVBQUUsR0FBRyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDMUQsT0FBTyxhQUFhLENBQUM7SUFDdkIsQ0FBQztJQUVELGNBQWMsQ0FBQyxNQUFjLEVBQUUsZ0JBQXdCLEVBQUUsUUFBZ0I7UUFDdkUsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUU7WUFBRSxNQUFNLElBQUksS0FBSyxDQUFDLHFCQUFxQixDQUFDLENBQUM7U0FBRTtRQUN0RSxNQUFNLGNBQWMsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksTUFBTSxDQUFDLEtBQUssZ0JBQWdCLEVBQUUsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQy9FLElBQUksY0FBYyxHQUFHLENBQUMsQ0FBQyxFQUFFO1lBQ3ZCLE1BQU0sY0FBYyxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLGNBQWMsR0FBRyxRQUFRLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDdEUsT0FBTztnQkFDTCxLQUFLLEVBQUUsY0FBYztnQkFDckIsTUFBTSxFQUFFLE1BQU0sQ0FBQyxNQUFNLEdBQUcsY0FBYyxDQUFDLE1BQU07YUFDOUMsQ0FBQztTQUNIO1FBRUQsT0FBTztZQUNMLEtBQUssRUFBRSxNQUFNO1lBQ2IsTUFBTSxFQUFFLENBQUM7U0FDVixDQUFBO0lBQ0gsQ0FBQztJQUVEOzs7O09BSUc7SUFDSCxpQkFBaUIsQ0FBQyxFQUFnQyxFQUFFLGNBQXNCO1FBQ3hFLElBQUksY0FBYyxJQUFJLENBQUMsQ0FBQyxFQUFFO1lBQ3hCLGNBQWMsR0FBRyxDQUFDLENBQUM7U0FDcEI7UUFDRCxFQUFFLENBQUMsYUFBYSxDQUFDLGlCQUFpQixDQUFDLGNBQWMsRUFBRSxjQUFjLENBQUMsQ0FBQztJQUNyRSxDQUFDOzhHQTNEVSxzQkFBc0Isa0JBVVgsd0JBQXdCO2tIQVZuQyxzQkFBc0IsY0FGckIsTUFBTTs7MkZBRVAsc0JBQXNCO2tCQUhsQyxVQUFVO21CQUFDO29CQUNWLFVBQVUsRUFBRSxNQUFNO2lCQUNuQjs7MEJBV0ksUUFBUTs7MEJBQUksTUFBTTsyQkFBQyx3QkFBd0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBFbGVtZW50UmVmLCBJbmplY3QsIEluamVjdGFibGUsIE9wdGlvbmFsIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IE5HWF9DVVJSRU5DWV9NQVNLX0NPTkZJRywgTmd4Q3VycmVuY3lNYXNrQ29uZmlnIH0gZnJvbSAnLi9uZ3gtY3VycmVuY3ktbWFzay5jb25maWcnO1xyXG5cclxuQEluamVjdGFibGUoe1xyXG4gIHByb3ZpZGVkSW46ICdyb290J1xyXG59KVxyXG5leHBvcnQgY2xhc3MgTmd4Q3VycmVuY3lNYXNrU2VydmljZSB7XHJcbiAgLy8gQ29uZmlndXJhdGlvbiB2YXJpYWJsZVxyXG4gIGxvY2FsZTogc3RyaW5nID0gJ2VuLVVTJztcclxuICBzY2FsZTogc3RyaW5nID0gJzEuMC0wJztcclxuXHJcbiAgYWxpZ246IHN0cmluZyA9ICdsZWZ0JztcclxuICBwcmVmaXg6IHN0cmluZyA9ICcnO1xyXG4gIHBvc3RmaXg6IHN0cmluZyA9ICcnO1xyXG5cclxuICBjb25zdHJ1Y3RvcihcclxuICAgIEBPcHRpb25hbCgpIEBJbmplY3QoTkdYX0NVUlJFTkNZX01BU0tfQ09ORklHKSBjb25maWc6IE5neEN1cnJlbmN5TWFza0NvbmZpZ1xyXG4gICkge1xyXG4gICAgdGhpcy5sb2NhbGUgPSBjb25maWc/LmxvY2FsZTtcclxuICAgIHRoaXMuc2NhbGUgPSBjb25maWc/LnNjYWxlO1xyXG4gICAgdGhpcy5hbGlnbiA9IGNvbmZpZz8uYWxpZ247XHJcbiAgICB0aGlzLnByZWZpeCA9IGNvbmZpZz8ucHJlZml4ID8/ICcnO1xyXG4gICAgdGhpcy5wb3N0Zml4ID0gY29uZmlnPy5wb3N0Zml4ID8/ICcnO1xyXG4gIH1cclxuXHJcbiAgZ2V0U2VwYXJhdG9yKGxvY2FsZTogc3RyaW5nKTogYW55IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHRob3VzYW5kczogTnVtYmVyKDEwMDApLnRvTG9jYWxlU3RyaW5nKGxvY2FsZSkucmVwbGFjZSgvXFxkL2csICcnKSxcclxuICAgICAgZGVjaW1hbDogTnVtYmVyKDAuMSkudG9Mb2NhbGVTdHJpbmcobG9jYWxlKS5yZXBsYWNlKC9cXGQvZywgJycpXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICB0b0RlY2ltYWxGb3JtYXQodmFsdWU6IHN0cmluZywgZGVjaW1hbFNlcGFyYXRvcjogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgIGNvbnN0IGRlY2ltYWxGb3JtYXQgPSB2YWx1ZS5yZXBsYWNlKG5ldyBSZWdFeHAoYFteMC05XFxcXCR7ZGVjaW1hbFNlcGFyYXRvcn1cXC1dYCwgJ2cnKSwgJycpXHJcbiAgICAgIC5yZXBsYWNlKG5ldyBSZWdFeHAoYFxcXFwke2RlY2ltYWxTZXBhcmF0b3J9YCwgJ2cnKSwgJy4nKTtcclxuICAgIHJldHVybiBkZWNpbWFsRm9ybWF0O1xyXG4gIH1cclxuXHJcbiAgdHJ1bmNhdGVOdW1iZXIobnVtU3RyOiBzdHJpbmcsIGRlY2ltYWxTZXBhcmF0b3I6IHN0cmluZywgbWF4U2NhbGU6IG51bWJlcik6IGFueSB7XHJcbiAgICBpZiAoaXNOYU4oTnVtYmVyKG51bVN0cikpKSB7IHRocm93IG5ldyBFcnJvcignSXRcXCdzIG5vdCBhIE51bWJlciEnKTsgfVxyXG4gICAgY29uc3Qgc2VwYXJhdG9ySW5kZXggPSBudW1TdHIuc2VhcmNoKG5ldyBSZWdFeHAoYFxcXFwke2RlY2ltYWxTZXBhcmF0b3J9YCwgJ2cnKSk7XHJcbiAgICBpZiAoc2VwYXJhdG9ySW5kZXggPiAtMSkge1xyXG4gICAgICBjb25zdCB0cnVuY2F0ZU51bWJlciA9IG51bVN0ci5zbGljZSgwLCBzZXBhcmF0b3JJbmRleCArIG1heFNjYWxlICsgMSk7XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgdmFsdWU6IHRydW5jYXRlTnVtYmVyLFxyXG4gICAgICAgIG9mZnNldDogbnVtU3RyLmxlbmd0aCAtIHRydW5jYXRlTnVtYmVyLmxlbmd0aFxyXG4gICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgIHZhbHVlOiBudW1TdHIsXHJcbiAgICAgIG9mZnNldDogMFxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogU2V0cyB0aGUgY3Vyc29yIHBvc2l0aW9uIHdpdGhpbiBhbiBIVE1MSW5wdXRFbGVtZW50LlxyXG4gICAqIEBwYXJhbSB7SFRNTElucHV0RWxlbWVudH0gZWwgQW4gaW5wdXQgZWxlbWVudCB0byBzZXQgdGhlIGN1cnNvciBwb3NpdGlvbiBmb3IuXHJcbiAgICogQHBhcmFtIHtudW1iZXJ9IGN1cnNvclBvc2l0aW9uIFRoZSBkZXNpcmVkIGN1cnNvciBwb3NpdGlvbiB0byBzZXQuXHJcbiAgICovXHJcbiAgc2V0Q3Vyc29yUG9zaXRpb24oZWw6IEVsZW1lbnRSZWY8SFRNTElucHV0RWxlbWVudD4sIGN1cnNvclBvc2l0aW9uOiBudW1iZXIpOiB2b2lkIHtcclxuICAgIGlmIChjdXJzb3JQb3NpdGlvbiA8PSAtMSkge1xyXG4gICAgICBjdXJzb3JQb3NpdGlvbiA9IDA7XHJcbiAgICB9XHJcbiAgICBlbC5uYXRpdmVFbGVtZW50LnNldFNlbGVjdGlvblJhbmdlKGN1cnNvclBvc2l0aW9uLCBjdXJzb3JQb3NpdGlvbik7XHJcbiAgfVxyXG5cclxufVxyXG4iXX0=