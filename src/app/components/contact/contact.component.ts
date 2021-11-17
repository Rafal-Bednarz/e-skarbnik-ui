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

  startApiRequest = false;

  constructor(private userService: UserService, private http: HttpClient, 
              private router: Router, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.startApiRequest = true;
    this.user = this.userService.getUser();
    this.startApiRequest = false;
  }
  send(): void {
    this.startApiRequest = true;

    this.http.post(UrlService.getApi() + 'contact', this.setMessage()).subscribe(
      () => {
        this.startApiRequest = false;
        this.showInfo();
      },
      (error: HttpErrorResponse) => {
          this.startApiRequest = false;
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
}
