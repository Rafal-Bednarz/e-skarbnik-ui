import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable, throwError} from "rxjs";
import { catchError, map } from "rxjs/operators";
import { AuthService } from "./auth.service";

@Injectable()
export class SessionInterceptor implements HttpInterceptor {
    
    constructor(private auth: AuthService, private router: Router) {}
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let cloneReq = req.clone();
        if(this.auth.getAuthenticated()) {
            cloneReq = req.clone({
                setHeaders: {Authorization: this.auth.getToken()}
            });
        }
        return next.handle(cloneReq).pipe(
            catchError(
                (resp) => {
                        if(resp.status === 401) {
                            this.auth.clearAuthenticated();
                            this.router.navigate(['login']);
                        } else if(resp.status === 0 || resp.status >= 500) {
                            this.auth.clearAuthenticated();
                            this.router.navigate(['**']);
                        } else if(resp.status === 404) {
                            this.router.navigate(['**']);
                        }
                    return throwError(resp);
                }
            )
        );
    }
}
