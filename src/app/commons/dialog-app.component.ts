import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';


export interface DialogData {
    title: '';
    cancelLabel: '';
    confirmationLabel: '';
    message: '';
}


@Component({
    selector: 'dialog-app',
    templateUrl: 'dialog-app.component.html',
})
export class DialogAppComponent {
    constructor(
        public dialogRef: MatDialogRef<DialogAppComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

    onNoClick(): void {
        this.dialogRef.close();
    }
}