import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ConfirmComponent } from '../components/confirm/confirm.component';
import { Grade } from '../interfaces/grade';
import { PayOff } from '../interfaces/payOff';
import { Student } from '../interfaces/student';
import { UrlService } from './url.service';

@Injectable({
  providedIn: 'root'
})
export class GradeService {

  grade!: Grade;
  
  errorMessage = '';

  constructor(private http: HttpClient, private router: Router, public dialog: MatDialog) { }

  addStudent(fullname: string, id: string, callback: any, error: any): void {
    this.http.post<Student>(UrlService.getUrl() + 'students/' + id, {fullname: fullname}).subscribe(
      (student: Student) => {
        this.grade.students.push(student);
        let i = 1;
        this.grade.students.map(
          (student: Student) =>{
            student.nr = i++;
          }
        );
        return callback && callback();
      }, err => {
        this.errorMessage = err.error ? err.error.message : 'Nieoczekiwany błąd';
        UrlService.responseIsLoadFalse();
        return error && error();
      }
    );
  }
  getErrorMessage(): string {
    return this.errorMessage;
  }

  refreshGrade(id: string): Observable<Grade> {
    return this.http.get<Grade>(UrlService.getUrl() + 'grades/' + id).pipe(map(
      (g: Grade) => {
        this.grade = g;
        let i = 1;
        this.grade.students = g.students.map(
          (student: Student) => {
            student.nr = i++;
            return student;
          }
        );
        let j = 1;
        this.grade.payOffs = g.payOffs.map(
          (payOff: PayOff) => {
            payOff.nr = j++;
            return payOff;
          }
        )
        return this.grade;
      },
      (error: HttpErrorResponse) => {
        this.router.navigate(['']);
      }
    ));
  }
  getStudents(): Student[] {
    return this.grade.students;
  }
  getGrade(): Grade {
    return this.grade;
  }
  getPayOffs(): PayOff[] {
    return this.grade.payOffs;
  }
  showInfo(fullname: string): Observable<boolean> {
    const dialogRef = this.dialog.open(ConfirmComponent, {
      data: '<p>Usunięcie ucznia spowoduje również bezpowrotne usunięcie jego wpłat.</p>'+
            '<p>Czy chcesz usunąć ucznia "' + fullname + '" ?</p>',
      width: '80%'
    });
    return dialogRef.afterClosed();
  }
  deleteStudent(id: string, fullname: string, callback: any): void {
    this.showInfo(fullname).subscribe(
      (resp: boolean) => {
        if(resp) {
          UrlService.responseIsLoadTrue();
          this.http.delete(UrlService.getUrl() + 'students/' + this.grade.id + '/' + id + '/delete').subscribe(
            () => {
              this.grade.students.forEach(
                (student, index) => {
                  if(student.id.toString() === id) {
                    this.grade.students.splice(index, 1);
                  }
                }
              );
              let i = 1;
              this.grade.students.map(
                (student: Student) => {
                  student.nr = i++;
                }
              );
              return callback && callback();
            },
            (error: HttpErrorResponse) => {
              return callback && callback();
            }
          );
        }
      }
    );
  }
}
