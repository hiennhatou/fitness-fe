import type { IExercise } from "../utils/interfaces";
import exerciseCover from "../assets/exercise-cover.jpg";
import type { MouseEventHandler } from "react";
import { Trash } from "../components/icons";

export function ExerciseCardNoExpand({
  exercise,
  onClick,
  onDelete,
  isFinished,
}: {
  exercise: IExercise;
  onClick?: MouseEventHandler<HTMLDivElement>;
  onDelete?: MouseEventHandler<HTMLButtonElement>;
  isFinished: boolean;
}) {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer rounded-xl relative h-72 overflow-hidden border-[0.1rem] border-gray-400 flex flex-col px-2 py-3 z-auto">
      <h1 className="text-xl basis-[fit-content] font-bold overflow-ellipsis text-nowrap text-blue-400">{exercise.name}</h1>
      <div className="relative basis-full overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <img className="h-full object-cover object-center" src={exercise.image || exerciseCover} />
        </div>
      </div>
      <div className="flex justify-end">
        {!isFinished && (
          <button onClick={onDelete} className="size-8 p-1 bg-gray-50 hover:bg-gray-200 rounded-full">
            <Trash className="size-full text-red-500" />
          </button>
        )}
      </div>
    </div>
  );
}
