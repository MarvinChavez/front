import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RutaIngresoPage } from './ruta-ingreso.page';

const routes: Routes = [
  {
    path: '',
    component: RutaIngresoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RutaIngresoPageRoutingModule {}
