import {Routes} from '@angular/router';
import {BaseLayoutComponent} from './shared/base-layout/base-layout.component';
import {HomeComponent} from './pages/home/home.component';
import {SignInComponent} from './pages/sign-in/sign-in.component';
import {AboutComponent} from './pages/about/about.component';
import {E404Component} from './shared/e404/e404.component';
import {AuthGuard} from './shared/guards/auth-guard';

export const AppRoutes: Routes = [
  {
    path: '',
    component: BaseLayoutComponent,
    children: [
      {
        path: '',
        component: HomeComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'sign-in',
        component: SignInComponent
      },
      {
        path: 'about',
        component: AboutComponent
      },
      {
        path: '**',
        pathMatch: 'full',
        component: E404Component
      }
    ]
  }
];
