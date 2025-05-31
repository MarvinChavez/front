import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router'; // Agrega esto
import { MenuController } from '@ionic/angular';
import { ScreenOrientation, OrientationLockType } from '@capacitor/screen-orientation';
@Component({
  selector: 'app-loginempresa',
  templateUrl: './loginempresa.page.html',
  
  styleUrls: ['./loginempresa.page.scss'],
  imports: [CommonModule, IonicModule, FormsModule, RouterModule] // Importa RouterModule aquí

})
export class LoginempresaPage{

    ruc = '';
    password: string = '';
    passwordType: string = 'password';
    errorMessage: string = "";
  ngOnInit() {
    this.lockOrientation();
  }
    constructor(private authService: AuthService, private router: Router,private menuCtrl: MenuController) {
      document.body.classList.add('logine-page');
    }
  
    onLogin() {
      this.authService.logine(this.ruc, this.password).subscribe(
        () => {
          this.router.navigate(['/login']);
        },
        (error) => {
          console.error('Error de autenticación:', error);
          this.errorMessage = "Correo o contraseña incorrectos. Intenta nuevamente.";
        }
      );
    }
    ngOnDestroy() {
      document.body.classList.remove('logine-page'); // Quitar clase al salir
    }
    togglePasswordVisibility() {
      this.passwordType = this.passwordType === 'password' ? 'text' : 'password';
    }
    clearErrorMessage() {
      this.errorMessage = "";
    }
    ionViewWillEnter() {
      this.menuCtrl.enable(false); // Desactiva el menú en la página de login
    }
  
    ionViewWillLeave() {
      this.menuCtrl.enable(true); // Reactiva el menú al salir de login
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
