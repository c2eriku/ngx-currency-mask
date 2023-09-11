# ngx-currency-mask

## Getting Strarted & Installation

To add this ngx-currency-mask library to your project, use the following commands.

```bash
npm install @ceri/ngx-currency-mask
```

## Configuration

there is two way to configure ngx-currency-mask, global configuration and inside DOM configuration,

### Global Configuration

you must import `NgxCurrencyMaskModule` inside your `AppModule` or any of your project root module.

```javascript
  @NgModule({
    declarations: [...],
    imports: [...],
    providers: [
+     { provide: NGX_CURRENCY_MASK_CONFIG, useValue: { locale: 'en-US', scale: '1.2-2' } }
    ]
  })
```

### Single `<input>` Configuration

you must import `NgxCurrencyMaskModule` inside your **target Module**, and configure in components which is in this module.

```javascript
  @NgModule({
    declarations: [...],
    imports: [
    ...
    NgxCurrencyMaskModule
    ...
    ],
    providers: [
      { provide: NGX_CURRENCY_MASK_CONFIG, useValue: { locale: 'en-US', scale: '1.2-2' } }
    ]
  })
```

## Attributes

This section lists the attributes available to `currencyMask` directive.

| Property | Description |
| --- | --- |
| @Input() scale: string | Set decimal representation, parameter written in the following format: <br> `"1.minFractionDigits-maxFractionDigits"` <br>Example: `<input currencyMask scale="1.2-2">`, would format to 9,999.99 |
| @Input() max: number \| string | The maximum (numeric) value for this item, if exceed the maximum value, `<input>` would be invalid. |
| @Input() min: number \| string | The minimum (numeric) value for this item, if less than minimum value, `<input>` would be invalid. |