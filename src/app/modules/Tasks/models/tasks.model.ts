export interface ITask {
  id?: string;
  title: string;
  description: string;
  status: number;
  startDate: string;
  dueDate: string;
  author: string;
}

export class Task {
  id: string;
  title: string;
  description: string;
  status: number;
  statusName: string | undefined;
  author: string;
  startDate: string;
  dueDate: string;
  userName: string | undefined;
  userAvatar: string | undefined;
  canModify: boolean = true;

  constructor(task: any, types?: Array<TaskStatus>) {
    this.id = task?.id ?? undefined;
    this.title = task?.title ?? undefined;
    this.description = task?.description ?? undefined;
    this.status = task?.status ?? undefined;
    this.author = task?.author ?? undefined;
    this.startDate = task?.startDate ?? undefined;
    this.dueDate = task?.dueDate ?? undefined;

    if (types) {
      this.SetStatusName(types);
    }
  }

  SetStatusName(types: Array<TaskStatus>) {
    this.statusName = types.find((type) => type.id == this.status)?.title;
  }
}

export class TaskStatus {
  id: number | undefined;
  title: string | undefined;

  constructor(taskStatus: any) {
    this.id = taskStatus?.id ?? undefined;
    this.title = taskStatus?.title ?? undefined;
  }
}
