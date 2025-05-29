import type { IExerciseLog } from "./IExerciseLog";
import type { SessionLogStatusEnum } from "../enums";
export interface ISessionLog {
  id: number;
  userId: number;
  startedOn: number;
  finishedOn: number;
  periodTime: number;
  avgHeartRate: number;
  status: SessionLogStatusEnum;
  exercises?: IExerciseLog[];
}
