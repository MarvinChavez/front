import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { authempresaGuard } from './authempresa.guard';

describe('authempresaGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => authempresaGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
