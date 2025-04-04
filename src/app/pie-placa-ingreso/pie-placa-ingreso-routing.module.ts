import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PiePlacaIngresoPage } from './pie-placa-ingreso.page';

const routes: Routes = [
  {
    path: '',
    component: PiePlacaIngresoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PiePlacaIngresoPageRoutingModule {}
