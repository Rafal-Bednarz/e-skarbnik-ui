import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { ConfirmComponent } from '../components/confirm/confirm.component';
import { User } from '../interfaces/user';
import { AuthService } from './auth.service';
import { ApiService } from './api.service';
import { Grade } from '../interfaces/grade';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  user!: User;

  grades!: Grade[];
  error!: string;

  constructor(private http: HttpClient, private auth: AuthService, public dialog: MatDialog) { }

  refreshUser(callback: any): void {
    const resp  = this.http.get<User>(ApiService.getApiUrl() + 'user').subscribe(
      (user: User) => {
        this.user = user;
        this.grades = user.grades;
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
          ApiService.responseIsLoadTrue();
          this.http.delete(ApiService.getApiUrl() + 'user/delete').subscribe(
            () => {
              this.auth.clearAuthenticated();
              ApiService.responseIsLoadFalse();
              return callback && callback();
            }
          );
        }
      }
    );
  }
  refreshGrades(): Observable<Grade[]> {
    return this.http.get<Grade[]>(ApiService.getApiUrl() + 'grades').pipe(map(
      (grades: Grade[]) => {
        this.grades = grades;
        return grades;
      }
    ));
  }
  getGrades(): Grade[] {
    return this.grades;
  }
  addGrade(name: string, callback: any, error: any): void {
    const resp = this.http.post<Grade>(ApiService.getApiUrl() + 'grades', {name: name} ).subscribe(
      (grade: Grade) => {
        grade.nr = this.grades.length + 1;
        this.grades.push(grade);
        return callback && callback();
      },
      (err: HttpErrorResponse) => {
        this.error = err.error ? err.error.message : 'Nieoczekiwany błąd';
        return error && error();
      }
    );
  }
  getError(): string {
    return this.error;
  }
  deleteGrade(id: string, name: string, callback: any): void {
    const message = '<p>Usunięcie klasy spowoduje, również bezpowrotne usunięcie wszystkich jej uczniów'
                    + ', wpłat i wypłat.</p> <p>Czy chcesz usunąć klasę ' + '"' + name + '" ?</p>';
    const dialogRef = this.dialog.open(ConfirmComponent, 
      {
        data: message
      });
      dialogRef.afterClosed().subscribe((resp: boolean) => {
        if(resp) {
          ApiService.responseIsLoadTrue();
          this.http.delete(ApiService.getApiUrl() + 'grades/' + id + '/delete').subscribe(
            () => {
              let i = 1;
              this.grades.forEach(
                (value, index) => {
                  if(value.id.toString() === id) {
                    this.grades.splice(index, 1);
                  }});
              this.grades.map(
                (grade: Grade) => {
                  grade.nr = i++;
                }
              );
              return callback && callback();  
            }, 
            (error: HttpErrorResponse) => {
              return callback && callback();
            }); 
        }
    });   
  }
  updateGradesWhenAddPayOffs(grade: Grade) {
    this.grades.map(
      (g: Grade) => {
        if(g.id === grade.id) {
          g.budget = grade.budget;
          g.payOffsSum = grade.payOffsSum;
          g.students = grade.students;
          g.payOffs = grade.payOffs;
        }
      }
    )
  }
}

