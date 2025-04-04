import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DiaIngresoPage } from './dia-ingreso.page';

const routes: Routes = [
  {
    path: '',
    component: DiaIngresoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DiaIngresoPageRoutingModule {}
