import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OficinaIngresoPage } from './oficina-ingreso.page';

describe('OficinaIngresoPage', () => {
  let component: OficinaIngresoPage;
  let fixture: ComponentFixture<OficinaIngresoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(OficinaIngresoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
