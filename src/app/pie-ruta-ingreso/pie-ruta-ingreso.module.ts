import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PieRutaIngresoPageRoutingModule } from './pie-ruta-ingreso-routing.module';

import { PieRutaIngresoPage } from './pie-ruta-ingreso.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PieRutaIngresoPageRoutingModule
  ],
  declarations: [PieRutaIngresoPage]
})
export class PieRutaIngresoPageModule {}
