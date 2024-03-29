import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, Output, EventEmitter} from '@angular/core';
import { User } from '../interfaces/user';
import { UserFormRegistration } from '../interfaces/user-form-regstration';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {

  message = '';
  
  constructor(private http: HttpClient) { }

  registerUser(user: UserFormRegistration, repeat: string, callback:
   any, error: any) {
    if(user.password !== repeat) {
      this.message = 'Hasła nie są jednakowe';
      return error && error();
    } else {
      this.http.post<User>(ApiService.getApiUrl() + 'registration', user, {}).subscribe(
        (user: User) => {
          return callback && callback();
        },
        (err: HttpErrorResponse) => {
          this.message = err.error ? err.error.message: 'Nieoczekiwany błąd';
          return error && error();
        });
      }
  }
  getMessage(): string {
    return this.message;
  }
}

