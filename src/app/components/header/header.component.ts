import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { User } from 'src/app/interfaces/user';
import { UrlService } from 'src/app/services/url.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  @Input("user")
  user!: User;

  constructor(private http: HttpClient, private authService: AuthService) { }

  ngOnInit(): void {
  }
  logout(): void {
    this.http.post(UrlService.getApi() + 'logout', {}, {}).subscribe();
    this.authService.clearAuthenticated();
  }
  authenticated(): string | null {
    return this.authService.getAuthenticated();
  }
}
