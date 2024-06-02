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
  },
  {
    path: 'tasks/:id',
    loadComponent: () =>
      import('@Components/Tasks/task-details/task-details.component').then(
        (mod) => mod.TaskDetailsComponent
      ),
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
