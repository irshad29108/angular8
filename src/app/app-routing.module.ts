import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { AuthGuard } from './shared/guard/auth.guards';
import { LoginGuard } from './guard/login.guard';
import { LayoutguardGuard } from './guard/layoutguard.guard';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';
import { NotFoundComponent } from './not-found/not-found.component';
/*const routes: Routes = [
  { path: '',canActivate:[LoginGuard],
  pathMatch: 'full', loadChildren: () => import('./layout/layout.module').then(m => m.LayoutModule)},
  { path: 'login',canActivate:[LayoutguardGuard], loadChildren: () => import('./login/login.module').then(m => m.LoginModule)},
 // {path:'**' ,component:PagenotfoundComponent}
];*/

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard',canActivate:[LoginGuard],loadChildren: () => import('./layout/layout.module').then(m => m.LayoutModule)},
  { path: 'login',canActivate:[LayoutguardGuard], loadChildren: () => import('./login/login.module').then(m => m.LoginModule)},
  {path: '404', component: NotFoundComponent},
  {path: '**', redirectTo: '/404'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{ preloadingStrategy: PreloadAllModules,useHash: true })],//,{ useHash: true }
  exports: [RouterModule]
})
export class AppRoutingModule { 
}

