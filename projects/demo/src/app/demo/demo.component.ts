import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, NgForm, NgModel } from '@angular/forms';
import { NgxCurrencyMaskConfig, NgxCurrencyMaskDirective } from 'ngx-currency-mask';
import { MarkdownService } from 'ngx-markdown';

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.scss']
})
export class DemoComponent implements OnInit, AfterViewInit {
  @ViewChild('demo1Form') demo1Form!: NgForm;

  @ViewChild('demo1Input') demo1Input!: NgModel;
  static config: NgxCurrencyMaskConfig = new NgxCurrencyMaskConfig();

  updControl: boolean = true;

  demo1: number | string = 1000;
  demo1Locale: string = 'en-US';
  demo1Scale: string = '1.2-2';
  demo1Prefix: string = '';
  demo1Postfix: string = '';
  demo1Max: number | string = 10000;
  demo1Min: number | string = 10;
  demo1Update: boolean = true;

  demo21 = 1000;
  demo22 = 2000;

  demo1Code: string = this.generateDemo1Code();
    
  constructor(
    private markdownService: MarkdownService,
  ) { }

  ngAfterViewInit(): void {
    this.demo1Form.valueChanges?.subscribe((res) => {
      this.demo1Locale = res.demo1Locale;
      this.demo1Scale = res.demo1Scale;
      this.demo1Max = res.demo1Max;
      this.demo1Min = res.demo1Min;
      this.demo1Prefix = res.demo1Prefix;
      this.demo1Postfix = res.demo1Postfix;
      this.demo1Code = this.generateDemo1Code();
      this.markdownService.reload();
      this.demo1Update = !this.demo1Update;
    });
  }

  ngOnInit(): void {
  }

  generateDemo1Code(): string {
    let str = '';
    str += `<input currencyMask `
    if(this.demo1Locale) str += `locale="${this.demo1Locale}" `
    if(this.demo1Scale) str += `scale="${this.demo1Scale}" `
    if(this.demo1Max) str += `max="${this.demo1Max}" `
    if(this.demo1Min) str += `min="${this.demo1Min}" `
    if(this.demo1Prefix) str += `prefix="${this.demo1Prefix}" `
    if(this.demo1Postfix) str += `postfix="${this.demo1Postfix}" `
    str += `[(ngModel)]="demo1">`;
    return str;
  }
}
