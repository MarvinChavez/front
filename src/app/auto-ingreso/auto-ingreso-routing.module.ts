import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AutoIngresoPage } from './auto-ingreso.page';

const routes: Routes = [
  {
    path: '',
    component: AutoIngresoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AutoIngresoPageRoutingModule {}
