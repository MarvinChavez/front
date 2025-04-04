import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PieRutaPlacaIngresoPage } from './pie-ruta-placa-ingreso.page';

const routes: Routes = [
  {
    path: '',
    component: PieRutaPlacaIngresoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes),
  ],

  exports: [RouterModule],
})
export class PieRutaPlacaIngresoPageRoutingModule {}
