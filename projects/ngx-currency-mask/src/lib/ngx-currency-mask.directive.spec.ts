import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgxCurrencyMaskDirective } from './ngx-currency-mask.directive';
import { Component, DebugElement } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  template: '<input currencyMask [(ngModel)]="currencyValue">',
})
class TestComponent {
  currencyValue: number | undefined;
}

describe('NgxCurrencyMaskDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let component: TestComponent;
  let inputElement: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [NgxCurrencyMaskDirective, TestComponent],
    });

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    inputElement = fixture.debugElement.query((de) => de.nativeElement.tagName === 'INPUT');

    fixture.detectChanges();
  });

  it('should create an instance', () => {
    const directive = inputElement.injector.get(NgxCurrencyMaskDirective);
    expect(directive).toBeTruthy();
  });

  it('should format input value to currency format', () => {
    const inputValue = '1000000';
    inputElement.nativeElement.value = inputValue;
    inputElement.nativeElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(inputElement.nativeElement.value).toBe('1,000,000');
  });
});
