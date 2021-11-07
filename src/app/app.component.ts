import { HttpClient} from '@angular/common/http';
import { Component, DoCheck, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from './interfaces/user';
import { UrlService } from './services/url.service';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, DoCheck, OnDestroy {

  refresh = true;

  user!: User;

  constructor(private router: Router, private authService: AuthService,
     private http: HttpClient) {
  }
  
  ngOnInit(): void { 
    
    if(!this.authenticated()){
      this.router.navigate(['login']);
    }
  }
  ngDoCheck():void {
    this.refreshUser()
  }
  ngOnDestroy():void {
  }
  authenticated(): string | null {
    return this.authService.getAuthenticated();
  }
  onRouterActivated(event: any) {
    this.refresh = true;
  }
  refreshUser() {
    if(this.authenticated() && this.refresh) {
    
    this.http.get<User>(UrlService.getApi() + 'user').subscribe(
      resp => {
        this.user = resp;
      }, error => {
        // dodaj obsługę błędu
      });
      this.refresh = false;
    }
  }
}

