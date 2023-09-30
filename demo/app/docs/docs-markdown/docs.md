# @cceri/ngx-currency-mask

## Installation

Get started and to install this `ngx-currency-mask` library to project, running the following command.

```bash
npm install @cceri/ngx-currency-mask
```

-----

## Configuration

There are two way to configure `ngx-currency-mask`, global configuration and single `<input>` configuration,

### 1. Global Configuration

Import `NgxCurrencyMaskModule` inside `AppModule` or any of the project's root modules and provide values to configure the entire project.

```diff
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
+     }}
    ]
  })
```

#### Properties

This table lists the properties for `NGX_CURRENCY_MASK_CONFIG`, which can be used to configure global settings.  
The properties inside the table are all **optional**, which means that only need to pick what you require.
| Property | Default | Description |
| --- | :---: | --- |
| **locale** | `en-US` | The locale for `currencyMask` configuration. |
| **scale** | `1.2-2` | The scale of decimal representation, parameter written in the following format:  `"1.minFractionDigits-maxFractionDigits"` </br> Example: `<input currencyMask scale="1.2-2">`, would format to `9,999.99` |
| **align** | `left` | The option to control `<input>` text's alignment. |
| **prefix** | `''` | prefix of the representation. |
| **postfix** | `''` | postfix of the representation. |

### 2. Single `<input>` Configuration

Import `NgxCurrencyMaskModule` inside **target Module**, and configure in components which is in this module.

```diff
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
| **locale** | The locale for `currencyMask` configuration. |
| **scale** |  The scale of decimal representation, parameter written in the following format: </br>`"1.minFractionDigits-maxFractionDigits"` </br> Example: `<input currencyMask scale="1.2-2">`, would format to `9,999.99` |
| **max** | The maximum (numeric) value for this item, if exceed the maximum value, `<input>` would be invalid. |
| **min** | The minimum (numeric) value for this item, if  the deceed the minimum value, `<input>` would be invalid. |
| **prefix** | prefix of the representation. |
| **postfix** | postfix of the representation. |

-----

## License

This library is licensed under **MIT**.

-----

## Remarks

If there are anything could be improved, please feel free to contact me via [email](mailto:c2eriku@gmail.com), giving comments, or submit pull request.  
I appreciate your review and really welcome your feedback and suggestions.
