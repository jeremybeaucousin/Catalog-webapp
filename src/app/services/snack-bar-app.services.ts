import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';


@Injectable({
  providedIn: 'root'
})
export class SnackBarAppService {
  constructor(private _snackBar: MatSnackBar) { }

  public open(message: string, action?: string, config?: MatSnackBarConfig) {
    if (this._snackBar._openedSnackBarRef) {
      this._snackBar._openedSnackBarRef.afterDismissed().subscribe(
        event => {
          this._snackBar.open(message, action, config);
        })
    } else {
      this._snackBar.open(message, action, config);
    }
  }

}
