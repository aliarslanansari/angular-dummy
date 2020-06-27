import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
export class ErrorInterceptor implements HttpInterceptor{
    constructor(private dialog:MatDialog){}
    intercept(req:HttpRequest<any>,next:HttpHandler){
        return next.handle(req).pipe(
            catchError((error:HttpErrorResponse)=>{
                console.log(console.error); 
                alert(error.error.error.message);
                return throwError(error);
            })
        );
    } 
}