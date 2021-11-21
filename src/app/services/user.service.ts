import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { ConfirmComponent } from '../components/confirm/confirm.component';
import { User } from '../interfaces/user';
import { AuthService } from './auth.service';
import { UrlService } from './url.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  user!: User;

  constructor(private http: HttpClient, private auth: AuthService, public dialog: MatDialog) { }

  refreshUser(callback: any): void {
    const resp  = this.http.get<User>(UrlService.getUrl() + 'user').subscribe(
      (user: User) => {
        this.user = user;
        return callback && callback();
      },
      () => {
        this.auth.clearAuthenticated();
      }
    );
  }
  getUser(): User {
    return this.user;
  }
  showInfo(): Observable<boolean> {
    const dialogRef = this.dialog.open(ConfirmComponent, {
      data: '<p>Usunięcie konta spowoduje bezpowrotne usunięcie wszystkich klas, uczniów, oraz wpłat i wypłat. </p>'+ 
      '<p>Czy chcesz usunąc konto' + ' " ' + this.user.username + ' " ' + '?</p>'
    });
    return dialogRef.afterClosed();
  }
  deleteUser(callback: any): void {
    this.showInfo().subscribe(
      (resp: boolean) => {
        if(resp) {
          this.http.delete(UrlService.getUrl() + 'user/delete').subscribe(
            () => {
              this.auth.clearAuthenticated();
              return callback && callback();
            }
          );
        }
      }
    );
  }
}

