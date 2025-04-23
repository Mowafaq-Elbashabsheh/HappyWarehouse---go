import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable()
export class WarehouseInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const userData = localStorage.getItem('UserData');
    
    const userDataObj = JSON.parse(userData? userData : '{}');

    const cloneRequest = request.clone({
        setHeaders: {
            Authorization: `Bearer ${userDataObj.token}`
        }
    });
    
    return next.handle(cloneRequest);
  }
}