
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ApiService } from 'src/app/services/api.service';
import { UserFormLogin } from '../../interfaces/user-form-login'
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  hide = true;

  message = '';
  validateError = false;

  user: UserFormLogin = {
    username: "",
    password: ""
  }
  constructor(private auth: AuthService, private router: Router, private userService: UserService) { }

  ngOnInit(): void {
    ApiService.responseIsLoadFalse();
  }

  login() {
    ApiService.responseIsLoadTrue();
    this.auth.authenticate(this.user, () => {
      
        this.auth.setAuthenticated('OK');
        this.router.navigate(['/']);
    }
    , () => {
      ApiService.responseIsLoadFalse();
      this.message = this.auth.getErrorMessage();
    });
  }
  getValidateError(): string {
    return this.auth.getErrorMessage();
  }
  RESPONSE_IS_LOAD(): boolean {
    return ApiService.RESPONSE_IS_LOAD;
  }
}
