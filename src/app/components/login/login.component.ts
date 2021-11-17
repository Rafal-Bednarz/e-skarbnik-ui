
import { Component, DoCheck, OnChanges, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { UserFormLogin } from '../../interfaces/user-form-login'

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
  startApiRequest = false;
  constructor(private auth: AuthService, private router: Router) { }

  ngOnInit(): void {
  }

  login() {
    this.startApiRequest = true;
    this.auth.authenticate(this.user, () => {
      this.router.navigate(['/']);
    }, () => {
      this.startApiRequest = false;
      this.message = 'Nieprawidłowy login lub hasło';
    });
  }
  getValidateError(): string {
    return this.auth.getErrorMessage();
  }
 
}
