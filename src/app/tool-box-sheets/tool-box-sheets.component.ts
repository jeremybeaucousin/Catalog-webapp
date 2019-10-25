import { Component, AfterViewInit, ViewChild, OnInit, Output, EventEmitter } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { MatPaginator, MatSort, MatTableDataSource, MatDialog } from '@angular/material';
import { trigger, state, style, transition, animate } from '@angular/animations';

import { merge, of as observableOf, Observable } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';

import { CatalogApiService } from '../services/catalog-api.service';

import { ToolBoxSheet } from '../models/tool-box-sheet';
import { DialogAppComponent } from '../commons/dialog-app.component';
import { SnackBarAppService } from '../services/snack-bar-app.services';
import { MatPaginatorTranslator } from '../models/mat-paginator-translator';
import { TranslationKeysConstants } from '../models/translation-keys.constants';
import { AuthenticationService } from '../services/authentication-service';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-tool-box-sheets',
  templateUrl: './tool-box-sheets.component.html',
  styleUrls: ['./tool-box-sheets.component.sass'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ToolBoxSheetsComponent implements AfterViewInit, OnInit {
  displayedColumns: string[] = ['title', 'description', "actions"];
  dataSource: MatTableDataSource<ToolBoxSheet>;

  resultsLength = 0;
  expandedRow;
  observableInputs: Observable<object | any[]>;
  searchForm: FormGroup;
  deleteSheet: EventEmitter<any> = new EventEmitter();

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  constructor(
    private catalogService: CatalogApiService,
    private _snackBar: SnackBarAppService,
    public dialog: MatDialog,
    private translate: TranslateService,
    private authenticationService: AuthenticationService,
    private formBuilder: FormBuilder,
  ) {
  }

  ngOnInit() {
    this.searchForm = this.formBuilder.group({
      search: [''],
    });

    this.dataSource = new MatTableDataSource([]);
  }

  ngAfterViewInit() {
    this.paginator._intl = new MatPaginatorTranslator(this.translate);
    // If the user changes the sort order or the filter, reset back to the first page.
    merge(this.sort.sortChange, this.searchForm.valueChanges).subscribe(
      () => {
        this.paginator.pageIndex = 0;
      });
    this.observableInputs = merge(this.sort.sortChange, this.paginator.page, this.searchForm.valueChanges, this.deleteSheet)
      .pipe(
        startWith({}),
        switchMap(() => {
          const offset = (this.paginator.pageIndex * this.paginator.pageSize);
          const limit = this.paginator.pageSize;
          const wordSequence = (this.searchForm.value) ? this.searchForm.value.search : "";
          return this.catalogService.getToolBoxSheets(offset, limit, this.sort.active, this.sort.direction, wordSequence);
        }),
        map((response) => {
          // Total count
          this.resultsLength = response[0];
          // data
          return response[1];
        }),
        catchError(() => {
          return observableOf([]);
        })
      );

    this.observableInputs.subscribe(data => {
      this.dataSource.data = data as Array<ToolBoxSheet>;
    })
  }

  hasAdminPermission() {
    return this.authenticationService.hasAdminPermission();
  }

  hasUserPermission() {
    return this.authenticationService.hasUserPermission();
  }


  delete(_id: string) {
    const dialogRef = this.dialog.open(DialogAppComponent, {
      width: '400px',
      data: {
        title: this.translate.instant(TranslationKeysConstants.MODAL_CONFIRMATION_TITLE),
        cancelLabel: this.translate.instant(TranslationKeysConstants.NO),
        confirmationLabel: this.translate.instant(TranslationKeysConstants.YES),
        message: this.translate.instant(TranslationKeysConstants.MODAL_CONFIRMATION_MESSAGE)
      }
    });

    dialogRef.afterClosed().subscribe(validate => {
      if (validate) {
        this.catalogService.deleteToolBoxSheets(_id).subscribe(
          result => {
            // Timeout of 1 second because get data before delete is too fast and get the old values
            setTimeout(() => {
              this.deleteSheet.emit();
              const message = this.translate.instant(TranslationKeysConstants.ITEM_DELETED);
              const close = this.translate.instant(TranslationKeysConstants.CLOSE);
              this._snackBar.open(message, close, {
                // In seconds
                duration: 3 * 1000,
              });
            }, 1000);
          }
        );
      }
    });
  }
}
