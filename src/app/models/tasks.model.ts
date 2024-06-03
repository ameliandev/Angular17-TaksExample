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
  statusId: number;
  statusName: string | undefined;
  author: string;
  startDate: string;
  dueDate: string;

  constructor(task: any, types?: Array<TaskStatus>) {
    this.id = task?.id ?? undefined;
    this.title = task?.title ?? undefined;
    this.description = task?.description ?? undefined;
    this.statusId = task?.status ?? undefined;
    this.author = task?.author ?? undefined;
    this.startDate = task?.startDate ?? undefined;
    this.dueDate = task?.dueDate ?? undefined;

    if (types) {
      this.SetStatusName(types);
    }
  }

  SetStatusName(types: Array<TaskStatus>) {
    this.statusName = types.find((type) => type.id === this.statusId)?.title;
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
