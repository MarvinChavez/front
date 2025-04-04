import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TotalingresoPage } from './totalingreso.page';

const routes: Routes = [
  {
    path: '',
    component: TotalingresoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TotalingresoPageRoutingModule {}
