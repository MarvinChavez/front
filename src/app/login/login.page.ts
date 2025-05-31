import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router'; // Agrega esto
import { MenuController } from '@ionic/angular';
import { ScreenOrientation, OrientationLockType } from '@capacitor/screen-orientation';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  imports: [CommonModule, IonicModule, FormsModule, RouterModule] // Importa RouterModule aquí
})
export class LoginPage implements OnInit{
  username = '';
  password: string = '';
  passwordType: string = 'password';
  errorMessage: string = "";
  empresa_id: number = 0;
  ngOnInit() {
    const storedId = localStorage.getItem('empresa_id');
    if (storedId) {
      this.empresa_id = parseInt(storedId, 10);
    }
    this.lockOrientation();
  }
  constructor(private authService: AuthService, private router: Router,private menuCtrl: MenuController) {
    document.body.classList.add('login-page');
  }

  onLogin() {
    this.authService.login(this.username, this.password,this.empresa_id).subscribe(
      () => {
        this.router.navigate(['/dia-ingreso']);
      },
      (error) => {
        console.error('Error de autenticación:', error);
        this.errorMessage = "Correo o contraseña incorrectos. Intenta nuevamente.";
      }
    );
  }
  ngOnDestroy() {
    document.body.classList.remove('login-page'); // Quitar clase al salir
  }
  togglePasswordVisibility() {
    this.passwordType = this.passwordType === 'password' ? 'text' : 'password';
  }
  ionViewWillEnter() {
    this.menuCtrl.enable(false); // Desactiva el menú en la página de login
  }

  ionViewWillLeave() {
    this.menuCtrl.enable(true); // Reactiva el menú al salir de login
  }
  logout() {
    localStorage.removeItem('access_token'); 
    localStorage.removeItem('permisos'); 
    localStorage.removeItem('empresa_id'); 
    this.router.navigate(['/loginempresa']); 
  }
  clearErrorMessage() {
    this.errorMessage = "";
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token'); // Verificar si hay sesión activa
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
