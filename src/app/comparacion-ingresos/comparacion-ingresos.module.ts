import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ComparacionIngresosPageRoutingModule } from './comparacion-ingresos-routing.module';

import { ComparacionIngresosPage } from './comparacion-ingresos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComparacionIngresosPageRoutingModule
  ],
  declarations: [ComparacionIngresosPage]
})
export class ComparacionIngresosPageModule {}
