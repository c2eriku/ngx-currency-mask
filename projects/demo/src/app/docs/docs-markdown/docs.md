<!-- # ngx-currency-mask -->

## Installation

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

## Config Properties

This table lists the properties for `NGX_CURRENCY_MASK_CONFIG`, which can be used to configure global settings.:
| Property | Default | Description |
| --- | --- | --- |
| locale: string | 'en-US' |The locale for `currencyMask` configuration. |
| scale: string | '1.2-2' | The scale of decimal representation. |
| textAlign: string | 'right' | The option to control `<input>` text's alignment. |

## Attributes

This section lists the attributes available for the `currencyMask` directive. </br>
`currencyMask` can also be adapted to work with native `<input type="text">` validator, which can refer to [MDN&lt;input&gt;Docs](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/input#%E5%B1%9E%E6%80%A7).

| Attributes | Description |
| --- | --- |
| @Input() **scale**: string | Set decimal representation, parameter written in the following format: </br>`"1.minFractionDigits-maxFractionDigits"` </br> Example: `<input currencyMask scale="1.2-2">`, would format to `9,999.99` |
| @Input() **max**: string | The maximum (numeric) value for this item, if exceed the maximum value, `<input>` would be invalid. |
| @Input() **min**: string | The minimum (numeric) value for this item, if less than minimum value, `<input>` would be invalid. |
