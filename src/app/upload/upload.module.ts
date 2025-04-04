import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular'; // Importa IonicModule
import { UploadPage } from './upload.page';
import { UploadPageRoutingModule } from './upload-routing.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UploadPageRoutingModule, // Asegúrate de incluir esto
  ],
  declarations: [UploadPage]
})
export class UploadPageModule {}
