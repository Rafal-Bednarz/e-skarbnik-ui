import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Params, Router} from '@angular/router';
import { Grade } from 'src/app/interfaces/grade';
import { Student } from 'src/app/interfaces/student';
import { GradeService } from 'src/app/services/grade.service';
import { UrlService } from 'src/app/services/url.service';
import { StudentFormComponent } from '../student-form/student-form.component';

@Component({
  selector: 'app-grade',
  templateUrl: './grade.component.html',
  styleUrls: ['./grade.component.css']
})
export class GradeComponent implements OnInit {

  grade!: Grade;

  students!: Student[];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns = ['nr', 'fullname', 'paymentsSum', 'action'];

  dataSource!: MatTableDataSource<Student>;

  dialogIsOpen = false;

  constructor(private router: Router, private route: ActivatedRoute, private gradeService: GradeService,
              public dialog: MatDialog) { }

  ngOnInit(): void {
    UrlService.responseIsLoadTrue();
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
  createDataSource(): void {
    this.dataSource = new MatTableDataSource(this.students);
    setTimeout(() => {this.dataSource.paginator = this.paginator
                      this.dataSource.sort = this.sort,
                      this.setPaginator() }, 1);
  }
  setPaginator(): void {
    this.paginator._intl.previousPageLabel = 'Poprzednia strona';
    this.paginator._intl.nextPageLabel = 'Następna strona';
    this.paginator._intl.itemsPerPageLabel = 'Ilość uczniów na stronie';
  }
  refreshGrade(): void {
    this.grade = this.gradeService.getGrade();
        if(this.grade) {
        this.students = this.grade.students;
        UrlService.responseIsLoadFalse();
        this.createDataSource();
    }
  }
  showDialog(id: string): void {
    this.dialogIsOpen = true;
    const dialogRef = this.dialog.open(StudentFormComponent, {
      data: id,
      width: '80%'
    });
    dialogRef.afterClosed().subscribe(
      (resp: boolean) => {
        if(resp) {
          this.refreshGrade();
          this.dialogIsOpen = false;
        }
      }
    );
  }
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if(this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  addStudent(): void {
    this.showDialog(this.grade.id.toString());
  }
  deleteStudent(id: string, fullname: string): void {
    
    this.gradeService.deleteStudent(id, fullname, () => this.refreshGrade());
  }
  RESPONSE_IS_LOAD(): boolean {
    return UrlService.RESPONSE_IS_LOAD;
  }
}
