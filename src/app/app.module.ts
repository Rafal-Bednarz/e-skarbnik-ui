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

export const ROUTES = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'registration',
    component: RegistrationComponent, 
  },
  {
    path: 'registration/:username/:registrationToken',
    component: ActivateComponent
  },
  {
    path: 'contact',
    component: ContactComponent
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
    InfoComponent
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
    UrlService
  ]
})
export class AppModule { }
