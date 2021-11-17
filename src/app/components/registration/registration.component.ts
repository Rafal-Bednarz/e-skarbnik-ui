
import { Component, OnInit} from '@angular/core';
import { UserFormRegistration } from 'src/app/interfaces/user-form-regstration';
import { Router} from '@angular/router';
import { RegistrationService } from 'src/app/services/registration.service';
import { MatDialog } from '@angular/material/dialog';
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

  startApiRequest = false;

  constructor(private router: Router, private regService: RegistrationService, private dialog: MatDialog) { }

  ngOnInit(): void {
  }
  registerUser(): void {
    this.startApiRequest = true;
    this.regService.registerUser(this.user, this.repeat, 
                                () => { this.startApiRequest = false; this.showInfo(this.user);}, 
                                () => { this.startApiRequest = false; this.message = this.regService.getMessage()});
    
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
}
