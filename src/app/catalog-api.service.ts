import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from './../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CatalogApiService {
  static toolBoxRoute = "toolboxes";

  static responseHeaders = {
    totalCount: "X-Total-Count"
  }

  static queryParameters = {
    wordSequence: "wordSequence",
    offset: "offset",
    limit: "limit",
    sort: "sort"
  }

  constructor(private http: HttpClient) { }

  private static getToolBoxSheetsUri() {
    return `${environment.catalogApiEndploint}${CatalogApiService.toolBoxRoute}`;
  }


  public getToolBoxSheets(offset: number, limit: number): Observable<[number, object]> {
    var params = new HttpParams();
    if (offset) {
      console.log(offset);
      params = params.append(CatalogApiService.queryParameters.offset, offset.toString());
    }

    if (limit) {
      console.log(limit);
      params = params.append(CatalogApiService.queryParameters.limit, limit.toString());
    }
    console.log(params.keys());
    // queryString.concat(`${CatalogApiService.queryParameters.offset}=${offset.toString()}`);
    return this.http.get(CatalogApiService.getToolBoxSheetsUri(), { params: params, observe: 'response' }).pipe(
      map(response => {
        const totalCount = Number(response.headers.get(CatalogApiService.responseHeaders.totalCount));
        return [totalCount, response.body];
      }))
  }
}
