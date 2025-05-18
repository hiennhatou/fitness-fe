import type { IExercise } from "./IExercise";
import type { IUser } from "./IUser";

export interface ISession {
  id: number;
  name: string;
  owner: Pick<IUser, "firstName" | "username" | "id" | "avatar">;
  isPublic: boolean;
  updatedOn?: Date;
  createdOn?: number;
  targets?: {id: number, name: string}[];
  exercises?: Pick<IExercise, "name" | "id">[];
  description: string;
  coverImage?: string
}
