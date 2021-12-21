import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ConfirmComponent } from '../components/confirm/confirm.component';
import { PayOffFormComponent } from '../components/pay-off-form/pay-off-form.component';
import { StudentFormComponent } from '../components/student-form/student-form.component';
import { Grade } from '../interfaces/grade';
import { Payment } from '../interfaces/payment';
import { PayOff } from '../interfaces/payOff';
import { Student } from '../interfaces/student';
import { ApiService } from './api.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class GradeService {

  grade!: Grade;
  
  errorMessage = '';

  constructor(private http: HttpClient, private router: Router, public dialog: MatDialog,
              private userService: UserService) { }

  addStudent(fullname: string, id: string, callback: any, error: any): void {
    this.http.post<Student>(ApiService.getApiUrl() + 'students/' + id, {fullname: fullname}).subscribe(
      (student: Student) => {
        student.nr = this.grade.students.length + 1;
        this.grade.students.push(student);
        return callback && callback();
      }, (err: HttpErrorResponse) => {
        this.errorMessage = err.error ? err.error.message : 'Nieoczekiwany błąd';
        ApiService.responseIsLoadFalse();
        return error && error();
      }
    );
  }
  getErrorMessage(): string {
    return this.errorMessage;
  }

  refreshGrade(id: string): Observable<Grade> {
    return this.http.get<Grade>(ApiService.getApiUrl() + 'grades/' + id).pipe(map(
      (g: Grade) => {
        this.grade = g;
        let i = 1;
        this.grade.students = g.students.sort((a, b) => a.id - b.id).map(
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
            '<p>Czy chcesz usunąć ucznia "' + fullname + '" ?</p>'
    });
    return dialogRef.afterClosed();
  }
  deleteStudent(id: string, fullname: string, callback: any): void {
    this.showInfo(fullname).subscribe(
      (resp: boolean) => {
        if(resp) {
          ApiService.responseIsLoadTrue();
          this.http.delete(ApiService.getApiUrl() + 'students/' + this.grade.id + '/' + id + '/delete').subscribe(
            () => {
              this.grade.students.forEach(
                (student, index) => {
                  if(student.id.toString() === id) {
                    this.grade.students.splice(index, 1);
                  }
                }
              );
              let i = 1;
              this.grade.students.sort((a, b) => a.id - b.id).map(
                (student: Student) => {
                  student.nr = i++;
                }
              );
              ApiService.responseIsLoadFalse();
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
  addPayOff(value: string, name:string, gradeId: string, callback: any, error: any ) {
    ApiService.responseIsLoadTrue();
    this.http.post<PayOff>(ApiService.getApiUrl() + 'payOffs/' + gradeId, {name: name, value: value})
      .subscribe(
        (payoff: PayOff) => {
          payoff.nr = this.grade.payOffs.length + 1;
          this.grade.payOffs.push(payoff);
          this.grade.payOffsSum += payoff.value;
          this.grade.budget -= payoff.value;
          this.userService.updateGradesWhenAddPayOffs(this.grade);
          return callback && callback();
        }, 
        (err: HttpErrorResponse) => {
          this.errorMessage = err.error ? err.error.message : 'Niespodziewany błąd';
          ApiService.responseIsLoadFalse();
          return error && error();
        }
      );
  };
  showAddPayOffWindow(gradeId: number): Observable<boolean> {
    ApiService.dialogIsOpenTrue();
    const dialogRef = this.dialog.open(PayOffFormComponent, 
      {
        data: gradeId.toString(),
        minWidth: '25%'
      });
      return dialogRef.afterClosed();
  }
  showAddStudentWindow(gradeId: string): Observable<boolean> {
    ApiService.dialogIsOpenTrue();
    const dialogRef = this.dialog.open(StudentFormComponent, {
      data: gradeId,
      minWidth: '25%'
    });
    return dialogRef.afterClosed();
  }
  updateGradeWhenAddPayment(studentId: number, payment: Payment): void {
    this.grade.paymentsSum += payment.value;
    this.grade.budget += payment.value;
    this.grade.students.map((student) => {
      if(studentId === student.id) {
        payment.nr = student.payments.length + 1;
        student.payments.push(payment);
        student.paymentsSum += payment.value;
      }
    });
  }
}
