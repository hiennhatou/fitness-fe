import type { IUser } from "./IUser";

export interface IRegisterPT {
    trainer: Omit<IUser, "password" | "status" | "username">;
    trainee: Omit<IUser, "password" | "status" | "username">;
}