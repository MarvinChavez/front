import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DiaIngresoPage } from './dia-ingreso.page';

describe('DiaIngresoPage', () => {
  let component: DiaIngresoPage;
  let fixture: ComponentFixture<DiaIngresoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DiaIngresoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
