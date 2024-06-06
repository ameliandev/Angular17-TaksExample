import { Injectable } from '@angular/core';
import { AppService } from '../../../services/app.service';
import { HttpClient } from '@angular/common/http';
import {
  IUserData,
  UserData,
  UserStatus,
  UserType,
} from '@Modules/Auth/models/user-data.model';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import * as Enums from '../enums/user.enums';
@Injectable({
  providedIn: 'root',
})
export class UserDataService extends AppService {
  private _userStatusList: Array<UserStatus> = [];
  private _userTypeList: Array<UserStatus> = [];
  private _usersList: Array<UserData> = [];
  private _data: UserData | undefined = undefined;

  onUserDataSet: BehaviorSubject<any>;
  onUsersLoad: BehaviorSubject<Array<UserData>>;
  onUsersConstantsGet: BehaviorSubject<{
    statusList: Array<UserStatus>;
    typeList: Array<UserStatus>;
  }>;

  constructor(private _httpClient: HttpClient, private router: Router) {
    super(_httpClient, 'userData');

    this.onUserDataSet = new BehaviorSubject<any>(undefined);
    this.onUsersLoad = new BehaviorSubject<Array<UserData>>([]);
    this.onUsersConstantsGet = new BehaviorSubject<{
      statusList: Array<UserStatus>;
      typeList: Array<UserStatus>;
    }>({ statusList: [], typeList: [] });
  }

  //#region GET/SETS
  public get Data(): UserData | undefined {
    let data = this._data;

    try {
      if (!data) {
        const lsData = localStorage.getItem('userData') ?? '';
        data = JSON.parse(lsData);
      }

      this._data = data ?? undefined;
    } catch (error) {
      this.router.navigate(['login']);
    }

    this.onUserDataSet.next(this._data);

    return this._data;
  }

  public set Data(userData: UserData | undefined) {
    this._data = userData;
    localStorage.setItem('userData', JSON.stringify(this._data));
  }

  public get Users(): Array<UserData> {
    let users = this._usersList;

    return users;
  }

  //#endregion

  async loadAll(
    route?: ActivatedRouteSnapshot,
    state?: RouterStateSnapshot
  ): Promise<boolean> {
    this._usersList = [];

    return new Promise<boolean>((resolve, reject) => {
      Promise.all([this.readUserStatus(), this.readUserTypes()])
        .then(async ([taskStatus, typeStatus]) => {
          this.onUsersConstantsGet.next({
            statusList: taskStatus,
            typeList: typeStatus,
          });

          await this.read();

          resolve(true);
        })
        .catch((error) => {
          console.error(`Error on User service: ${error.message}`);
          reject();
        });
    });
  }

  //#region CRUD
  async create(task: IUserData): Promise<UserData> {
    try {
      const response = await firstValueFrom(
        this._httpClient.post<UserData>(
          `${this.GetAPIUrl()}/${this.Controller}`,
          task
        )
      );
      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async read(id?: string): Promise<Array<UserData>> {
    if (this._data && Number(this._data?.type) !== Enums.UserType.Admin) {
      return [];
    }

    this._usersList = [];

    return new Promise((resolve, reject) => {
      this._httpClient
        .get<Array<UserData>>(
          `${this.GetAPIUrl()}/${this.Controller}/${id ?? ''}`
        )
        .subscribe((users) => {
          if (Array.isArray(users)) {
            users.map((user: UserData) => {
              this._usersList.push(
                new UserData(user, this._userStatusList, this._userTypeList)
              );
            });
          } else {
            this._usersList.push(users);
          }

          resolve(this._usersList);
        });
    });
  }

  async update(user: IUserData): Promise<boolean> {
    try {
      await firstValueFrom(
        this._httpClient.put<boolean>(
          `${this.GetAPIUrl()}/${this.Controller}/${user.id}`,
          user
        )
      );
      return true;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await firstValueFrom(
        this._httpClient.delete<boolean>(
          `${this.GetAPIUrl()}/${this.Controller}/${id}`
        )
      );
      return true;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  //#endregion

  //#region EXTRA
  readUserStatus(): Promise<Array<UserStatus>> {
    return new Promise((resolve, reject) => {
      this._httpClient
        .get<Array<UserStatus>>(`${this.GetAPIUrl()}/userStatus`)
        .subscribe((items) => {
          this._userStatusList = [];
          items.map((status: UserStatus) => {
            this._userStatusList.push(new UserStatus(status));
          });
          resolve(this._userStatusList);
        });
    });
  }

  readUserTypes(): Promise<Array<UserStatus>> {
    return new Promise((resolve, reject) => {
      this._httpClient
        .get<Array<UserStatus>>(`${this.GetAPIUrl()}/userType`)
        .subscribe((types) => {
          this._userTypeList = [];
          types.map((type: UserType) => {
            this._userTypeList.push(new UserType(type));
          });
          resolve(this._userTypeList);
        });
    });
  }
  //#endregion
}
