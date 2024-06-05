export interface IUserData {
  id: number;
  type: number;
  status: number;
  name: string;
  avatar: string;
}

export class UserData {
  id: string | undefined;
  type: number | undefined;
  status: number | undefined;
  statusName: string | undefined;
  name: string | undefined;
  typeName: string | undefined;
  avatar: string | undefined;

  constructor(user: any, statusList: Array<any>, typeList: Array<any>) {
    this.id = user?.id ?? undefined;
    this.type = Number(user?.type) ?? undefined;
    this.status = user?.status ?? undefined;
    this.name = user?.name ?? undefined;
    this.typeName = user?.typeName ?? undefined;
    this.avatar = user?.avatar ?? undefined;

    if (statusList) {
      this.SetStatusName(statusList);
    }

    if (typeList) {
      this.SetTypeName(typeList);
    }
  }

  SetStatusName(statusList: Array<UserStatus>) {
    this.statusName = statusList.find(
      (status) => status.id == this.status
    )?.title;
  }

  SetTypeName(typesList: Array<UserType>) {
    this.typeName = typesList.find((type) => type.id == this.status)?.title;
  }
}

export class UserStatus {
  id: number | undefined;
  title: string | undefined;

  constructor(userStatus: any) {
    this.id = userStatus?.id ?? undefined;
    this.title = userStatus?.title ?? undefined;
  }
}

export class UserType {
  id: number | undefined;
  title: string | undefined;

  constructor(userStatus: any) {
    this.id = userStatus?.id ?? undefined;
    this.title = userStatus?.title ?? undefined;
  }
}
