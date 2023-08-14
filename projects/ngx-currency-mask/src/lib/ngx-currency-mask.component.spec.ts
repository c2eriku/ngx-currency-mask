import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxCurrencyMaskComponent } from './ngx-currency-mask.component';

describe('NgxCurrencyMaskComponent', () => {
  let component: NgxCurrencyMaskComponent;
  let fixture: ComponentFixture<NgxCurrencyMaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NgxCurrencyMaskComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NgxCurrencyMaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
