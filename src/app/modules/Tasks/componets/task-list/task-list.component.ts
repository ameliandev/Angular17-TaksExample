import { Component, OnDestroy, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subject, skip, takeUntil } from 'rxjs';
import { Task, TaskStatus } from '@Modules/Tasks/models/tasks.model';
import { TasksService } from '@Modules/Tasks/services/tasks.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatSortModule, Sort } from '@angular/material/sort';
import {
  MatDialog,
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { TruncateLengthPipe } from '@Pipes/truncate-length.pipe';
import { DetailsMode } from '../../enums/task.enums';
import { UserDataService } from '@Modules/Auth/services/user-data.service';
import { UserType } from '@Modules/Auth/enums/user.enums';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';

const TASK_DETAILS_ROUTE = 'tasks';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatSortModule,
    MatDialogModule,
    MatButtonModule,
    MatTooltipModule,
    MatMenuModule,
    MatChipsModule,
    MatCardModule,
    MatProgressBarModule,
    TruncateLengthPipe,
  ],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss',
})
export class TaskListComponent implements OnInit, OnDestroy {
  private _unsubscribeAll: Subject<any>;

  statusList: Array<TaskStatus> = [];
  taksList: Array<Task> = [];
  sourceData: MatTableDataSource<Task>;
  tableColumns: Array<string> = [];
  isLoading: boolean = false;

  constructor(
    private _taskService: TasksService,
    private _dialog: MatDialog,
    private _router: Router,
    private _userData: UserDataService
  ) {
    this._unsubscribeAll = new Subject();
    this.sourceData = new MatTableDataSource<Task>([]);
  }

  //#region ANGULAR EVENTS
  ngOnInit(): void {
    this.isLoading = true;

    this._taskService.onTasksConstantsGet
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((constants: { statusList: Array<TaskStatus> }) => {
        this.statusList = constants.statusList;
      });

    this._taskService.onTasksLoad
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(async (tasks: Array<Task>) => {
        this.taksList = tasks;
        if (this._userData.Users.length === 0) {
          await this._userData.read();
        }
        this.setTableColumns();
        this.sourceData.data = [...this.taksList];
        this.isLoading = false;
      });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(undefined);
    this._unsubscribeAll.complete();
  }
  //#endregion

  //#region COMPONENT EVENTS

  /**
   * Add new task event
   */
  onAddNew() {
    this.isLoading = true;
    this._router.navigate([`${TASK_DETAILS_ROUTE}/${DetailsMode.New}`]);
  }

  /**
   * Event for delete action
   * @param task Selected task
   */
  onDelete(task: Task) {
    let dialogRef = this._dialog.open(DialogOverviewExampleDialog, {
      width: '250px',
      data: { title: task.title, id: task.id },
    });

    dialogRef.afterClosed().subscribe(async (result: boolean) => {
      if (!result) {
        return;
      }

      await this.delete(task.id);
    });
  }

  /**
   * Event for edit action
   * @param task Selected task
   */
  onEdit(task: Task) {
    this.isLoading = true;
    this._router.navigate([
      `${TASK_DETAILS_ROUTE}/${DetailsMode.Edit}/${task.id}`,
    ]);
  }

  onRead(task: Task) {
    this.isLoading = true;
    this._router.navigate([
      `${TASK_DETAILS_ROUTE}/${DetailsMode.Read}/${task.id}`,
    ]);
  }

  onShare(task: Task) {}

  //#endregion

  //#region CRUD

  async test() {
    await this._taskService
      .read('d5872146-1fa8-4f3a-a31a-f4a6b0b17a67')
      .then((response) => {
        console.info(response);
      });
  }

  async delete(id: string) {
    await this._taskService.delete(id).then((response) => {
      this._taskService.loadAll();
    });
  }

  //#endregion

  //#region SET

  setTableColumns() {
    switch (Number(this._userData.Data?.type)) {
      case UserType.Admin:
        this.tableColumns = [
          'useravatar',
          'title',
          'description',
          'start',
          'end',
          'status',
          'actions',
        ];

        this.setDataTableExtraProperties();

        break;
      case UserType.Basic:
        this.tableColumns = [
          'title',
          'description',
          'start',
          'end',
          'status',
          'actions',
        ];
        break;
      default:
        throw new Error('Impossible to generate table columns');
    }
  }

  setDataTableExtraProperties() {
    try {
      this.taksList = this.taksList.map((task) => {
        const user = this._userData.Users.find(
          (user) => user.id === task.author
        );

        if (!user) {
          console.error('ExtraProperties: User not found');
          return task;
        }

        task.canModify = user.id == this._userData.Data?.id;
        task.userName = user?.name
          ? task.author === this._userData.Data?.id
            ? 'You'
            : user?.name
          : 'Unknow user';
        task.userAvatar = user?.avatar ?? '';

        return task;
      });
    } catch (error) {
      console.error(error);
    }
  }

  //#endregion

  sortDataTable(sort: Sort) {
    const data = this.sourceData.data.slice();
    if (!sort.active || sort.direction == '') {
      this.sourceData.data = data;
      return;
    }

    this.sourceData.data = data.sort((a, b) => {
      let isAsc = sort.direction == 'asc';
      switch (sort.active) {
        case 'useravatar':
          return this.compare(a.author, b.author, isAsc);
        case 'title':
          return this.compare(a.title, b.title, isAsc);
        case 'description':
          return this.compare(a.description, b.description, isAsc);
        case 'start':
          return this.compare(
            new Date(a.startDate).getTime(),
            new Date(b.startDate).getTime(),
            isAsc
          );
        case 'end':
          return this.compare(
            new Date(a.dueDate).getTime(),
            new Date(b.dueDate).getTime(),
            isAsc
          );
        case 'status':
          return this.compare(a.status, b.status, isAsc);
        default:
          return 0;
      }
    });
  }

  compare(a: any, b: any, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
}

@Component({
  selector: 'dialog-overview-example-dialog',
  template:
    "<div style='text-align: center; background-color: #fff;' class='p-12'><h3>Are you sure to delete this register?</h3><button (click)='doAction(true)' mat-button color='primary' mat-raise-button>ACCEPT</button></div>",
})
export class DialogOverviewExampleDialog {
  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  doAction($event: any) {
    this.dialogRef.close($event);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
