import type { Dispatch, SetStateAction } from "react";
import { useNavigate } from "react-router";
import type { IExerciseLog, ISessionLog } from "../../../utils/interfaces";
import { secureApi } from "../../../utils/http";

export function StartSessionControl({
  setSessionLog,
  exercises,
  setExercises,
}: {
  setSessionLog: Dispatch<SetStateAction<ISessionLog | undefined>>;
  setExercises: (exercises: IExerciseLog[]) => void;
  exercises: IExerciseLog[];
}) {
  const navigate = useNavigate();

  const startSession = async () => {
    const { data } = await secureApi.post("/session-log/start", {
      exercise: exercises.map(exercise => ({
        exerciseId: exercise.exerciseId
      })),
    });
    navigate(`/session-log/${data.id}`, {replace: true, });
  };

  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <div className="sm:flex-1/2">
        <button onClick={startSession} className="w-full rounded-full px-4 py-2 bg-blue-500 text-white">Bắt đầu</button>
      </div>
      <div className="sm:flex-1/2">
        <button className="w-full rounded-full px-4 py-2 border border-gray-400 text-gray-600">Hủy</button>
      </div>
    </div>
  );
}
