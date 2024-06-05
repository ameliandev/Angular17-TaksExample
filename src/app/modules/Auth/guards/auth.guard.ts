import { Injectable, inject } from '@angular/core';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { UserDataService } from '../services/user-data.service';

@Injectable({
  providedIn: 'root',
})
class AuthorizationService {
  constructor(
    private router: Router,
    private _actRoute: ActivatedRoute,
    private _userData: UserDataService
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const access = this.canAccess();

    if (!access) {
      this.router.navigate(['login']);
    }

    return access;
  }

  /**
   * Check if the user data exists.
   * @returns
   */
  canAccess(): boolean {
    return this._userData.Data !== undefined;
  }
}

export const AuthGuard: CanActivateFn = (
  next: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): boolean => {
  return inject(AuthorizationService).canActivate(next, state);
};
