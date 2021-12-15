import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-activate',
  templateUrl: './activate.component.html',
  styleUrls: ['./activate.component.css']
})
export class ActivateComponent implements OnInit {

  registrationToken = '';
  username = '';

  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    ApiService.responseIsLoadTrue();
    let resp = this.route.params.subscribe((params: Params) => {
      this.username = params['username'];
      this.registrationToken = params['registrationToken'];
      this.activateUser();
      }
    )
  }
  activateUser() {
    this.http.get(ApiService.getUrl() + 'registration/' + this.username + '/' + this.registrationToken)
          .subscribe(() => {
            ApiService.responseIsLoadFalse();
          }, error => {
            this.router.navigate(['**']);
            ApiService.responseIsLoadFalse();
    });
  }
  RESPONSE_IS_LOAD(): boolean {
    return ApiService.RESPONSE_IS_LOAD;
  }
}
