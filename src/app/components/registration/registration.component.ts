
import { Component, OnInit} from '@angular/core';
import { UserFormRegistration } from 'src/app/interfaces/user-form-regstration';
import { Router} from '@angular/router';
import { RegistrationService } from 'src/app/services/registration.service';
import { MatDialog } from '@angular/material/dialog';
import { RegisterInfoComponent } from '../register-info/register-info.component';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  user: UserFormRegistration = 
  {
    username: '',
    email: '',
    password: ''
  };

  repeat= '';

  message='';

  constructor(private router: Router, private regService: RegistrationService, private dialog: MatDialog) { }

  ngOnInit(): void {
  }
  registerUser(): void {
    ApiService.responseIsLoadTrue();
    this.regService.registerUser(this.user, this.repeat, 
                                () => { ApiService.responseIsLoadFalse(); this.showInfo(this.user);}, 
                                () => { ApiService.responseIsLoadFalse(); this.message = this.regService.getMessage()});
    
  }
  showInfo(user: UserFormRegistration): void {
    const dialogRef = this.dialog.open(RegisterInfoComponent, {
      data: user
    });
    dialogRef.afterClosed().subscribe(
      () => 
        this.router.navigate(['login'])
    );
  }
  RESPONSE_IS_LOAD(): boolean {
    return ApiService.RESPONSE_IS_LOAD;
  }
}
