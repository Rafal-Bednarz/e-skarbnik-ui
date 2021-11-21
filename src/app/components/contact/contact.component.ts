import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MailMessage } from 'src/app/interfaces/mail-message';
import { User } from 'src/app/interfaces/user';
import { UrlService } from 'src/app/services/url.service';
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
    UrlService.responseIsLoadTrue();
    this.user = this.userService.getUser();
    UrlService.responseIsLoadFalse();
  }
  send(): void {
    UrlService.responseIsLoadTrue();

    this.http.post(UrlService.getUrl() + 'contact', this.setMessage()).subscribe(
      () => {
        UrlService.responseIsLoadFalse();
        this.showInfo();
      },
      (error: HttpErrorResponse) => {
          UrlService.responseIsLoadFalse();
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
    return UrlService.RESPONSE_IS_LOAD;
  }
}
