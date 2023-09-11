import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NGX_CURRENCY_MASK_CONFIG, NgxCurrencyMaskModule } from 'ngx-currency-mask';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HomeComponent } from './demo/demo.component';
import { MarkdownModule } from 'ngx-markdown';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { DocsComponent } from './docs/docs.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    DocsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxCurrencyMaskModule,
    NgbModule,
    HttpClientModule,
    MarkdownModule.forRoot({ loader: HttpClient }),
  ],
  providers: [
    {
      provide: NGX_CURRENCY_MASK_CONFIG, useValue: {
        locale: 'de-DE',
      }
    },
    // { provide: NGX_CURRENCY_MASK_CONFIG, useValue: { locale: 'de-DE' } }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
