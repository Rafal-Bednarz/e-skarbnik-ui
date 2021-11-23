
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog} from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Grade } from 'src/app/interfaces/grade';
import { User } from 'src/app/interfaces/user';
import { GradesService } from 'src/app/services/grades.service';
import { UrlService } from 'src/app/services/url.service';
import { GradeFormComponent } from '../grade-form/grade-form.component';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dataSource: Grade[] = []
  user!: User;

  grades: Grade[] = [];
  dialogIsOpen = false;

  constructor(private gradesService: GradesService, public dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.getGrades();
  }

 applyFilter(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource = this.grades.filter((grade: Grade) => {
      return grade.name.toLowerCase().includes(filterValue.toLowerCase().trim());
  })
 }
  refreshGrades(): void {
    this.grades = this.gradesService.getGrades();
    this.dataSource = this.grades;
    UrlService.responseIsLoadFalse();                                                                                                                                                           
  }
  getGrades(): void {
    UrlService.responseIsLoadTrue();
    this.gradesService.refreshGrades().subscribe(
      () => {
        this.refreshGrades();
      }
    );
  }
  addGrade(): void {
    this.dialogIsOpen = true;
    const dialogRef = this.dialog.open(GradeFormComponent, {
      width:'80%'
    });
    dialogRef.afterClosed().subscribe(
      (resp: boolean) => {
        if(resp) {
        this.refreshGrades();
        this.dialogIsOpen = false;
        } 
      }
    );
  }
  setPaginator(): void {
    const paginator = this.paginator._intl;
    paginator.nextPageLabel = 'Następna strona';;
    paginator.previousPageLabel = 'Poprzednia strona';
    paginator.itemsPerPageLabel = 'Ilość klas na stronie'
  }

  deleteGrade(id: number, name: string): void {
    this.gradesService.deleteGrade(id.toString(), name, ()=> this.refreshGrades());
  }
  RESPONSE_IS_LOAD(): boolean {
    return UrlService.RESPONSE_IS_LOAD;
  }
}
