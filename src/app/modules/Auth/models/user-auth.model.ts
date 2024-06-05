export interface IUserAuth {
  id: number;
  type: number;
  status: number;
  name: string;
  avatar: string;
}

export class UserAuth {
  id: string | undefined;
  password: string | undefined;

  constructor(userAuth: any) {
    this.id = userAuth?.id ?? undefined;
    this.password = userAuth?.type ?? undefined;
  }
}
