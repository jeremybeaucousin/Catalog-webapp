import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { MatPaginator, MatSort, MatInput, MatTableDataSource, MatDialog } from '@angular/material';
import { trigger, state, style, transition, animate } from '@angular/animations';

import { merge, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';

import { CatalogApiService } from '../services/catalog-api.service';

import { ToolBoxSheet } from '../models/tool-box-sheet';
import { DialogAppComponent } from '../commons/dialog-app.component';
import { SnackBarAppService } from '../services/snack-bar-app.services';
import { MatPaginatorTranslator } from '../models/mat-paginator-translator';
import { TranslationKeysConstants } from '../models/translation-keys.constants';

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
export class ToolBoxSheetsComponent implements AfterViewInit {
  displayedColumns: string[] = ['title', 'description', "actions"];
  dataSource: MatTableDataSource<ToolBoxSheet>;

  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;
  expandedRow;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatInput, { static: false }) matInput: MatInput;

  constructor(
    private catalogService: CatalogApiService,
    private _snackBar: SnackBarAppService,
    public dialog: MatDialog,
    private translate: TranslateService) {
  }

  ngAfterViewInit() {
    this.paginator._intl = new MatPaginatorTranslator(this.translate);
    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    merge(this.sort.sortChange, this.paginator.page, this.matInput.stateChanges)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          const offset = (this.paginator.pageIndex * this.paginator.pageSize);
          const limit = this.paginator.pageSize;
          const wordSequence = this.matInput.value;
          return this.catalogService.getToolBoxSheets(offset, limit, this.sort.active, this.sort.direction, wordSequence);
        }),
        map((response) => {
          // Flip flag to show that loading has finished.
          this.isLoadingResults = false;
          this.isRateLimitReached = false;
          // Total count
          this.resultsLength = response[0];
          // data
          return response[1];
        }),
        catchError(() => {
          this.isLoadingResults = false;
          // Catch if the GitHub API has reached its rate limit. Return empty data.
          this.isRateLimitReached = true;
          return observableOf([]);
        })
      ).subscribe(data => {
        var datasource = new MatTableDataSource(data as Array<ToolBoxSheet>);
        this.dataSource = datasource;
      });
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
            var data = this.dataSource.data;
            // Supress deleted element
            var suppressesIndex = data.findIndex(function (element: any) {
              return element._id == _id;
            });
            data.splice(suppressesIndex, 1);
            this.paginator.length = (this.paginator.length - 1);
            // Reload change
            this.dataSource._updateChangeSubscription();
            const message = this.translate.instant(TranslationKeysConstants.ITEM_DELETED);
            const close = this.translate.instant(TranslationKeysConstants.CLOSE);
            this._snackBar.open(message, close, {
              // In seconds
              duration: 3 * 1000,
            });
          }
        );
      }
    });
  }
}
