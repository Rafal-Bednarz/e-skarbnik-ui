
import { AfterViewInit, Component, DoCheck, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { Router, RouterEvent } from '@angular/router';
import { User } from '../app/interfaces/user';
import { PolicyComponent } from './components/policy/policy.component';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {

  user!: User;

  constructor(private router: Router, private userService: UserService, private auth: AuthService,
              private _bottomSheet: MatBottomSheet) {
  }
  
  ngOnInit(): void {
    this.getUser();
  }
  ngAfterViewInit(): void {
    if(!window.sessionStorage.getItem('policyAccepted')) {
    setTimeout(() => this.openBottomSheet(), 1000);
    }
  }
  getUser(): void {
    if(this.auth.getAuthenticated()) {
      this.userService.refreshUser(() => this.user = this.userService.getUser());
    }
  }
  deleteUser(): void {
    this.userService.deleteUser(() => this.router.navigate(['login']));
  }
  openBottomSheet(): void {
    const bottomSheetRef = this._bottomSheet.open(PolicyComponent, 
      {
        disableClose: true,
      });
  }
  refreshUser(): void {
    if(this.auth.getAuthenticated() && this.user !== this.userService.getUser()) {
      this.user = this.userService.getUser();
    }
  }
}

