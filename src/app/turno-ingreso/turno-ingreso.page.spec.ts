import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TurnoIngresoPage } from './turno-ingreso.page';

describe('TurnoIngresoPage', () => {
  let component: TurnoIngresoPage;
  let fixture: ComponentFixture<TurnoIngresoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TurnoIngresoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
