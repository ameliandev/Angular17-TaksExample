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
      const url = `${this.GetAPIUrl()}/${
        this.Controller
      }?id=${email}&password=${password}`;

      const auth = await firstValueFrom(this._httpClient.get<UserAuth>(url));

      if (!auth || (Array.isArray(auth) && auth.length === 0)) {
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
