import { Component, AfterViewInit, ViewChild } from '@angular/core';

import { MatPaginator, MatSort, MatInput } from '@angular/material';
import { merge, Observable, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';

import { CatalogApiService } from '../catalog-api.service';

@Component({
  selector: 'app-tool-box-sheets',
  templateUrl: './tool-box-sheets.component.html',
  styleUrls: ['./tool-box-sheets.component.sass']
})
export class ToolBoxSheetsComponent implements AfterViewInit {
  displayedColumns: string[] = ["_id", 'test', 'sortTest', "actions"];
  data;

  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatInput, { static: false }) matInput: MatInput;

  constructor(private catalogService: CatalogApiService) { }

  applyFilter(filterValue: string) {
    // Trigger the page changement event
    this.paginator.firstPage();
  }

  ngAfterViewInit() {
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
          this.resultsLength = response[0];

          return response[1];
        }),
        catchError(() => {
          this.isLoadingResults = false;
          // Catch if the GitHub API has reached its rate limit. Return empty data.
          this.isRateLimitReached = true;
          return observableOf([]);
        })
      ).subscribe(data => this.data = data);
  }

}
