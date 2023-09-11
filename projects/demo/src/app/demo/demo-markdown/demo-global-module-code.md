```javascript
  @NgModule({
    declarations: [...],
    imports: [...],
    providers: [
+     { provide: NGX_CURRENCY_MASK_CONFIG, useValue: { locale: 'de-DE', scale: '1.2-2' } }
    ]
  })
```
