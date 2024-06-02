import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Subject, skip, takeUntil } from 'rxjs';
import { Task, TaskStatus } from '@Models/tasks.model';
import { TasksService } from '@Services/tasks.service';
@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss',
})
export class TaskListComponent implements OnInit, OnDestroy {
  private _unsubscribeAll: Subject<any>;

  statusList: Array<TaskStatus> = [];
  taksList: Array<Task> = [];

  constructor(private _taskService: TasksService) {
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    this._taskService.onTasksConstantsGet
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((constants: { statusList: Array<TaskStatus> }) => {
        this.statusList = constants.statusList;
        console.info(this.statusList);
      });

    this._taskService.onTasksLoad
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((tasks: Array<Task>) => {
        this.taksList = tasks;
      });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(undefined);
    this._unsubscribeAll.complete();
  }
}
