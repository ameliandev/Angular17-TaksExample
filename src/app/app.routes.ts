import { DetailsGuard } from '@Guards/details.guard';
import { TasksService } from '@Services/tasks.service';
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('@Components/Auth/login/login.component').then(
        (mod) => mod.LoginComponent
      ),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('@Components/Auth/register/register.component').then(
        (mod) => mod.RegisterComponent
      ),
  },
  {
    path: 'tasks-add',
    loadComponent: () =>
      import('@Components/Tasks/task-form/task-form.component').then(
        (mod) => mod.TaskFormComponent
      ),
  },
  {
    path: 'tasks',
    loadComponent: () =>
      import('@Components/Tasks/task-list/task-list.component').then(
        (mod) => mod.TaskListComponent
      ),
    resolve: {
      task: TasksService,
    },
  },
  {
    path: 'tasks/:mode/:id',
    loadComponent: () =>
      import('@Components/Tasks/task-details/task-details.component').then(
        (mod) => mod.TaskDetailsComponent
      ),
    canActivate: [DetailsGuard],
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
