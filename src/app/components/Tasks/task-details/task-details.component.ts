import { CommonModule } from '@angular/common';
import { Task } from '@Models/tasks.model';
import { TasksService } from '@Services/tasks.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-task-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterOutlet,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './task-details.component.html',
  styleUrl: './task-details.component.scss',
})
export class TaskDetailsComponent implements OnInit, OnDestroy {
  taskId: string = '';
  mode: number = 0;
  task: Task | undefined = undefined;
  form: FormGroup | undefined;

  constructor(
    private _routes: ActivatedRoute,
    private _tasksService: TasksService,
    private _formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this._routes.params.subscribe(async (params) => {
      this.taskId = params['id'] ?? '';
      this.mode = parseInt(params['mode']) ?? 0;

      console.info({ id: this.taskId, mode: this.mode });
      await this.setTask();

      this.setForm();
    });
  }

  ngOnDestroy(): void {}

  async setTask() {
    const task = await this._tasksService.read(this.taskId);
    if (!task) {
      return;
    }
    this.task = task.pop();
  }

  setForm() {
    this.form = this._formBuilder.group({
      id: [this.task?.id, Validators.required],
      title: [this.task?.title, Validators.required],
      description: [this.task?.description],
      status: [this.task?.statusId, Validators.required],
      startDate: [this.task?.startDate, Validators.required],
      dueDate: [this.task?.dueDate, Validators.required],
    });
  }
}
