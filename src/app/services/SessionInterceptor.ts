import { HttpClient, HttpErrorResponse, HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable} from "rxjs";

@Injectable()
export class SessionInterceptor implements HttpInterceptor {
    
    constructor() {}
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        const cloneReg = req.clone({
            headers: req.headers.set('X-Requested-With', 'XMLHttpRequest')
                                .set('Content-Type', 'application/json'),
                                
            withCredentials: true,
            
        });
        return next.handle(cloneReg);
    }
}
