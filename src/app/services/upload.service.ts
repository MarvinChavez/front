import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  private apiUrl = 'http://127.0.0.1:8000/ingreso/upload-excel'; // URL de FastAPI

  constructor(private http: HttpClient) {}

  uploadFile(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    const headers = new HttpHeaders(); // No es necesario definir `Content-Type`, Angular lo hace automáticamente

    return this.http.post(this.apiUrl, formData, { headers });
  }
}
