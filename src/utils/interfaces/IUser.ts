import type { GenderEnum, UserRoleEnum, UserStatusEnum } from "../enums";

export interface IUser {
  id: number;
  avatar?: string;
  username: string;
  password?: string;
  firstName: string;
  lastName?: string;
  middleName?: string;
  role: UserRoleEnum;
  birthdate?: Date;
  gender?: GenderEnum;
  status: UserStatusEnum;
  email: string;
}
