import { Injectable } from '@angular/core';
import { AppService } from '../../../services/app.service';
import { HttpClient } from '@angular/common/http';
import { Task, TaskStatus, ITask } from '@Modules/Tasks/models/tasks.model';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { UserDataService } from '@Modules/Auth/services/user-data.service';
import { UserType } from '@Modules/Auth/enums/user.enums';

@Injectable({
  providedIn: 'root',
})
export class TasksService extends AppService implements Resolve<any> {
  private _tasksStatusList: Array<TaskStatus> = [];
  private _tasksList: Array<Task> = [];

  onTasksLoad: BehaviorSubject<Array<Task>>;
  onTasksConstantsGet: BehaviorSubject<{ statusList: Array<TaskStatus> }>;

  constructor(
    private _httpClient: HttpClient,
    private _userData: UserDataService
  ) {
    super(_httpClient, 'tasks');

    this.onTasksLoad = new BehaviorSubject<Array<Task>>([]);
    this.onTasksConstantsGet = new BehaviorSubject<{
      statusList: Array<TaskStatus>;
    }>({ statusList: [] });
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.loadAll();
  }

  async loadAll(): Promise<boolean> {
    this._tasksList = [];

    return new Promise<boolean>((resolve, reject) => {
      Promise.all([this.readTaskStatus()])
        .then(async ([taskStatus]) => {
          this.onTasksConstantsGet.next({ statusList: taskStatus });
          const tasks = await this.read();
          this.onTasksLoad.next(tasks);

          resolve(true);
        })
        .catch((error) => {
          console.error(`Error on Tasks service: ${error.message}`);
          reject();
        });
    });
  }

  //#region CRUD
  async create(task: ITask): Promise<Task> {
    try {
      const response = await firstValueFrom(
        this._httpClient.post<Task>(`${this.GetAPIUrl()}/tasks`, task)
      );
      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async read(id?: string): Promise<Array<Task>> {
    this._tasksList = [];

    const url = (() => {
      switch (Number(this._userData.Data?.type)) {
        case UserType.Admin:
          return `${this.GetAPIUrl()}/tasks${id ? `?id=${id}` : ''}`;
        case UserType.Basic:
          return `${this.GetAPIUrl()}/tasks?author=${
            this._userData.Data?.id ?? ''
          }${id ? `&id=${id}` : ''}`;
        default:
          throw new Error('Impossible to generate Tasks url');
      }
    })();

    console.info('URL', url);
    return new Promise((resolve, reject) => {
      this._httpClient.get<Array<Task>>(url).subscribe((tasks) => {
        if (Array.isArray(tasks)) {
          tasks.map((status: Task) => {
            this._tasksList.push(new Task(status, this._tasksStatusList));
          });
        } else {
          this._tasksList.push(tasks);
        }

        resolve(this._tasksList);
      });
    });
  }

  async update(task: ITask): Promise<boolean> {
    try {
      await firstValueFrom(
        this._httpClient.put<boolean>(
          `${this.GetAPIUrl()}/tasks/${task.id}`,
          task
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
        this._httpClient.delete<boolean>(`${this.GetAPIUrl()}/tasks/${id}`)
      );
      return true;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  //#endregion

  //#region EXTRA
  readTaskStatus(): Promise<Array<TaskStatus>> {
    return new Promise((resolve, reject) => {
      this._httpClient
        .get<Array<TaskStatus>>(`${this.GetAPIUrl()}/taskStatus`)
        .subscribe((items) => {
          this._tasksStatusList = [];
          items.map((status: TaskStatus) => {
            this._tasksStatusList.push(new TaskStatus(status));
          });
          resolve(this._tasksStatusList);
        });
    });
  }
  //#endregion
}
