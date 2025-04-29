import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  private apiUrl = 'http://127.0.0.1:8000/ingreso/upload-excel'; // URL de FastAPI

  constructor(private http: HttpClient) {}

  uploadFile(file: File, empresa_id: number): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('empresa_id', empresa_id.toString());
  
    return this.http.post(`${this.apiUrl}`, formData);
  }
  
}
