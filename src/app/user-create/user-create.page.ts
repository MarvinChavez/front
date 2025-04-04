import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';

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
  constructor(private authService: AuthService,private navCtrl: NavController,private router: Router) {}

  register() {
    console.log("Permisos seleccionados:", this.permisos_vistas);  // Agrega esta línea
    if (!this.username || !this.password || this.permisos_vistas.length === 0) {
      alert('Todos los campos son obligatorios');
      return;
    }
  
    this.authService.createUser(this.username, this.permisos_vistas, this.password).subscribe({
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
  ngOnInit() {
  }

}
