import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Grade } from 'src/app/interfaces/grade';
import { PayOff } from 'src/app/interfaces/payOff';
import { User } from 'src/app/interfaces/user';
import { GradeService } from 'src/app/services/grade.service';

import { ConfirmComponent } from '../confirm/confirm.component';
import { GradeFormComponent } from '../grade-form/grade-form.component';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit, AfterViewInit {

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = ['nr', 'name', 'studentsAmount', 'budget', 'paymentsSum', 'payOffsSum', 'action'];

  dataSource!: MatTableDataSource<Grade>;

  user!: User;

  grades: Grade[] = [];

  payOffs: PayOff[] = [];

  startApiRequest = false;

  constructor(private gradeService: GradeService, 
              private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.getGrades();
  }
  ngAfterViewInit(): void {
  }
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if(this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  refreshGrades(): void {
    this.grades = this.gradeService.getGrades();
    this.startApiRequest = false;
    this.createDataSource();                                                                                                                                                           
  }
  getGrades(): void {
    this.startApiRequest = true;
    this.gradeService.refreshGrades().subscribe(
      () => {
        this.refreshGrades();
      }
    );
  }
  addGrade(): void {
    const dialogRef = this.dialog.open(GradeFormComponent, {
      width:'80%'
    });
    dialogRef.afterClosed().subscribe(
      (resp: boolean) => {
        if(resp) {
        this.refreshGrades();
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
    const message = 'Usunięcie klasy spowoduje, również bezpowrotne usunięcie wszystkich jej uczniów'
                    + ', wpłat i wypłat. Czy chcesz usunąć klasę ' + '"' + name + '" ?';
    const dialogRef = this.dialog.open(ConfirmComponent, 
      {
        data: message
      });
      dialogRef.afterClosed().subscribe((resp: boolean) => {
        if(resp) {
        this.startApiRequest = true; 
        this.gradeService.deleteGrade(id, () => this.refreshGrades()); 
        }
    })
  }
}
