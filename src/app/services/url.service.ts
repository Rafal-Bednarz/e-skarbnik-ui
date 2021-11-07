import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UrlService {

  private static _api: string;
  private static _mainUrl: string;

  constructor() { }

  static getApi(): string {
    return this._api;
  }
  static setApi(value: string): void {
    this._api = value;
  }
  static getMainUrl(): string {
    return this._mainUrl;
  }
  static setMainUrl(value: string): void {
    this._mainUrl = value;
  }
}

