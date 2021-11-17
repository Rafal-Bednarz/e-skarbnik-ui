import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { UrlService } from 'src/app/services/url.service';

@Component({
  selector: 'app-activate',
  templateUrl: './activate.component.html',
  styleUrls: ['./activate.component.css']
})
export class ActivateComponent implements OnInit {

  registrationToken = '';
  username = '';

  startApiResponse = false;

  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    let resp = this.route.params.subscribe((params: Params) => {
      this.username = params['username'];
      this.registrationToken = params['registrationToken'];
      this.activateUser();
      }
    )
  }
  activateUser() {
    this.startApiResponse = true;
    this.http.get(UrlService.getApi() + 'registration/' + this.username + '/' + this.registrationToken)
          .subscribe(() => {
          }, error => {
            this.router.navigate(['login']);
    });
    this.startApiResponse = false;
  }
}
