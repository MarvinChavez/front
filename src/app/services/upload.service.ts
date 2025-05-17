import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  
  private apiUrl = environment.apiUrl+'ingreso/upload-excel';
  constructor(private http: HttpClient) {}

  uploadFile(file: File, empresa_id: number): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('empresa_id', empresa_id.toString());
  
    return this.http.post(`${this.apiUrl}`, formData);
  }
  
}
