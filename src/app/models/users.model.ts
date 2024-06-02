export interface IUser {
  id: number;
  guid: string;
  type: number;
  name: string;
  avatar: string;
}

export class User {
  id: number | undefined;
  guid: string | undefined;
  name: string | undefined;
  type: number | undefined;
  typeName: string | undefined;
  avatar: string | undefined;

  constructor(user: any) {
    this.id = user?.id ?? undefined;
    this.guid = user?.guid ?? undefined;
    this.name = user?.name ?? undefined;
    this.type = user?.type ?? undefined;
    this.typeName = user?.typeName ?? undefined;
    this.avatar = user?.avatar ?? undefined;
  }
}
