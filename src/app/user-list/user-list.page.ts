import { Component, OnInit } from '@angular/core';
import { AuthService, User } from '../services/auth.service';
import { Router } from '@angular/router';
import { ScreenOrientation, OrientationLockType } from '@capacitor/screen-orientation';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.page.html',
  standalone: false,
  styleUrls: ['./user-list.page.scss'],
})
export class UserListPage implements OnInit {

  users: User[] = [];
  empresa_id:number=0;

  constructor(private userService: AuthService,private router: Router) {}

  ngOnInit() {
    const storedId = localStorage.getItem('empresa_id');
    if (storedId) {
      this.empresa_id = parseInt(storedId, 10);
    }
    this.lockOrientation();
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getUsers(this.empresa_id).subscribe(
      (data) => {
        this.users = data;
      },
      (error) => {
        console.error('Error al obtener usuarios', error);
      }
    );
  }
  editUser(username: string) {
    this.router.navigate(['/edit-user', username]); 
  }
  deleteUser(username: string) {
    if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      this.userService.deleteUser(username).subscribe({
        next: (response) => {
          console.log('Usuario eliminado:', response);
          window.location.reload();
        },
        error: (error) => {
          console.error('Error al eliminar el usuario:', error);
        }
      });
    }
  }
  
  
  goCreate() {
    this.router.navigate(['/user-create']); 
  }
  async lockOrientation() {
  try {
    await ScreenOrientation.lock({ orientation: 'portrait' });
    console.log('Orientación bloqueada en vertical');
  } catch (error) {
    console.error('Error bloqueando orientación:', error);
  }
}

}
