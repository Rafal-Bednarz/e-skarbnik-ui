import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserFormRegistration } from 'src/app/interfaces/user-form-regstration';

@Component({
  selector: 'app-register-info',
  templateUrl: './register-info.component.html',
  styleUrls: ['./register-info.component.css']
})
export class RegisterInfoComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<RegisterInfoComponent>,
               @Inject(MAT_DIALOG_DATA) public user: UserFormRegistration) { }

  ngOnInit(): void {
  }
}
