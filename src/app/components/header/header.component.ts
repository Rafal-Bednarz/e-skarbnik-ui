import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { User } from 'src/app/interfaces/user';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  @Input("user")
  user!: User;
  @Output('delete') delete: EventEmitter<null> = new EventEmitter();

  constructor(private http: HttpClient, private authService: AuthService) { }

  ngOnInit(): void {
  }
  logout(): void {
    this.authService.clearAuthenticated();
  }
  authenticated(): boolean {
    return this.authService.getAuthenticated();
  }
  deleteUser(): void {
    this.delete.emit();
  }
}
