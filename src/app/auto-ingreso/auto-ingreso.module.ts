import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AutoIngresoPageRoutingModule } from './auto-ingreso-routing.module';

import { AutoIngresoPage } from './auto-ingreso.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AutoIngresoPageRoutingModule
  ],
  declarations: [AutoIngresoPage]
})
export class AutoIngresoPageModule {}
