import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PieRutaIngresoPage } from './pie-ruta-ingreso.page';

const routes: Routes = [
  {
    path: '',
    component: PieRutaIngresoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PieRutaIngresoPageRoutingModule {}
