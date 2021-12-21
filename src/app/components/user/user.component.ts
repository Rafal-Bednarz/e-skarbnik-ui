
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog} from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { Grade } from 'src/app/interfaces/grade';
import { ApiService } from 'src/app/services/api.service';
import { GradeFormComponent } from '../grade-form/grade-form.component';
import { GradeService } from 'src/app/services/grade.service';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

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

  grades: Grade[] = [];

  constructor(private userService: UserService, public dialog: MatDialog, 
              private gradeService: GradeService, private router: Router) {
  }

  ngOnInit(): void {
      this.userService.refreshGrades().subscribe(
        () => {
          this.refreshGrades();
        }
      );
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
    this.grades = this.userService.getGrades();
    this.createDataSource();
    ApiService.responseIsLoadFalse();                                                                                                                                                           
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
    this.userService.deleteGrade(id.toString(), name, ()=> this.refreshGrades());
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
  addPayOff(gradeId: number): void {
    if(!this.gradeService.getGrade() || this.gradeService.getGrade().id !== gradeId) {
    this.gradeService.refreshGrade(gradeId.toString()).subscribe();
    }
    this.gradeService.showAddPayOffWindow(gradeId).subscribe(
      (resp: boolean)=> {
        if(resp){
          this.refreshGrades();
          ApiService.dialogIsOpenFalse();
        } else {
          ApiService.dialogIsOpenFalse();
        }
      }
    );
  }
}
