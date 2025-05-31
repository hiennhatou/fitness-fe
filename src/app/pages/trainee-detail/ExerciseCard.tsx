import type { IExerciseLog } from "../../../utils/interfaces";
import exerciseCover from "../../../assets/exercise-cover.jpg";

export function ExerciseCard({ exerciseLog }: { exerciseLog: IExerciseLog }) {
  return (
    <div
      className="rounded-xl relative overflow-hidden border-2 border-[#9cd3ff]">
      <div className="h-70 flex items-center justify-center">
        <img className="h-full object-cover object-center" src={exerciseLog.exerciseImage || exerciseCover} />
      </div>
      <div className="bg-[rgb(231,244,255)] text-blue-500 relative z-20 w-full h-full px-3 py-2">
        <h1 className="text-xl font-bold overflow-hidden overflow-ellipsis text-nowrap">{exerciseLog.exerciseName}</h1>
        <p className="text-lg font-medium backdrop-blur-sm">{exerciseLog.exerciseDescription}</p>
      </div>
    </div>
  );
}