import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TotalingresoPage } from './totalingreso.page';

describe('TotalingresoPage', () => {
  let component: TotalingresoPage;
  let fixture: ComponentFixture<TotalingresoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TotalingresoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
