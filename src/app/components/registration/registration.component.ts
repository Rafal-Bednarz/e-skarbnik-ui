import { HttpClient} from '@angular/common/http';
import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { UserFormRegistration } from 'src/app/interfaces/user-form-regstration';
import { MatDialog } from '@angular/material/dialog'
import { Router} from '@angular/router';
import { RegistrationService } from 'src/app/services/registration.service';
import { RegisterInfoComponent } from '../register-info/register-info.component';

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

  userVerified = false;

  constructor(private http: HttpClient, public dialog: MatDialog,
              private router: Router, private regService: RegistrationService) { }

  ngOnInit(): void {
  }
  registerUser(): void {
    this.regService.registerUser(this.user, this.repeat, 
      () => {this.userVerified = true},
      () => {this.message = this.regService.getMessage()});
    if(this.userVerified) {this.openDialog(this.user);}
  }
  openDialog(user: UserFormRegistration) {

    const dialogRef = this.dialog.open(RegisterInfoComponent, {
      data: user,
    });
    return dialogRef.afterClosed().subscribe(
      () => {
        this.router.navigate(['login']);
      }
    );
  }
}
