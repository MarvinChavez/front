import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ComparacionIngresosPageRoutingModule } from './comparacion-ingresos-routing.module';
import { GoogleChartsModule } from 'angular-google-charts'; // ✅ Importar el módulo

import { ComparacionIngresosPage } from './comparacion-ingresos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComparacionIngresosPageRoutingModule,
    GoogleChartsModule 
  ],
  declarations: [ComparacionIngresosPage]
})
export class ComparacionIngresosPageModule {}
