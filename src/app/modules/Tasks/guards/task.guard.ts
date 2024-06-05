import { Injectable, inject } from '@angular/core';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  CanActivateFn,
  Params,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { UserDataService } from '@Modules/Auth/services/user-data.service';
import { Guid } from '@Utils/Guid';
import { TasksService } from '../services/tasks.service';
import { DetailsMode } from '../enums/task.enums';

@Injectable({
  providedIn: 'root',
})
class PermissionsService {
  constructor(
    private router: Router,
    private _actRoute: ActivatedRoute,
    private _userData: UserDataService,
    private _taskService: TasksService
  ) {}

  async canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    const access = await this.canAccess(next.params);

    if (!access) {
      this.router.navigate(['tasks']);
    }

    return access;
  }

  /**
   * Check if the route params exists and are valid.
   * @param params
   * @returns
   */
  async canAccess(params: Params): Promise<boolean> {
    const taskId = params['id'] ?? undefined;
    const mode = params['mode'] ?? undefined;
    let canModify = true;

    if (mode == DetailsMode.Edit && taskId && Guid.isValid(taskId)) {
      canModify = await this.validateModify(taskId);
    }

    return canModify && ((taskId && Guid.isValid(taskId)) || !isNaN(mode));
  }

  async validateModify(taskId: string): Promise<boolean> {
    const task = (await this._taskService.read(taskId)).pop();
    return (task && task?.author === this._userData.Data?.id) || false;
  }
}

export const TaskGuard: CanActivateFn = (
  next: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Promise<boolean> => {
  return inject(PermissionsService).canActivate(next, state);
};
