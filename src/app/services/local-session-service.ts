import { Injectable } from '@angular/core';

import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class LocalSessionService {

  // TODO GENERATE FROM SERVER
  private static readonly secretPassPhrase: string = 'MysecretScalian';

  constructor(

  ) { }

  private static encode(string) {
    return btoa(btoa(string));
  }

  private static decode(string) {
    return atob(atob(string));
  }

  private static encryptWithSalt(string) {
    return CryptoJS.AES.encrypt(string, LocalSessionService.secretPassPhrase);
  }

  private static decryptWithSalt(string) {
    return CryptoJS.AES.decrypt(string, LocalSessionService.secretPassPhrase).toString(CryptoJS.enc.Utf8);
  }

  public setItem(key: string, data: any) {
    localStorage.setItem(LocalSessionService.encode(key), LocalSessionService.encryptWithSalt(JSON.stringify(data)));
  }

  public getItem(key: string) {
    const data = localStorage.getItem(LocalSessionService.encode(key));
    return (data) ? LocalSessionService.decryptWithSalt(data) : null;
  }

  public removeItem(key: string) {
    localStorage.removeItem(LocalSessionService.encode(key));
  }

  public clear(key: string) {
    localStorage.clear();
  }

}
