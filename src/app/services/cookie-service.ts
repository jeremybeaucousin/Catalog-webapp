import { Injectable } from '@angular/core';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CookieService {

  constructor(
  ) { }

  public getCookie(key) {
    var cookie = "";
    if (key) {
      const cookies = document.cookie.split(';');
      cookie = cookies.find(
        element => {
          return element.indexOf(key) > -1;
        }
      )

    }
    return cookie;
  }
}
