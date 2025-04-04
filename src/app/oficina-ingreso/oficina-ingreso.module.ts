import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OficinaIngresoPageRoutingModule } from './oficina-ingreso-routing.module';

import { OficinaIngresoPage } from './oficina-ingreso.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OficinaIngresoPageRoutingModule
  ],
  declarations: [OficinaIngresoPage]
})
export class OficinaIngresoPageModule {}
