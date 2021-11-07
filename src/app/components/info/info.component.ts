import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UserFormRegistration } from 'src/app/interfaces/user-form-regstration';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.css']
})
export class InfoComponent implements OnInit {

  @Input('user') user!: UserFormRegistration;
  @Output('close') onClose: EventEmitter<null> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }
  close() {
      this.onClose.emit();
  }
}
