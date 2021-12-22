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
    localStorage.setItem('username', username);
    localStorage.setItem('token', 'Bearer ' + token)
  }
  public getAuthenticated(): boolean {
    return localStorage.getItem('username') && localStorage.getItem('token') ? true : false;
  }
  public getToken(): string {
    const token = localStorage.getItem('token') ? localStorage.getItem('token') : '';
    return token ? token : '';
  }
  public clearAuthenticated(): void {
    localStorage.removeItem('username');
    localStorage.removeItem('token');
    localStorage.removeItem('policyAccepted');

  }
  public getErrorMessage(): string {
    return this.errorMessage;
  }
  public getUser(): Observable<User> {
      return this.http.get<User>(ApiService.getApiUrl() + 'user');
  }
  public isPolicyAccepted() {
    return localStorage.getItem('policyAccepted');
  }
}
