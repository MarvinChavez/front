import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard'; // Asegurar la importación

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'folder',
    loadChildren: () => import('./folder/folder.module').then(m => m.FolderPageModule),
    canActivate: [AuthGuard] // Proteger la ruta
  },
  {
    path: 'upload',
    loadChildren: () => import('./upload/upload.module').then( m => m.UploadPageModule),
    canActivate: [AuthGuard] // Proteger la ruta
  },
  {
    path: 'totalingreso',
    loadChildren: () => import('./totalingreso/totalingreso.module').then( m => m.TotalingresoPageModule),
    canActivate: [AuthGuard] // Proteger la ruta
  },
  {
    path: 'dia-ingreso',
    loadChildren: () => import('./dia-ingreso/dia-ingreso.module').then( m => m.DiaIngresoPageModule),
    canActivate: [AuthGuard] // Proteger la ruta
  },
  {
    path: 'oficina-ingreso',
    loadChildren: () => import('./oficina-ingreso/oficina-ingreso.module').then( m => m.OficinaIngresoPageModule),
    canActivate: [AuthGuard] // Proteger la ruta
  },
  {
    path: 'ruta-ingreso',
    loadChildren: () => import('./ruta-ingreso/ruta-ingreso.module').then( m => m.RutaIngresoPageModule),
    canActivate: [AuthGuard] // Proteger la ruta
  },
  {
    path: 'auto-ingreso',
    loadChildren: () => import('./auto-ingreso/auto-ingreso.module').then( m => m.AutoIngresoPageModule),
    canActivate: [AuthGuard] // Proteger la ruta
  },
  {
    path: 'turno-ingreso',
    loadChildren: () => import('./turno-ingreso/turno-ingreso.module').then( m => m.TurnoIngresoPageModule),
    canActivate: [AuthGuard] // Proteger la ruta
  },
  {
    path: 'pie-ruta-ingreso',
    loadChildren: () => import('./pie-ruta-ingreso/pie-ruta-ingreso.module').then( m => m.PieRutaIngresoPageModule),
    canActivate: [AuthGuard] // Proteger la ruta
  },
  {
    path: 'pie-placa-ingreso',
    loadChildren: () => import('./pie-placa-ingreso/pie-placa-ingreso.module').then( m => m.PiePlacaIngresoPageModule),
    canActivate: [AuthGuard] // Proteger la ruta
  },
  {
    path: 'pie-ruta-placa-ingreso',
    loadChildren: () => import('./pie-ruta-placa-ingreso/pie-ruta-placa-ingreso.module').then( m => m.PieRutaPlacaIngresoPageModule),
    canActivate: [AuthGuard] // Proteger la ruta
  },
  {
    path: 'user-create',
    loadChildren: () => import('./user-create/user-create.module').then( m => m.UserCreatePageModule),
    canActivate: [AuthGuard] // Proteger la ruta
  },
  {
    path: 'user-list',
    loadChildren: () => import('./user-list/user-list.module').then( m => m.UserListPageModule),
    canActivate: [AuthGuard] // Proteger la ruta
  },
  {
    path: 'edit-user/:username',
    loadChildren: () => import('./edit-user/edit-user.module').then(m => m.EditUserPageModule),
    canActivate: [AuthGuard] // Proteger la ruta
  },
  {
    path: 'comparacion-ingresos',
    loadChildren: () => import('./comparacion-ingresos/comparacion-ingresos.module').then( m => m.ComparacionIngresosPageModule),
    canActivate: [AuthGuard] // Proteger la ruta
  }
];


@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
