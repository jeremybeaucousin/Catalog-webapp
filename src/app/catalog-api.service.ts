import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from './../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CatalogApiService {
  static toolBoxRoute = "toolboxes";

  constructor(private http: HttpClient) { }

  private static getToolBoxSheetsUri() {
    return `${environment.catalogApiEndploint}${CatalogApiService.toolBoxRoute}`;
  }

  public getToolBoxSheets() {
    return this.http.get(CatalogApiService.getToolBoxSheetsUri());
  }
}
