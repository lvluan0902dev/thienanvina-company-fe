import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

const routes: Routes = [
  {
    path: '', loadChildren: () => import('./components/components.module').then(m => m.ComponentsModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'register', component: RegisterComponent
  },
  {
    path: 'login', component: LoginComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
