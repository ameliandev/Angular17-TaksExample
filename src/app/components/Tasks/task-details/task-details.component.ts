import { CommonModule } from '@angular/common';
import { Task, TaskStatus } from '@Models/tasks.model';
import { TasksService } from '@Services/tasks.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { provideNativeDateAdapter } from '@angular/material/core';
import {
  FormsModule,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

const today = new Date();
const month = today.getMonth();
const year = today.getFullYear();

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
    MatDatepickerModule,
    MatFormFieldModule,
    MatDividerModule,
    MatSelectModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './task-details.component.html',
  styleUrl: './task-details.component.scss',
})
export class TaskDetailsComponent implements OnInit, OnDestroy {
  taskId: string = '';
  mode: number = 0;
  task: Task | undefined = undefined;
  taskStatusList: Array<TaskStatus> = [];
  form: FormGroup;
  formLoaded: boolean = false;

  constructor(
    private _routes: ActivatedRoute,
    private _tasksService: TasksService,
    private _formBuilder: FormBuilder
  ) {
    this.form = new FormGroup({});
  }

  ngOnInit(): void {
    this._routes.params.subscribe(async (params) => {
      this.taskId = params['id'] ?? '';
      this.mode = parseInt(params['mode']) ?? 0;

      console.info({ id: this.taskId, mode: this.mode });
      await this.setTask();
      this.taskStatusList = await this.getTaskStatus();

      this.setForm();

      this.formLoaded = true;
    });

    this._tasksService.readTaskStatus;
  }

  ngOnDestroy(): void {}

  onSubmit() {
    console.info('SUBMIT');
  }

  async setTask() {
    const task = await this._tasksService.read(this.taskId);
    if (!task) {
      return;
    }
    this.task = task.pop();
  }

  async getTaskStatus(): Promise<Array<TaskStatus>> {
    return await this._tasksService.readTaskStatus();
  }

  setForm() {
    console.info(this.task);

    this.form = this._formBuilder.group({
      id: [this.task?.id, Validators.required],
      title: [this.task?.title, Validators.required],
      description: [this.task?.description],
      status: [this.task?.status, Validators.required],
      startDate: [this.task?.startDate, Validators.required],
      dueDate: [this.task?.dueDate, Validators.required],
    });
  }
}
