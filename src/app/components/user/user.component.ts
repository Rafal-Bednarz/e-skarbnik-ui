
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

  displayedColumns: string[] = ['nr', 'name', 'studentsAmount', 'budget', 'paymentsSum', 'payOffsSum', 'action'];

  dataSource!: MatTableDataSource<Grade>;

  user!: User;

  grades: Grade[] = [];
  dialogIsOpen = false;

  constructor(private gradesService: GradesService, public dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.getGrades();
  }
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if(this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  refreshGrades(): void {
    this.grades = this.gradesService.getGrades();
    UrlService.responseIsLoadFalse();
    this.createDataSource();                                                                                                                                                           
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
  createDataSource(): void {
    this.dataSource = new MatTableDataSource(this.grades);
    setTimeout(() => {this.dataSource.paginator = this.paginator; 
                      this.setPaginator(); 
                      this.dataSource.sort = this.sort; }, 1);
  }
  deleteGrade(id: string, name: string): void {
    this.gradesService.deleteGrade(id, name, ()=> this.refreshGrades());
  }
  RESPONSE_IS_LOAD(): boolean {
    return UrlService.RESPONSE_IS_LOAD;
  }
}
