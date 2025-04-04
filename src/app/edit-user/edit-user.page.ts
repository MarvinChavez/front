import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService, User } from '../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.page.html',
  standalone: false,
  styleUrls: ['./edit-user.page.scss'],
})
export class EditUserPage implements OnInit {

  userForm: FormGroup;
  username: string = '';
  permisos_vistas: string[] = [];  // Se asegura de que sea un array

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.userForm = this.fb.group({
      username: ['', [Validators.required]],
      password: [''] ,
      permisos_vistas: [] 
    });
  }

  ngOnInit() {
    this.username = this.route.snapshot.paramMap.get('username')!;
    this.loadUser();
  }

  loadUser() {
    this.authService.getUser(this.username).subscribe(
      (user) => {
        this.userForm.patchValue({
          username: user.username, 
          permiso_vistas: user.permisos_vistas
        });
      },
      (error) => {
        console.error('Error al cargar usuario', error);
      }
    );
  }

  updateUser() {
    if (this.userForm.valid) {
      const updatedUser = this.userForm.value;
      this.authService.updateUser(this.username, updatedUser).subscribe(
        () => {
          window.location.reload();
          this.router.navigate(['/user-list']); 
        },
        (error) => {
          console.error('Error al actualizar usuario', error);
        }
      );
    }
  }

}
