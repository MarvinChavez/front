import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ScreenOrientation, OrientationLockType } from '@capacitor/screen-orientation';

@Component({
  selector: 'app-user-create',
  templateUrl: './user-create.page.html',
  standalone: false,
  styleUrls: ['./user-create.page.scss'],
})
export class UserCreatePage implements OnInit {

  username = '';
  password = '';
  permisos_vistas: string[] = [];  // Se asegura de que sea un array
  empresa_id:number=0;
  constructor(private authService: AuthService,private navCtrl: NavController,private router: Router) {}
  ngOnInit() {
    const storedId = localStorage.getItem('empresa_id');
    if (storedId) {
      this.empresa_id = parseInt(storedId, 10);
    }
    this.lockOrientation();

  }
  register() {
    if (!this.username || !this.password || this.permisos_vistas.length === 0) {
      alert('Todos los campos son obligatorios');
      return;
    }
    this.authService.createUser(this.username, this.permisos_vistas, this.password,this.empresa_id).subscribe({
      next: response => {
        console.log('Registro exitoso:', response);
        this.router.navigate(['/user-list']); 
      },
      error: error => {
        console.error('Error en el registro:', error);
      }
    });
  }
  
  cancel() {
    this.username = '';
    this.password = '';
    this.permisos_vistas = [];

    this.navCtrl.back(); // Regresa a la página anterior en Ionic
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
