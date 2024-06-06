import { Injectable } from '@angular/core';
import { AppService } from '../../../services/app.service';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
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

      const authId = await firstValueFrom(
        this._httpClient.get<UserAuth>(urlId)
      );
      const authPwd = await firstValueFrom(
        this._httpClient.get<UserAuth>(urlPassword)
      );

      if (
        !authId ||
        (Array.isArray(authId) && authId.length === 0) ||
        !authPwd ||
        (Array.isArray(authPwd) && authPwd.length === 0)
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
