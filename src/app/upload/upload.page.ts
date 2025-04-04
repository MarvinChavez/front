import { Component } from '@angular/core';
import { UploadService } from '../services/upload.service'; // ✅ Importar el servicio

@Component({
  selector: 'app-upload',
  standalone:false,
  templateUrl: './upload.page.html',
  styleUrls: ['./upload.page.scss'],
})
export class UploadPage {
  file: File | null = null;
  isUploading = false; // Para mostrar el estado de carga

  constructor(private uploadService: UploadService) {} // ✅ Inyectar el servicio

  onFileSelected(event: any) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.file = fileInput.files[0];
      console.log('Archivo seleccionado:', this.file.name);
    }
  }

  uploadFile() {
    if (!this.file) {
      console.log('Por favor selecciona un archivo.');
      return;
    }

    this.isUploading = true; // Mostrar carga
    console.log('Subiendo archivo:', this.file.name);

    this.uploadService.uploadFile(this.file).subscribe({
      next: (response) => {
        console.log('Archivo subido con éxito:', response);
        alert('Archivo subido exitosamente.');
      },
      error: (error) => {
        console.error('Error al subir archivo:', error);
        alert('Error al subir archivo.');
      },
      complete: () => {
        this.isUploading = false;
        this.file = null; // Limpiar selección
      },
    });
  }
}
