import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { GradeService } from 'src/app/services/grade.service';

@Component({
  selector: 'app-grade-form',
  templateUrl: './grade-form.component.html',
  styleUrls: ['./grade-form.component.css']
})
export class GradeFormComponent implements OnInit {

  error = '';

  startApiRequest = false;

  name = '';

  constructor(private gradeService: GradeService, public dialogRef: MatDialogRef<GradeFormComponent>) { }

  ngOnInit(): void {
  }
  addGrade(): void {
    this.startApiRequest = true;
    this.gradeService.addGrade(this.name, () => this.close(), () => {this.error = this.gradeService.getError();
                                                                     this.startApiRequest = false;});

  }
  close(): void {
    this.dialogRef.close(true);
  }
}
