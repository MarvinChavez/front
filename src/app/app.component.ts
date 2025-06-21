import { Component, ViewChild } from '@angular/core';
import { AuthService } from './services/auth.service';
import { IonMenu, MenuController } from '@ionic/angular';
import { Platform, AlertController } from '@ionic/angular';
import { App } from '@capacitor/app';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  @ViewChild('menu', { static: false }) menu!: IonMenu;
backPressCount = 0;
  backPressTimer: any;
  ngOnInit() {
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.handleBackButton();
    });
  }

  handleBackButton() {
    this.backPressCount++;
    if (this.backPressCount >= 3) {
      this.confirmarSalirApp();
      clearTimeout(this.backPressTimer); 
      this.backPressCount = 0;
      return;
    }
    clearTimeout(this.backPressTimer);
    this.backPressTimer = setTimeout(() => {
      this.backPressCount = 0;
    }, 2000);
  }

  async confirmarSalirApp() {
    const alert = await this.alertCtrl.create({
      header: 'Salir',
      message: '¿Seguro que deseas cerrar la aplicación?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Salir',
          handler: () => {
            App.exitApp();
          }
        }
      ]
    });

    await alert.present();
  }
  constructor(private menuCtrl: MenuController, private authService: AuthService,private platform: Platform,
    private alertCtrl: AlertController){}
  logout() {
    this.authService.logout();
  }
  upload() {
    this.authService.upload();
  }
  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }
   toggleMenu() {
    this.menu.isOpen().then(isOpen => {
      if (isOpen) {
        this.menu.close();
      } else {
        this.menu.open();
      }
    });
  }
}
