import { Injectable } from '@angular/core';
import { AppService } from '../../../services/app.service';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, forkJoin } from 'rxjs';
import { UserAuth } from '@Modules/Auth/models/user-auth.model';
import { UserDataService } from '@Modules/Auth/services/user-data.service';

@Injectable({
  providedIn: 'root',
})
export class UserAuthService extends AppService {
  constructor(
    private _httpClient: HttpClient,
    private _userData: UserDataService
  ) {
    super(_httpClient, 'userAuth');
  }

  async Login(email: string, password: string): Promise<boolean> {
    try {
      // The request must be divided because json-server doens't allow AND operators, only OR
      const urlId = `${this.GetAPIUrl()}/${this.Controller}?id=${email}`;
      const urlPassword = `${this.GetAPIUrl()}/${
        this.Controller
      }?password=${password}`;

      const combinedLoginRequest = forkJoin({
        authId: this._httpClient.get<UserAuth>(urlId),
        authPassword: this._httpClient.get<UserAuth>(urlPassword),
      });

      const result = await firstValueFrom(combinedLoginRequest);

      if (
        !result.authId ||
        (Array.isArray(result.authId) && result.authId.length === 0) ||
        !result.authPassword ||
        (Array.isArray(result.authPassword) && result.authPassword.length === 0)
      ) {
        return false;
      }

      return true;
    } catch (error) {
      return false;
    }
  }

  Logout(): boolean {
    this._userData.Data = undefined;
    localStorage.clear();
    return true;
  }
}
