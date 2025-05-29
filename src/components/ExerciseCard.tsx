import { useState } from "react";
import exerciseCover from "../assets/exercise-cover.jpg";
import type { IExercise } from "../utils/interfaces/IExercise";

export function ExerciseCard({ exercise }: { exercise: IExercise }) {
  const [isActive, setIsActive] = useState<boolean | null>(null);

  return (
    <div
      onClick={() => setIsActive(!isActive)}
      className={`cursor-pointer rounded-xl relative h-60 overflow-hidden border-[0.1rem] border-gray-400 [&.active]:border-2 [&.active]:border-[#9cd3ff] [&.active_.img-wrapper]:relative [&.active_.img-wrapper]:h-70 [&.active]:exerciseopen [&.] [&.active_.content-wrapper_p]:line-clamp-none [&.active_.content-wrapper]:backdrop-blur-none [&.active_.content-wrapper]:text-shadow-none [&.active_.content-wrapper]:bg-[rgb(231,244,255)] [&.inactive]:exerciseclose ${isActive ? "active" : isActive === false ? "inactive" : ""}`}>
      <div className="img-wrapper absolute top-0 right-0 bottom-0 left-0 z-10 flex items-center justify-center">
        <img className="h-full object-cover object-center" src={exercise.image || exerciseCover} />
      </div>
      <div className="content-wrapper text-blue-500 relative z-20 w-full h-full px-3 py-2">
        <h1 className="text-xl font-bold overflow-hidden overflow-ellipsis text-nowrap">{exercise.name}</h1>
        <p className="line-clamp-4 text-lg font-medium backdrop-blur-sm">{exercise.description}</p>
      </div>
    </div>
  );
}
