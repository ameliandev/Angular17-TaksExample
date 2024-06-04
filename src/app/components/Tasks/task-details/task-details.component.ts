import { CommonModule } from '@angular/common';
import { Task, TaskStatus } from '@Models/tasks.model';
import { TasksService } from '@Services/tasks.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterOutlet,
  Routes,
} from '@angular/router';
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
  FormControl,
} from '@angular/forms';
import { TaskDetailsMode } from 'app/enums/app.enums';

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
  mode: TaskDetailsMode = 0;
  task: Task | undefined = undefined;
  taskStatusList: Array<TaskStatus>;
  form: FormGroup;
  formLoaded: boolean = false;

  constructor(
    private _router: Router,
    private _activeRoute: ActivatedRoute,
    private _tasksService: TasksService,
    private _formBuilder: FormBuilder
  ) {
    this.form = new FormGroup({});
    this.taskStatusList = [];
  }

  ngOnInit(): void {
    this._activeRoute.params.subscribe(async (params) => {
      this.taskId = params['id'] ?? '';
      this.mode = parseInt(params['mode']) ?? 0;

      await this.setTask();
      this.taskStatusList = [...(await this.getTaskStatus())];

      this.setForm();

      this.formLoaded = true;
    });

    this._tasksService.readTaskStatus;
  }

  ngOnDestroy(): void {}

  async onSubmit() {
    const submitAction = [
      {
        mode: TaskDetailsMode.Edit,
        action: async () => {
          const response = await this._tasksService.update(
            this.form.getRawValue()
          );
          this._router.navigate(['tasks']);
        },
      },
      {
        mode: TaskDetailsMode.Read,
        action: async () => {
          this._router.navigate(['tasks']);
        },
      },
      {
        mode: TaskDetailsMode.New,
        action: async () => {
          const response = await this._tasksService.create(
            this.form.getRawValue()
          );
          this._router.navigate(['tasks']);
        },
      },
    ];

    submitAction.find((action) => action.mode === this.mode)?.action();
  }

  onCancel() {
    this._router.navigate(['tasks']);
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
      id: new FormControl(
        {
          value: this.task?.id,
          disabled: this.mode === TaskDetailsMode.Read,
        },
        Validators.required
      ),
      title: new FormControl(
        {
          value: this.task?.title,
          disabled: this.mode === TaskDetailsMode.Read,
        },
        Validators.required
      ),
      description: new FormControl({
        value: this.task?.description,
        disabled: this.mode === TaskDetailsMode.Read,
      }),
      status: new FormControl(
        {
          value: this.task?.status,
          disabled: this.mode === TaskDetailsMode.Read,
        },
        Validators.required
      ),
      startDate: new FormControl(
        {
          value: this.task?.startDate,
          disabled: this.mode === TaskDetailsMode.Read,
        },
        Validators.required
      ),
      dueDate: new FormControl(
        {
          value: this.task?.dueDate,
          disabled: this.mode === TaskDetailsMode.Read,
        },
        Validators.required
      ),
      author: new FormControl(this.task?.author, Validators.required),
    });
  }
}
