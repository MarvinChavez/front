import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginempresaPage } from './loginempresa.page';

describe('LoginempresaPage', () => {
  let component: LoginempresaPage;
  let fixture: ComponentFixture<LoginempresaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginempresaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
