# @cceri/ngx-currency-mask

-----

## Installation

Get started and to add this `ngx-currency-mask` library to project, use the following command line.

```bash
npm install @cceri/ngx-currency-mask
```

-----

## Configuration

There are two way to configure `ngx-currency-mask`, global configuration and inside DOM configuration,

### 1. Global Configuration

Import `NgxCurrencyMaskModule` inside `AppModule` or any of project root module.

```javascript
  @NgModule({
    declarations: [...],
    imports: [
      ...
+     NgxCurrencyMaskModule
    ],
    providers: [
+     { provide: NGX_CURRENCY_MASK_CONFIG, useValue: { 
+         locale: 'en-US', 
+         scale: '1.2-2', 
+         align: 'left',
+         prefix: '',
+         postfix: '',
+         } }
    ]
  })
```

#### Properties

This table lists the properties for `NGX_CURRENCY_MASK_CONFIG`, which can be used to configure global settings.  
The properties inside the table are all **optional**, which means that only need to configure what is require.
| Property | Default | Description |
| --- | --- | --- |
| **locale**: string | 'en-US' | The locale for `currencyMask` configuration. |
| **scale**: string | '1.2-2' | The scale of decimal representation. |
| **align**: string | 'left' | The option to control `<input>` text's alignment. |
| **prefix**: string | '' | prefix of the representation. |
| **postfix**: string | '' | postfix of the representation. |

### 2. Single `<input>` Configuration

Import `NgxCurrencyMaskModule` inside **target Module**, and configure in components which is in this module.

```javascript
  @NgModule({
    declarations: [...],
    imports: [
      ...
+     NgxCurrencyMaskModule
    ]
  })
```

#### Attributes

This section lists the attributes available for the `currencyMask` directive. </br>
`currencyMask` can also be adapted to work with native `<input type="text">` validator, which can refer to [MDN&lt;input&gt;Docs](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/input#%E5%B1%9E%E6%80%A7).

| Attributes | Description |
| --- | --- |
| @Input() **locale**: string | The locale for `currencyMask` configuration. |
| @Input() **scale**: string | Set decimal representation, parameter written in the following format: </br>`"1.minFractionDigits-maxFractionDigits"` </br> Example: `<input currencyMask scale="1.2-2">`, would format to `9,999.99` |
| @Input() **max**: string | The maximum (numeric) value for this item, if exceed the maximum value, `<input>` would be invalid. |
| @Input() **min**: string | The minimum (numeric) value for this item, if  the deceed the minimum value, `<input>` would be invalid. |
| @Input() **prefix**: string | prefix of the representation. |
| @Input() **postfix**: string | postfix of the representation. |

-----

## Remarks

If there are anything could be improved, please feel free to contact me via [email](mailto:c2eriku@gmail.com), giving comments, or pull request.  
I appreciate your review and really welcome your feedback and suggestions.
