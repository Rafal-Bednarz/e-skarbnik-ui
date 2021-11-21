import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { GradesService } from 'src/app/services/grades.service';
import { UrlService } from 'src/app/services/url.service';

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
    UrlService.responseIsLoadTrue();
    this.gradesService.addGrade(this.name, () => this.close(), () => {this.error = this.gradesService.getError();
                                                                     UrlService.responseIsLoadFalse();});

  }
  close(): void {
    this.dialogRef.close(true);
  }
  RESPONSE_IS_LOAD(): boolean {
    return UrlService.RESPONSE_IS_LOAD;
  }
}
