import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

export interface User {
  id:number;
  username: string;
  permisos_vistas:string[]
  password?: string; // Opcional
  empresa_id:number
}
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8000/auth';

  constructor(private http: HttpClient,private router: Router) {}

  login(username: string, password: string,empresa_id:number): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { username, password,empresa_id }).pipe(
      tap((response: any) => {
        localStorage.setItem('access_token', response.access_token);
        localStorage.setItem('permisos', JSON.stringify(response.permisos)); // Guardar permisos
      })
    );
  }
  logine(ruc: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/logine`, { ruc, password }).pipe(
      tap((response: any) => {
        localStorage.setItem('empresa_id', response.empresa_id);
      })
    );
  }
  createUser(username:string, permisos_vistas: string[],password: string,empresa_id:number): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, { username, permisos_vistas,password,empresa_id });
  }
  getUsers(empresa_id: number): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/usersempresa`, {
      params: { empresa_id: empresa_id.toString() }
    });
  }
  
  logout(): void {
    localStorage.removeItem('access_token'); 
    localStorage.removeItem('permisos'); 
    localStorage.removeItem('empresa_id'); 
    this.router.navigate(['/loginempresa']); 
  }
  upload(): void {
    this.router.navigate(['/upload']); 
  }
  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token'); 
  }
  getUser(username: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/users/${username}`);
  }

  updateUser(username: string, user: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/users/${username}`, user);
  }
  deleteUser(username: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${username}/delete`);
  }
  
}
