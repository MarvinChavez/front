import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PiePlacaIngresoPage } from './pie-placa-ingreso.page';

describe('PiePlacaIngresoPage', () => {
  let component: PiePlacaIngresoPage;
  let fixture: ComponentFixture<PiePlacaIngresoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PiePlacaIngresoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
