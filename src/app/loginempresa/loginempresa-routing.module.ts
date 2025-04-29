import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginempresaPage } from './loginempresa.page';

const routes: Routes = [
  {
    path: '',
    component: LoginempresaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoginempresaPageRoutingModule {}
