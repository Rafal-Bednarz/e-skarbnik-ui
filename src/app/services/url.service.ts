import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UrlService {

  private static _apiUrl: string;
  private static _mainUrl: string;
  public static RESPONSE_IS_LOAD = false;

  constructor() { }

  static getUrl(): string {
    return this._apiUrl;
  }
  static setUrl(value: string): void {
    this._apiUrl = value;
  }
  static getMainUrl(): string {
    return this._mainUrl;
  }
  static setMainUrl(value: string): void {
    this._mainUrl = value;
  }
  static responseIsLoadTrue(): void {
    this.RESPONSE_IS_LOAD = true;
  }
  static responseIsLoadFalse(): void {
    this.RESPONSE_IS_LOAD = false;
  }
}

