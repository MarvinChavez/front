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
}
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8000/auth';

  constructor(private http: HttpClient,private router: Router) {}

  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { username, password }).pipe(
      tap((response: any) => {
        localStorage.setItem('access_token', response.access_token);
        localStorage.setItem('permisos', JSON.stringify(response.permisos)); // Guardar permisos
      })
    );
  }
  createUser(username:string, permisos_vistas: string[],password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, { username, permisos_vistas,password });
  }
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`);
  }
  logout(): void {
    localStorage.removeItem('access_token'); 
    localStorage.removeItem('permisos'); 
    this.router.navigate(['/login']); 
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
