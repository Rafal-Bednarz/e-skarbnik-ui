
import { Component, DoCheck, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../app/interfaces/user';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  user!: User;

  constructor(private router: Router, private userService: UserService, private auth: AuthService) {
  }
  
  ngOnInit(): void {
    this.getUser();
  }
  getUser(): void {
    if(this.auth.getAuthenticated()) {
      this.userService.refreshUser(() => this.user = this.userService.getUser());
    }
  }
  deleteUser(): void {
    this.userService.deleteUser(() => this.router.navigate(['login']));
  }
}

