import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LoginempresaPageRoutingModule } from './loginempresa-routing.module';

import { LoginempresaPage } from './loginempresa.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LoginempresaPageRoutingModule,
    LoginempresaPage
  ]
})
export class LoginempresaPageModule {}
