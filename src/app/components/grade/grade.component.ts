import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router} from '@angular/router';
import { Grade } from 'src/app/interfaces/grade';
import { PayOff } from 'src/app/interfaces/payOff';
import { Student } from 'src/app/interfaces/student';
import { GradeService } from 'src/app/services/grade.service';
import { ApiService } from 'src/app/services/api.service';
import { PayOffsComponent } from '../pay-offs/pay-offs.component';
import { StudentsComponent } from '../students/students.component';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-grade',
  templateUrl: './grade.component.html',
  styleUrls: ['./grade.component.css']
})
export class GradeComponent implements OnInit {

  @ViewChild('studentsRef') studentsRef!: StudentsComponent;
  @ViewChild('payOffsRef') payOffsRef!: PayOffsComponent;

  grade!: Grade;

  students!: Student[];
  
  payOffs!: PayOff[];

  constructor(private router: Router, private route: ActivatedRoute, private gradeService: GradeService) { }

  ngOnInit(): void {
    ApiService.responseIsLoadTrue();
    this.route.params.subscribe(
      (params: Params) => {
        this.gradeService.refreshGrade(params['id']).subscribe(
          () => {
            this.refreshGrade();
          }
        );
      }
    );
  }
  refreshGrade(): void {
    this.grade = this.gradeService.getGrade();
    if(this.grade) {
      ApiService.responseIsLoadFalse();
      this.students = this.grade.students;
      this.payOffs = this.grade.payOffs;
      if(this.studentsRef) {
        this.studentsRef.createDataSource();
      }
      if(this.payOffsRef) {
        this.payOffsRef.createDataSource();
      }
    }
  }
  addStudent(): void {
    this.gradeService.showAddStudentWindow(this.grade.id.toString()).subscribe(
      (resp: boolean) => {
        if(resp) {
          this.refreshGrade();
          ApiService.dialogIsOpenFalse();
        } else {
          ApiService.dialogIsOpenFalse();
        }
      }
    );
  }
  RESPONSE_IS_LOAD(): boolean {
    return ApiService.RESPONSE_IS_LOAD;
  }
  applyFilter(event: Event): void {
    if(this.studentsRef) {
      this.studentsRef.applyFilter(event);
    }
    if(this.payOffsRef) {
      this.payOffsRef.applyFilter(event);
    }
  }
  DIALOG_IS_OPEN(): boolean {
    return ApiService.DIALOG_IS_OPEN;
  }
  addPayOff(gradeId: number): void {
    this.gradeService.showAddPayOffWindow(gradeId).subscribe(
      (resp:boolean) => {
        if(resp) {
          this.router.navigate(['/']);
          ApiService.dialogIsOpenFalse();
        } else {
          ApiService.dialogIsOpenFalse();
        }
      }
    );
  }
}
