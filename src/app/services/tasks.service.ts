import { Injectable } from '@angular/core';
import { AppService } from './app.service';
import { HttpClient } from '@angular/common/http';
import { Task, TaskStatus, ITask } from '@Models/tasks.model';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { BehaviorSubject, firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TasksService extends AppService implements Resolve<any> {
  private _tasksStatusList: Array<TaskStatus> = [];
  private _tasksList: Array<Task> = [];

  onTasksLoad: BehaviorSubject<Array<Task>>;
  onTasksConstantsGet: BehaviorSubject<{ statusList: Array<TaskStatus> }>;

  constructor(private _httpClient: HttpClient) {
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

  async read(): Promise<Array<Task>> {
    return new Promise((resolve, reject) => {
      this._httpClient
        .get<Array<Task>>(`${this.GetAPIUrl()}/tasks`)
        .subscribe((tasks) => {
          tasks.map((status: Task) => {
            this._tasksList.push(new Task(status, this._tasksStatusList));
          });
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
          items.map((status: TaskStatus) => {
            this._tasksStatusList.push(new TaskStatus(status));
          });
          resolve(this._tasksStatusList);
        });
    });
  }
  //#endregion
}
