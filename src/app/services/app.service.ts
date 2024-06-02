import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Inject } from '@angular/core';
import { environment } from 'environments';

@Inject({
  providedIn: 'root',
})
export class AppService {
  private _http: HttpClient | undefined;
  private _headers: HttpHeaders | undefined;
  private _params: HttpParams | undefined;
  private _controller: string | undefined;

  constructor(http: HttpClient, controller: string) {
    this._http = http;
  }

  /**
   * Gets the API url based on environment
   * @returns the URN API as string
   */
  public GetAPIUrl(): string {
    return environment.apiUrl;
  }
}
