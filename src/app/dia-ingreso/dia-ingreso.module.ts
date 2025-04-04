import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DiaIngresoPageRoutingModule } from './dia-ingreso-routing.module';

import { DiaIngresoPage } from './dia-ingreso.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DiaIngresoPageRoutingModule
  ],
  declarations: [DiaIngresoPage]
})
export class DiaIngresoPageModule {}
