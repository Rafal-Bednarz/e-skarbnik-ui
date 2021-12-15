import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MailMessage } from 'src/app/interfaces/mail-message';
import { User } from 'src/app/interfaces/user';
import { ApiService } from 'src/app/services/api.service';
import { UserService } from 'src/app/services/user.service';
import { InfoComponent } from '../info/info.component';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {

  user!: User;

  subject = '';
  message = '';

  error = '';

  constructor(private userService: UserService, private http: HttpClient, 
              private router: Router, private dialog: MatDialog) { }

  ngOnInit(): void {
    ApiService.responseIsLoadTrue();
    this.user = this.userService.getUser();
    ApiService.responseIsLoadFalse();
  }
  send(): void {
    ApiService.responseIsLoadTrue();

    this.http.post(ApiService.getApiUrl() + 'contact', this.setMessage()).subscribe(
      () => {
        ApiService.responseIsLoadFalse();
        this.showInfo();
      },
      (error: HttpErrorResponse) => {
          ApiService.responseIsLoadFalse();
          this.error = error.error ? error.error.message : 'Niespodziewany błąd';
      }
    );
  }
  setMessage(): MailMessage {
    return { 
      subject: this.user && this.subject ? 
            this.subject + ' ( ' + this.user.username + ', ' + this.user.email + ' )': this.subject,
      message: this.message
    }
  }
  showInfo(): void {
    const dialogRef =
    this.dialog.open(InfoComponent);
    
    dialogRef.afterClosed().subscribe(
      () => 
        this.router.navigate(['/'])
      );
  }
  RESPONSE_IS_LOAD(): boolean {
    return ApiService.RESPONSE_IS_LOAD;
  }
}
