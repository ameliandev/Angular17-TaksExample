import { TaskGuard } from '@Modules/Tasks/guards/task.guard';
import { TasksService } from '@Modules/Tasks/services/tasks.service';
import { UserDataResolve } from '@Modules/Auth/resolve/user-data.resolve';
import { Routes } from '@angular/router';
import { AuthGuard } from '@Modules/Auth/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('@Modules/Auth/components/login/login.component').then(
        (mod) => mod.LoginComponent
      ),
    resolve: {
      Users: UserDataResolve,
    },
  },
  {
    path: 'register',
    loadComponent: () =>
      import('@Modules/Auth/components/register/register.component').then(
        (mod) => mod.RegisterComponent
      ),
  },
  {
    path: 'tasks',
    loadComponent: () =>
      import('@Modules/Tasks/components/task-list/task-list.component').then(
        (mod) => mod.TaskListComponent
      ),
    resolve: {
      task: TasksService,
    },
    canActivate: [AuthGuard],
  },
  {
    path: 'tasks/:mode',
    loadComponent: () =>
      import(
        '@Modules/Tasks/components/task-details/task-details.component'
      ).then((mod) => mod.TaskDetailsComponent),
    canActivate: [AuthGuard, TaskGuard],
  },
  {
    path: 'tasks/:mode/:id',
    loadComponent: () =>
      import(
        '@Modules/Tasks/components/task-details/task-details.component'
      ).then((mod) => mod.TaskDetailsComponent),
    canActivate: [AuthGuard, TaskGuard],
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
