import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, NgForm, NgModel } from '@angular/forms';
import { NgxCurrencyMaskConfig, NgxCurrencyMaskDirective, NgxCurrencyMaskService } from 'ngx-currency-mask';
import { MarkdownService } from 'ngx-markdown';

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {
  @ViewChild('demo1Form') demo1Form!: NgForm;

  @ViewChild('demo1Input') demo1Input!: NgModel;
  static config: NgxCurrencyMaskConfig = new NgxCurrencyMaskConfig();

  updControl: boolean = true;

  demo1: number | string = 1000;
  demo1Locale: string = 'en-US';
  demo1Scale: string = '1.2-2';
  demo1Max: number | string = 10000;
  demo1Min: number | string = 10;
  demo1Update: boolean = true;

  demo21 = 1000;
  demo22 = 2000;

  demo1Code: string =
    `<input currencyMask locale="${this.demo1Locale}" scale="${this.demo1Scale}" max="${this.demo1Max}" min="${this.demo1Min}" [(ngModel)]="demo1">`;

  constructor(
    public currencyMaskService: NgxCurrencyMaskService,
    private markdownService: MarkdownService,
  ) { }

  ngAfterViewInit(): void {
    this.demo1Form.valueChanges?.subscribe((res) => {
      this.demo1Locale = res.demo1Locale;
      this.demo1Scale = res.demo1Scale;
      this.demo1Max = res.demo1Max;
      this.demo1Min = res.demo1Min;
      this.demo1Code = `<input currencyMask locale="${this.demo1Locale}" scale="${this.demo1Scale}" max="${this.demo1Max}" min="${this.demo1Min}" [(ngModel)]="demo1">`;
      this.markdownService.reload();
      this.demo1Update = !this.demo1Update;
    });
  }

  ngOnInit(): void {
  }

  show() {
    console.log(this.demo1Input)
  }
}
