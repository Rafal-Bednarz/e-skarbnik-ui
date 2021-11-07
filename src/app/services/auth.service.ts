import { HttpClient, HttpErrorResponse, HttpHandler, HttpHeaders, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../interfaces/user';
import { UserFormLogin } from '../interfaces/user-form-login';
import { UrlService } from './url.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  errorMessage = '';

  constructor(private http: HttpClient) {}

  authenticate(credentials: UserFormLogin, callback: any, error: any): void {
    
      this.http.post<Boolean>(UrlService.getApi() + 'login', credentials, {}).subscribe(
        (resp: Boolean) => {
          if(resp) {
            const headers = new HttpHeaders(credentials ? 
              {
                authorization: 'Basic ' + btoa(credentials.username + ':' + credentials.password)
              }: {});
            const resp = this.http.get<User>(UrlService.getApi() + 'user', {headers: headers}).subscribe(
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
          this.errorMessage = err.error ? err.error.message : 'nieznany błąd'; 
          return error && error();
        }
      );
  }
  public setAuthenticated(value: string) {
    sessionStorage.setItem('authenticated', value);
  }
  public getAuthenticated() {
    return sessionStorage.getItem('authenticated');
  }
  public clearAuthenticated() {
    sessionStorage.removeItem('authenticated');
  }
  public getErrorMessage(): string {
    return this.errorMessage;
  }
  refreshSession(): void {
    
    window.location.assign(UrlService.getMainUrl());
  }
}