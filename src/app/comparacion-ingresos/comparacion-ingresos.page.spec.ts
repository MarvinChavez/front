import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComparacionIngresosPage } from './comparacion-ingresos.page';

describe('ComparacionIngresosPage', () => {
  let component: ComparacionIngresosPage;
  let fixture: ComponentFixture<ComparacionIngresosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ComparacionIngresosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
