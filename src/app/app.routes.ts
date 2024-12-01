import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'task-list',
    pathMatch: 'full',
  },
  {
    path: 'task-list',
    loadComponent: () => import('./task-list/task-list.page').then( m => m.TaskListPage)
  },
];
