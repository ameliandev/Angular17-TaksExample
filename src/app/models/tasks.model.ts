export interface ITask {
  id: number;
  guid: string;
  title: string;
  description: string;
  status: number;
  author: string;
}

export class Task {
  id: number | undefined;
  guid: string | undefined;
  title: string | undefined;
  description: string | undefined;
  statusId: number | undefined;
  statusName: string | undefined;
  author: string | undefined;

  constructor(task: any, types?: Array<TaskStatus>) {
    this.id = task?.id ?? undefined;
    this.guid = task?.guid ?? undefined;
    this.title = task?.title ?? undefined;
    this.description = task?.description ?? undefined;
    this.statusId = task?.status ?? undefined;
    this.author = task?.author ?? undefined;

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
