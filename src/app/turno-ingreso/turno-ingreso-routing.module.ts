import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TurnoIngresoPage } from './turno-ingreso.page';

const routes: Routes = [
  {
    path: '',
    component: TurnoIngresoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TurnoIngresoPageRoutingModule {}
