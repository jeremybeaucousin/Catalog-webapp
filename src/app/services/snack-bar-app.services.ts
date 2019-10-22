import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { MatSnackBar, MatSnackBarConfig, MatSnackBarDismiss, MatSnackBarRef, SimpleSnackBar } from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class SnackBarAppService {
  constructor(private _snackBar: MatSnackBar) { }

  public open(message: string, action?: string, config?: MatSnackBarConfig): MatSnackBarRef<SimpleSnackBar> {
    if (this._snackBar._openedSnackBarRef) {
      this._snackBar._openedSnackBarRef.afterDismissed().subscribe(
        event => {
          this._snackBar.open(message, action, config);
        })
      return this._snackBar._openedSnackBarRef;
    } else {
      return this._snackBar.open(message, action, config);
    }
  }
}
