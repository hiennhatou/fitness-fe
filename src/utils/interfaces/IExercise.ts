import type { IUser } from "./IUser";

export interface IExercise {
    id: number;
    name: string;
    description?: string;
    owner?: IUser;
    image?: string;
    sessionExerciseId?: number;
}