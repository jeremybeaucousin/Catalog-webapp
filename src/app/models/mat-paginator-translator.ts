import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { MatPaginatorIntl } from '@angular/material';


@Injectable()
export class MatPaginatorTranslator extends MatPaginatorIntl {

  constructor(private translate: TranslateService) {
    super();

    translate.get('ITEMS_PER_PAGE_LABEL').subscribe((res: string) => {
      this.itemsPerPageLabel = res;
    });

    translate.get('NEXT_PAGE_LABEL').subscribe((res: string) => {
      this.nextPageLabel = res;
    });

    translate.get('PREVIOUS_PAGE_LABEL').subscribe((res: string) => {
      this.previousPageLabel = res;
    });

    translate.get('FIRST_PAGE_LABEL').subscribe((res: string) => {
      this.firstPageLabel = res;
    });

    translate.get('LAST_PAGE_LABEL').subscribe((res: string) => {
      this.lastPageLabel = res;
    });
  }

  getRangeLabel = (page: number, pageSize: number, length: number): string => {
    if (length === 0 || pageSize === 0) {
      return this.translate.instant('RANGE_PAGE_LABEL_1', { length });
    }
    length = Math.max(length, 0);
    const startIndex = page * pageSize;
    // If the start index exceeds the list length, do not try and fix the end index to the end.
    const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
    return this.translate.instant('RANGE_PAGE_LABEL_2', { startIndex: startIndex + 1, endIndex, length });
  }
}
