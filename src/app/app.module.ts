import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { HeaderComponent } from './components/header/header.component';
import { RouterModule} from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthService } from './services/auth.service';
import { SessionInterceptor } from './services/SessionInterceptor';
import { RegistrationComponent } from './components/registration/registration.component';
import { MatDialogModule } from '@angular/material/dialog';
import { RegisterInfoComponent } from './components/register-info/register-info.component';
import { RegistrationService } from './services/registration.service';
import { UrlService } from './services/url.service';
import { ActivateComponent } from './components/activate/activate.component';
import { ContactComponent } from './components/contact/contact.component';
import { InfoComponent } from './components/info/info.component';
import { UserComponent } from './components/user/user.component';
import { AuthGuardService } from './services/auth-guard.service';
import { NoAuthGuardService } from './services/no-auth-guard.service';
import { GradeFormComponent } from './components/grade-form/grade-form.component';
import { ConfirmComponent } from './components/confirm/confirm.component';
import { GradeComponent } from './components/grade/grade.component';

export const ROUTES = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [NoAuthGuardService]
    
  },
  {
    path: 'registration',
    component: RegistrationComponent,
    canActivate: [NoAuthGuardService] 
    
  },
  {
    path: 'registration/:username/:registrationToken',
    component: ActivateComponent,
    canActivate: [NoAuthGuardService]
    
  },
  {
    path: 'contact',
    component: ContactComponent
  },
  {
    path: '',
    component: UserComponent,
    canActivate: [AuthGuardService]
  }
]

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LoginComponent,
    RegistrationComponent,
    RegisterInfoComponent,
    ActivateComponent,
    ContactComponent,
    InfoComponent,
    UserComponent,
    GradeFormComponent,
    ConfirmComponent,
    GradeComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    RouterModule.forRoot(ROUTES),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatDialogModule
  ],
  bootstrap: [AppComponent],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: SessionInterceptor, multi: true},
    AuthService,
    RegistrationService,
    UrlService,
    AuthGuardService,
    NoAuthGuardService
  ]
})
export class AppModule { }
