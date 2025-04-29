import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardEmpresa implements CanActivate {
  constructor(private router: Router) {}
  comienzo = true;
ultimaRutaValida = '';

canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
  const empresaId = localStorage.getItem('empresa_id');
    if (empresaId) {
      return true;
    } else {
      this.router.navigate(['/loginempresa']);
      return false;
    }
}

  
  
}
 