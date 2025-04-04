import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RutaIngresoPage } from './ruta-ingreso.page';

describe('RutaIngresoPage', () => {
  let component: RutaIngresoPage;
  let fixture: ComponentFixture<RutaIngresoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RutaIngresoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
