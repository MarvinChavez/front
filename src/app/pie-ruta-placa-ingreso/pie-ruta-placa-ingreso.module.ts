import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PieRutaPlacaIngresoPageRoutingModule } from './pie-ruta-placa-ingreso-routing.module';
import { GoogleChartsModule } from 'angular-google-charts'; // ✅ Importar el módulo

import { PieRutaPlacaIngresoPage } from './pie-ruta-placa-ingreso.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PieRutaPlacaIngresoPageRoutingModule,
    GoogleChartsModule   ],
  declarations: [PieRutaPlacaIngresoPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PieRutaPlacaIngresoPageModule {}
