import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpParameterCodec } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from './../environments/environment';

// Override default encoding to handle '+' and '-'
class CustomEncoder implements HttpParameterCodec {
  encodeKey(key: string): string {
    return encodeURIComponent(key);
  }

  encodeValue(value: string): string {
    return encodeURIComponent(value);
  }

  decodeKey(key: string): string {
    return decodeURIComponent(key);
  }

  decodeValue(value: string): string {
    return decodeURIComponent(value);
  }
}

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


  public getToolBoxSheets(
    offset: number,
    limit: number,
    sortField: string,
    sortDirection: string,
    wordSequence: string): Observable<[number, object]> {
    var params = new HttpParams({ encoder: new CustomEncoder() });
    if (offset) {
      params = params.append(CatalogApiService.queryParameters.offset, offset.toString());
    }

    if (limit) {
      params = params.append(CatalogApiService.queryParameters.limit, limit.toString());
    }

    if (sortField && sortDirection) {
      const sortValue = sortField + ((sortDirection == "desc") ? "-" : "+");
      params = params.append(CatalogApiService.queryParameters.sort, sortValue);
    }

    if (wordSequence) {
      params = params.append(CatalogApiService.queryParameters.wordSequence, wordSequence);
    }

    return this.http.get(CatalogApiService.getToolBoxSheetsUri(), { params: params, observe: 'response' }).pipe(
      map(response => {
        if (response.status == 200) {
          const totalCount = Number(response.headers.get(CatalogApiService.responseHeaders.totalCount));

          var data: Array<ToolBoxSheet> = [];
          var body = response.body as Array<any>;
          if (body) {
            body.forEach(element => {
              var toolBoxSheet = element._source;
              toolBoxSheet._id = element._id;
              data.push(toolBoxSheet);
            });
          }
          return [totalCount, data];
        } else {
          console.error(response.body);
          return [0, []];
        }
      }))
  }

  public getToolBoxSheetById(_id: string): Observable<any> {
    return this.http.get(`${CatalogApiService.getToolBoxSheetsUri()}/${_id}`);
  }

  public addToolBoxSheet(data): Observable<any> {
    return this.http.post(CatalogApiService.getToolBoxSheetsUri(), data);
  }

  public editToolBoxSheet(_id, data): Observable<any> {
    return this.http.put(`${CatalogApiService.getToolBoxSheetsUri()}/${_id}`, data);
  }

  public deleteToolBoxSheets(_id: string) {
    return this.http.delete(`${CatalogApiService.getToolBoxSheetsUri()}/${_id}`);
  }
}
