
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog} from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { Grade } from 'src/app/interfaces/grade';
import { User } from 'src/app/interfaces/user';
import { GradesService } from 'src/app/services/grades.service';
import { ApiService } from 'src/app/services/api.service';
import { GradeFormComponent } from '../grade-form/grade-form.component';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit, OnDestroy{

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  dataSourceStream!: MatTableDataSource<Grade>;
  dataSource!: Observable<Grade[]>;

  user!: User;

  grades: Grade[] = [];

  constructor(private gradesService: GradesService, public dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.getGrades();
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceStream.filter = filterValue.trim().toLowerCase();
    if(this.dataSourceStream.paginator) {
      this.dataSourceStream.paginator.firstPage();
    }
    this.dataSource = this.dataSourceStream.connect();
  }
  refreshGrades(): void {
    this.grades = this.gradesService.getGrades();
    this.createDataSource();
    ApiService.responseIsLoadFalse();                                                                                                                                                           
  }
  getGrades(): void {
    ApiService.responseIsLoadTrue();
    this.gradesService.refreshGrades().subscribe(
      () => {
        this.refreshGrades();
      }
    );
  }
  addGrade(): void {
    ApiService.dialogIsOpenTrue();
    const dialogRef = this.dialog.open(GradeFormComponent, {
      minWidth: '25%'
    });
    dialogRef.afterClosed().subscribe(
      (resp: boolean) => {
        if(resp) {
          this.refreshGrades();
          ApiService.dialogIsOpenFalse();
        } else {
          ApiService.dialogIsOpenFalse();
        }
      }
    );
  }
  createDataSource(): void {
    this.dataSourceStream = new MatTableDataSource<Grade>(this.grades);
    setTimeout(() => {
      this.dataSourceStream.paginator = this.paginator;
      this.setPaginator();
      this.dataSource = this.dataSourceStream.connect();
    }, 1);  
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
    return ApiService.RESPONSE_IS_LOAD;
  }
  ngOnDestroy(): void {
    if(this.dataSourceStream) {
      this.dataSourceStream.disconnect();
    }
  }
  DIALOG_IS_OPEN(): boolean {
    return ApiService.DIALOG_IS_OPEN;
  }
}
