import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgxCurrencyMaskConfig, NgxCurrencyMaskDirective, NgxCurrencyMaskService } from 'ngx-currency-mask';
import { MarkdownService } from 'ngx-markdown';

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.scss']
})
export class HomeComponent implements OnInit {
  @ViewChild('demoInput') demo1Input!: ElementRef;
  static config: NgxCurrencyMaskConfig = new NgxCurrencyMaskConfig();

  updControl:boolean = true;

  demo1: number | string = 1000;
  demo1Locale: string = 'en-US';
  demo1Scale: string = '1.2-2';

  demo21 = 1000;
  demo22 = 2000;

  demo1Code: string = 
  `<input currencyMask locale="${this.demo1Locale}" scale="${this.demo1Scale}" [(ngModel)]="demo1">`;

  constructor(
    public currencyMaskService: NgxCurrencyMaskService,
    private markdownService: MarkdownService,
  ) { }


  ngOnInit(): void {}

  updateDemo1(event: any) {
    this.demo1 = '';
    this.demo1Code = `<input currencyMask locale="${this.demo1Locale}" scale="${this.demo1Scale}" [(ngModel)]="demo1">`;
    this.updControl = !this.updControl;
  }
}
