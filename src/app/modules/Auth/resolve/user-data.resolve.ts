import {
  ActivatedRouteSnapshot,
  ResolveFn,
  RouterStateSnapshot,
} from '@angular/router';
import { UserDataService } from '../services/user-data.service';
import { inject } from '@angular/core';

export const UserDataResolve: ResolveFn<any> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
  usersFacade: UserDataService = inject(UserDataService)
): Promise<boolean> => {
  return usersFacade.loadAll(route, state);
};
