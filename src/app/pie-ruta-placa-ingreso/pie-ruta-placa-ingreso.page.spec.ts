import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PieRutaPlacaIngresoPage } from './pie-ruta-placa-ingreso.page';

describe('PieRutaPlacaIngresoPage', () => {
  let component: PieRutaPlacaIngresoPage;
  let fixture: ComponentFixture<PieRutaPlacaIngresoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PieRutaPlacaIngresoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
