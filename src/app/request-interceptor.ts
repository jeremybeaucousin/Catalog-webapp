import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { CatalogApiService } from './services/catalog-api.service';
import { SnackBarAppService } from './services/snack-bar-app.services';

@Injectable()
export class RequestInterceptor implements HttpInterceptor {

    constructor(private _snackBar: SnackBarAppService) {

    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (req.url.indexOf(CatalogApiService.toolBoxRoute) !== -1) {
            return next.handle(
                req.clone(
                    {
                        // 
                        headers: req.headers.append('test', 'Bearer ' + " testToken")
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