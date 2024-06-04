import { TaskGuard } from '@Components/Tasks/guards/task.guard';
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
    path: 'tasks/:mode',
    loadComponent: () =>
      import('@Components/Tasks/task-details/task-details.component').then(
        (mod) => mod.TaskDetailsComponent
      ),
    canActivate: [TaskGuard],
  },
  {
    path: 'tasks/:mode/:id',
    loadComponent: () =>
      import('@Components/Tasks/task-details/task-details.component').then(
        (mod) => mod.TaskDetailsComponent
      ),
    canActivate: [TaskGuard],
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
