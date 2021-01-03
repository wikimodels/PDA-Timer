import {
  AngularFireAuthGuard,
  redirectUnauthorizedTo,
} from '@angular/fire/auth-guard';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {
  BASE,
  HOME,
  LOGIN,
  SESSIONS,
  ABOUT,
  ADMIN_PANEL,
} from '../app/consts/routes.consts';

import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { SessionsComponent } from './sessions/sessions.component';
import { AboutComponent } from './about/about.component';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo([LOGIN]);

const routes: Routes = [
  {
    path: BASE,
    redirectTo: `/${LOGIN}`,
    pathMatch: 'full',
    //canActivate: [AngularFireAuthGuard],
    //data: { authGuardPipe: redirectUnauthorizedToLogin },
  },
  {
    path: SESSIONS,
    component: SessionsComponent,
    //canActivate: [AngularFireAuthGuard],
    //data: { authGuardPipe: redirectUnauthorizedToLogin },
  },
  {
    path: HOME,
    component: HomeComponent,
    //canActivate: [AngularFireAuthGuard],
    //data: { authGuardPipe: redirectUnauthorizedToLogin },
  },
  {
    path: ABOUT,
    component: AboutComponent,
  },
  {
    path: LOGIN,
    component: LoginComponent,
  },
  {
    path: ADMIN_PANEL,
    component: AdminPanelComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
