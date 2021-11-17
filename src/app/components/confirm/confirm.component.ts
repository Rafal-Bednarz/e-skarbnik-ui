import { HtmlParser } from '@angular/compiler';
import { Parser } from '@angular/compiler/src/ml_parser/parser';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.css']
})
export class ConfirmComponent implements OnInit {

  message: string;

  constructor(public dialogRef: MatDialogRef<ConfirmComponent>, 
              @Inject(MAT_DIALOG_DATA) data: string) { 
                this.message = data;
              }

  ngOnInit(): void {
  }
}
