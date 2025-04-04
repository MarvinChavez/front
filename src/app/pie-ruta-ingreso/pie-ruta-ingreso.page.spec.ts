import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PieRutaIngresoPage } from './pie-ruta-ingreso.page';

describe('PieRutaIngresoPage', () => {
  let component: PieRutaIngresoPage;
  let fixture: ComponentFixture<PieRutaIngresoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PieRutaIngresoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
