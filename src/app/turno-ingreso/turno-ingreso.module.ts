import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TurnoIngresoPageRoutingModule } from './turno-ingreso-routing.module';

import { TurnoIngresoPage } from './turno-ingreso.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TurnoIngresoPageRoutingModule
  ],
  declarations: [TurnoIngresoPage]
})
export class TurnoIngresoPageModule {}
