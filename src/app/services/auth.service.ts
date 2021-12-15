import { HttpClient, HttpErrorResponse, HttpHandler, HttpHeaders, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from '../interfaces/user';
import { UserFormLogin } from '../interfaces/user-form-login';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  errorMessage = '';

  constructor(private http: HttpClient, private router: Router) {}

  authenticate(credentials: UserFormLogin, callback: any, error: any): void {
    
      this.http.post<Boolean>(ApiService.getApiUrl() + 'login', credentials, {}).subscribe(
        (resp: Boolean) => {
          if(resp) {
            const headers = new HttpHeaders(credentials ? 
              {
                authorization: 'Basic ' + btoa(credentials.username + ':' + credentials.password)
              }: {});
            const resp = this.http.get<User>(ApiService.getApiUrl() + 'user', {headers: headers}).subscribe(
              () => {
                this.setAuthenticated('OK');
                this.refreshSession();
              });    
          } else {
            this.clearAuthenticated();
          }
          return callback && callback();
        },
        (err: HttpErrorResponse) => {
          if(err.error && err.status === 400) {
            if(err.error.message.toLowerCase() === 'konto nieaktywne') {
            this.errorMessage = err.error.message;
            } else {
              this.errorMessage = 'Nieprawidłowy login lub hasło';
            }
            return error && error();
          } else {
            this.router.navigate(['**']);
          }
        }
      );
  }
  public setAuthenticated(value: string) {
    window.sessionStorage.setItem('authenticated', value);
  }
  public getAuthenticated() {
    return window.sessionStorage.getItem('authenticated');
  }
  public clearAuthenticated() {
    window.sessionStorage.removeItem('authenticated');
  }
  public getErrorMessage(): string {
    return this.errorMessage;
  }
  public getUser(): Observable<User> {
      return this.http.get<User>(ApiService.getApiUrl() + 'user');
  }
  refreshSession(): void {
    
    window.location.assign(ApiService.getMainUrl());
  }
}
