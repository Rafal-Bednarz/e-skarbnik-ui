import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Grade } from '../interfaces/grade';
import { UrlService } from './url.service';
import { map } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class GradeService {

  grades: Grade[] = [];

  error = '';

  constructor(private http: HttpClient) { }

  refreshGrades(): Observable<Grade[]> {
    return this.http.get<Grade[]>(UrlService.getApi() + 'grades').pipe(map(
      (grades: Grade[]) => {
        let i = 1;
        grades.map(
          (grade: Grade) => {
            grade.nr = i;
            i++;
          }
        )
        this.grades = grades;
        return grades;
      }
    ));
  }
  getGrades(): Grade[] {
    return this.grades;
  }
  addGrade(name: string, callback: any, error: any): void {
    const resp = this.http.post<Grade>(UrlService.getApi() + 'grades', {name: name} ).subscribe(
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
  deleteGrade(id: string, callback: any): void {   
    this.http.delete(UrlService.getApi() + 'grades/' + id + '/delete').subscribe(
      () => {
        let i = 1;
        this.grades.forEach(
          (value, index) => {
            if(value.id.toString() === id) {
              this.grades.splice(index, 1);
            }});
        this.grades.map(
          (grade: Grade) => {
            grade.nr = i;
            i++;
          }
        );
        return callback && callback();  
      });
  }
}
