import {
  Component,
  OnDestroy,
  OnInit,
  Signal,
  computed,
  effect,
  signal,
  WritableSignal,
} from '@angular/core';
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterOutlet,
} from '@angular/router';
import { CommonModule } from '@angular/common';
import { Task, TaskStatus } from '@Modules/Tasks/models/tasks.model';
import { TasksService } from '@Modules/Tasks/services/tasks.service';
import * as Enums from '../../enums/task.enums';

import { provideNativeDateAdapter } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import {
  FormsModule,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  FormControl,
} from '@angular/forms';
import { Guid } from '@Utils/Guid';
import { Subject, takeUntil } from 'rxjs';
import { UserDataService } from '@Modules/Auth/services/user-data.service';

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
  private _unsubscribeAll: Subject<any>;

  taskId: string = '';
  mode: Enums.DetailsMode = 0;
  task: Task | undefined;
  taskStatusList: Array<TaskStatus> = [];
  form: FormGroup;
  formLoaded: boolean = false;
  statusSignal: WritableSignal<number | undefined> = signal<number | undefined>(
    undefined
  );

  constructor(
    private _router: Router,
    private _activeRoute: ActivatedRoute,
    private _tasksService: TasksService,
    private _formBuilder: FormBuilder,
    private _userDataService: UserDataService
  ) {
    this._unsubscribeAll = new Subject();
    this.form = new FormGroup({});
    this.task = undefined;

    effect(() => {
      this.effectOnStatus();
    });
  }

  /**
   * Signal : Evaluate if the dates controls must be enable or disabled (depending of Status field)
   */
  effectOnStatus() {
    const selectedStatus = this.statusSignal();
    if (selectedStatus == Enums.Status.Done) {
      this.form.get('startDate')?.disable();
      this.form.get('dueDate')?.disable();
    } else {
      this.form.get('startDate')?.enable();
      this.form.get('dueDate')?.enable();
    }
  }

  //#region ANGULAR EVENTS

  ngOnInit(): void {
    this._activeRoute.params
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(async (params) => {
        try {
          this.taskId = params['id'] ?? undefined;
          this.mode = parseInt(params['mode']) ?? 0;
          await this.setData();
          this.formLoaded = true;
        } catch (error) {
          this.formLoaded = false;
        }
      });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(undefined);
    this._unsubscribeAll.complete();
  }

  //#endregion

  //#region FORM EVENTS

  /**
   * Submit form event. Update or create Task.
   * Go back to the tasks component
   */
  async onSubmit() {
    const submitAction = [
      {
        mode: Enums.DetailsMode.Edit,
        action: async () => {
          await this._tasksService.update(this.form.getRawValue());
          this._router.navigate(['tasks']);
        },
      },
      {
        mode: Enums.DetailsMode.Read,
        action: async () => {
          this._router.navigate(['tasks']);
        },
      },
      {
        mode: Enums.DetailsMode.New,
        action: async () => {
          await this._tasksService.create(this.form.getRawValue());
          this._router.navigate(['tasks']);
        },
      },
    ];

    submitAction.find((action) => action.mode === this.mode)?.action();
  }

  /**
   * Cancel form event.
   * Go back to the tasks component
   */
  onCancel() {
    this._router.navigate(['tasks']);
  }

  //#endregion

  //#region GET

  /**
   * If taskId Param exists, load to display it.
   * @returns
   */
  async getTask() {
    if (!this.taskId) {
      return;
    }

    const task = await this._tasksService.read(this.taskId);

    if (!task) {
      return;
    }

    this.task = task.pop();
  }

  /**
   * Get the list of Tasks status
   * @returns {Promise<Array<TaskStatus>>} An array of TaskStatus
   */
  async getTaskStatus(): Promise<Array<TaskStatus>> {
    return await this._tasksService.readTaskStatus();
  }
  //#endregion

  //#region SET

  /**
   * Set all required data to the at form
   */
  async setData() {
    await this.getTask();
    this.taskStatusList = [...(await this.getTaskStatus())];

    this.setForm();
  }

  /**
   * Set the FormGroup properties
   */
  setForm() {
    this.form = this._formBuilder.group({
      id: new FormControl(
        {
          value: this.task?.id ?? Guid.newGuid(),
          disabled: this.mode === Enums.DetailsMode.Read,
        },
        Validators.required
      ),
      title: new FormControl(
        {
          value: this.task?.title ?? '',
          disabled: this.mode === Enums.DetailsMode.Read,
        },
        Validators.required
      ),
      description: new FormControl({
        value: this.task?.description ?? '',
        disabled: this.mode === Enums.DetailsMode.Read,
      }),
      status: new FormControl(
        {
          value: this.task?.status.toString() ?? '',
          disabled: this.mode === Enums.DetailsMode.Read,
        },
        Validators.required
      ),
      startDate: new FormControl(
        {
          value: this.task?.startDate ?? '',
          disabled:
            this.mode === Enums.DetailsMode.Read ||
            this.task?.status === Enums.Status.Done,
        },
        Validators.required
      ),
      dueDate: new FormControl(
        {
          value: this.task?.dueDate ?? '',
          disabled:
            this.mode === Enums.DetailsMode.Read ||
            this.task?.status === Enums.Status.Done,
        },
        Validators.required
      ),
      author: new FormControl(
        this.task?.author ?? this._userDataService.Data?.id,
        Validators.required
      ),
    });

    this.statusSignal.set(this.task?.status);

    this.form.get('status')?.valueChanges.subscribe((value) => {
      this.statusSignal.set(value);
    });
  }
  //#endregion
}
