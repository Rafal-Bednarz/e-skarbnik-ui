import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { GradesService } from 'src/app/services/grades.service';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-grade-form',
  templateUrl: './grade-form.component.html',
  styleUrls: ['./grade-form.component.css']
})
export class GradeFormComponent implements OnInit {

  error = '';

  name = '';

  constructor(private gradesService: GradesService, public dialogRef: MatDialogRef<GradeFormComponent>) { }

  ngOnInit(): void {
  }
  addGrade(): void {
    ApiService.responseIsLoadTrue();
    this.gradesService.addGrade(this.name, () => this.close(), () => {this.error = this.gradesService.getError();
                                                                     ApiService.responseIsLoadFalse();});

  }
  close(): void {
    this.dialogRef.close(true);
  }
  RESPONSE_IS_LOAD(): boolean {
    return ApiService.RESPONSE_IS_LOAD;
  }
}
