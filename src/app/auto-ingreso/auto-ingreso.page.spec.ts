import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AutoIngresoPage } from './auto-ingreso.page';

describe('AutoIngresoPage', () => {
  let component: AutoIngresoPage;
  let fixture: ComponentFixture<AutoIngresoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoIngresoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
