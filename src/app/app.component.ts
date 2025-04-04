import { Component, ViewChild } from '@angular/core';
import { AuthService } from './services/auth.service';
import { IonMenu, MenuController } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  @ViewChild('menu', { static: false }) menu!: IonMenu;

  constructor(private menuCtrl: MenuController, private authService: AuthService){}
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
