import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RutaIngresoPageRoutingModule } from './ruta-ingreso-routing.module';

import { RutaIngresoPage } from './ruta-ingreso.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RutaIngresoPageRoutingModule
  ],
  declarations: [RutaIngresoPage]
})
export class RutaIngresoPageModule {}
