import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { HttpClientModule } from '@angular/common/http';
import { TotalingresoPageRoutingModule } from './totalingreso-routing.module';
import { TotalingresoPage } from './totalingreso.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HttpClientModule,
    TotalingresoPageRoutingModule
  ],
  declarations: [TotalingresoPage]
})
export class TotalingresoPageModule {}
