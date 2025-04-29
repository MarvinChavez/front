import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}
  comienzo = true;
ultimaRutaValida = '';

canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
  const permisos: string[] = JSON.parse(localStorage.getItem('permisos') || '[]');
  const rutaActual = route.routeConfig?.path || '';

  console.log('Permisos del usuario:', permisos);
  console.log('Ruta actual:', rutaActual);

  const rutaPermitida = permisos.includes(rutaActual);

  if (this.comienzo) {
    this.comienzo = false;
    if (permisos.length > 0) {
      const rutaInicial = permisos[0];
      this.ultimaRutaValida = rutaInicial;

      if (rutaActual !== rutaInicial) {
        this.router.navigate(['/' + rutaInicial]);
        return false;
      }

      return true; 
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }

  if (!rutaPermitida) {
    console.log('Ruta no permitida. Redirigiendo a última válida:', this.ultimaRutaValida);
    this.router.navigate(['/' + this.ultimaRutaValida]);
    return false;
  }
  this.ultimaRutaValida = rutaActual;
  return true;
}

  
  
}
 