import { Injectable, inject } from '@angular/core';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  CanActivateFn,
  Params,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { Guid } from '@Utils/Guid';

@Injectable({
  providedIn: 'root',
})
class PermissionsService {
  constructor(private router: Router, private _actRoute: ActivatedRoute) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const access = this.canAccess(next.params);

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
  canAccess(params: Params): boolean {
    const taskId = params['id'] ?? undefined;
    const mode = params['mode'] ?? undefined;

    return Guid.isValid(taskId) && !isNaN(mode);
  }
}

export const DetailsGuard: CanActivateFn = (
  next: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): boolean => {
  return inject(PermissionsService).canActivate(next, state);
};
