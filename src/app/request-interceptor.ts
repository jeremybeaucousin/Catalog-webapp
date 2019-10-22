import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

import { MatSnackBar } from '@angular/material';

import { CatalogApiService } from './catalog-api.service';

@Injectable()
export class RequestInterceptor implements HttpInterceptor {

    constructor(private _snackBar: MatSnackBar) {

    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (req.url.indexOf(CatalogApiService.toolBoxRoute) !== -1) {
            return next.handle(
                req.clone(
                    {
                        headers: req.headers.append('Authorization', 'Bearer ' + "testToken")
                    }
                )).pipe(
                    catchError((error: HttpErrorResponse) => {
                        return this.errorHandler(req, next, error);
                    })
                );
        } else {
            // Do Nothing
            return next.handle(req);
        }
    }

    errorHandler(req: HttpRequest<any>, next: HttpHandler, error: HttpErrorResponse): Observable<HttpEvent<any>> {
        console.error("an error occured", error);
        this._snackBar.open(`Une erreur s'est : ${error.message}`, "fermer", {
            // In seconds
            duration: 3 * 1000,
        });
        return next.handle(req);
    }
}