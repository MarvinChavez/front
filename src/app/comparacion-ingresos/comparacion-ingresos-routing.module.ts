import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ComparacionIngresosPage } from './comparacion-ingresos.page';

const routes: Routes = [
  {
    path: '',
    component: ComparacionIngresosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ComparacionIngresosPageRoutingModule {}
