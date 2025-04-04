import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PiePlacaIngresoPageRoutingModule } from './pie-placa-ingreso-routing.module';

import { PiePlacaIngresoPage } from './pie-placa-ingreso.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PiePlacaIngresoPageRoutingModule
  ],
  declarations: [PiePlacaIngresoPage]
})
export class PiePlacaIngresoPageModule {}
