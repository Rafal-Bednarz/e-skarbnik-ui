import { HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Jwttoken } from '../interfaces/jwttoken';
import { User } from '../interfaces/user';
import { UserFormLogin } from '../interfaces/user-form-login';
import { ApiService } from './api.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  errorMessage = '';

  constructor(private http: HttpClient, private router: Router) {}

  authenticate(credentials: UserFormLogin, callback: any, error: any): void {
    
      this.http.post<Jwttoken>(ApiService.getApiUrl() + 'login', credentials, {}).subscribe(
        (resp: Jwttoken) => {
          this.setAuthenticated(credentials.username, resp.token);
          return callback && callback();
        },
        (err: HttpErrorResponse) => {
          if(err.error && err.status === 400) {
            
            this.errorMessage = err.error.message;
            
            return error && error();
          } else {
            this.router.navigate(['**']);
          }
        }
      );
  }
  public setAuthenticated(username: string, token: string) {
    window.sessionStorage.setItem('username', username);
    window.sessionStorage.setItem('token', 'Bearer ' + token)
  }
  public getAuthenticated(): boolean {
    return window.sessionStorage.getItem('username') && window.sessionStorage.getItem('token') ? true : false;
  }
  public getToken(): string {
    const token = window.sessionStorage.getItem('token') ? window.sessionStorage.getItem('token') : '';
    return token ? token : '';
  }
  public clearAuthenticated(): void {
    window.sessionStorage.removeItem('username');
    window.sessionStorage.removeItem('token');
  }
  public getErrorMessage(): string {
    return this.errorMessage;
  }
  public getUser(): Observable<User> {
      return this.http.get<User>(ApiService.getApiUrl() + 'user');
  }
}
