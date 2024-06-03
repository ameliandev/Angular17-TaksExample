import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Routes } from '@angular/router';

@Component({
  selector: 'app-task-details',
  standalone: true,
  imports: [],
  templateUrl: './task-details.component.html',
  styleUrl: './task-details.component.scss',
})
export class TaskDetailsComponent implements OnInit, OnDestroy {
  taskId: string = '';

  constructor(private _routes: ActivatedRoute) {}

  ngOnInit(): void {
    this._routes.params.subscribe((params) => {
      this.taskId = params['id'] ?? '';
    });
  }

  ngOnDestroy(): void {}
}
