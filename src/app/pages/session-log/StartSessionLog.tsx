import { useEffect, useReducer, useState, useCallback } from "react";
import { useLoaderData } from "react-router";
import { HSOverlay, type ICollectionItem } from "preline";
import { type AxiosResponse } from "axios";
import { secureApi } from "../../../utils/http";

import { DetailExerciseModal, AddExerciseModal, ExerciseCardNoExpand } from "../../../components";
import type { IExerciseLog, ISessionLog, IExercise } from "../../../utils/interfaces";
import { Plus } from "../../../components/icons";
import { SessionLogStatusEnum } from "../../../utils/enums";
import { ResultSession } from "./ResultSession";
import { InputSessionResult } from "./InputSessionResult";
import { StartSessionControl } from "./StartSessionControl";

export type ExercisesAction =
  | { type: "DELETE"; exercise: IExerciseLog }
  | { type: "SET"; exercises: IExerciseLog[] }
  | { type: "ADD"; exercises: IExerciseLog[] };

function exercisesReducer(state: IExerciseLog[], action: ExercisesAction): IExerciseLog[] {
  switch (action.type) {
    case "DELETE":
      return state.filter((exercise) => exercise !== action.exercise);
    case "SET":
      return action.exercises;
    case "ADD":
      return [...state, ...action.exercises];
    default:
      return state;
  }
}

type ExerciseLogResponse = Omit<IExerciseLog, "exerciseId"> & { exerciseId?: { id: number } };

export function StartSessionLog() {
  const data = useLoaderData<{ exercises?: IExerciseLog[]; sessionLog?: ISessionLog }>();
  const [currentExercise, setCurrentExercise] = useState<IExerciseLog | undefined>();
  const [exercises, dispatchExercises] = useReducer(exercisesReducer, data?.exercises || []);
  const [sessionLog, setSessionLog] = useState<ISessionLog | undefined>(data?.sessionLog);

  useEffect(() => {
    HSOverlay.autoInit();
  }, []);

  const convertToExerciseLog = useCallback((exercise: IExercise): IExerciseLog => {
    return {
      id: 0,
      exerciseId: exercise.id,
      exerciseName: exercise.name,
      exerciseDescription: exercise.description,
      exerciseImage: exercise.image,
    };
  }, []);

  const handleDeleteExercise = useCallback(
    async (exercise: IExerciseLog) => {
      if (sessionLog && exercise.id) {
        try {
          await secureApi.delete(`/session-log/session-log-exercise/${exercise.id}`);
          dispatchExercises({ type: "DELETE", exercise });
        } catch (err) {
          console.error("Error deleting exercise:", err);
        }
      } else {
        dispatchExercises({ type: "DELETE", exercise });
      }
    },
    [sessionLog, dispatchExercises]
  );

  const handleAddExercises = useCallback(
    async (newExercises: IExercise[]) => {
      const exerciseLogs = newExercises.map(convertToExerciseLog);
      if (sessionLog) {
        try {
          const responses = await Promise.allSettled(
            exerciseLogs.map((exercise) =>
              secureApi.post<ExerciseLogResponse>(`/session-log/${sessionLog.id}/session-log-exercise`, { exerciseId: exercise.exerciseId })
            )
          );
          const addedExercises: IExerciseLog[] = responses
            .filter((response): response is PromiseFulfilledResult<AxiosResponse<ExerciseLogResponse>> => response.status === "fulfilled")
            .map((response) => ({
              ...response.value.data,
              exerciseId: response.value.data.exerciseId?.id || 0,
            }));
          dispatchExercises({ type: "ADD", exercises: addedExercises });
        } catch (err) {
          console.error("Error adding exercises:", err);
        }
      } else {
        dispatchExercises({ type: "ADD", exercises: exerciseLogs });
      }
    },
    [sessionLog, dispatchExercises, convertToExerciseLog]
  );

  return (
    <>
      <DetailExerciseModal
        isFinished={sessionLog?.status === SessionLogStatusEnum.FINISHED}
        exercise={
          currentExercise
            ? {
                id: currentExercise.exerciseId || 0,
                name: currentExercise.exerciseName,
                description: currentExercise.exerciseDescription,
                image: currentExercise.exerciseImage,
              }
            : undefined
        }
        onClose={() => setCurrentExercise(undefined)}
        onDelete={() => handleDeleteExercise(currentExercise!)}
      />
      {!(sessionLog?.status === SessionLogStatusEnum.FINISHED) && (
        <AddExerciseModal
          existedExercise={exercises.map((ex) => ({
            id: ex.exerciseId || 0,
            name: ex.exerciseName,
            description: ex.exerciseDescription,
            image: ex.exerciseImage,
          }))}
          addExistedExercise={handleAddExercises}
        />
      )}
      <div className="px-5 grid grid-cols-3 grid-flow-col h-full gap-x-4 gap-y-3 py-5">
        <div className="col-span-full lg:col-span-2">
          <h1 className="text-2xl text-blue-400 mb-3">Các bài tập</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {exercises.map((exercise) => (
              <ExerciseCardNoExpand
                isFinished={sessionLog?.status === SessionLogStatusEnum.FINISHED}
                onDelete={(e) => {
                  e.stopPropagation();
                  handleDeleteExercise(exercise);
                }}
                onClick={() => {
                  setCurrentExercise(exercise);
                  const { element } = HSOverlay.getInstance("#hs-exercise-modal", true) as ICollectionItem<HSOverlay>;
                  element.open();
                }}
                key={`${exercise.id}-${exercise.exerciseId}`}
                exercise={{
                  id: exercise.exerciseId || 0,
                  name: exercise.exerciseName,
                  description: exercise.exerciseDescription,
                  image: exercise.exerciseImage,
                }}
              />
            ))}
            {!(sessionLog?.status === SessionLogStatusEnum.FINISHED) && (
              <div
                aria-haspopup="dialog"
                data-hs-overlay="#hs-add-exercise-modal"
                className="cursor-pointer rounded-xl relative h-72 overflow-hidden border-[0.1rem] border-gray-400 flex flex-col px-2 py-3 justify-center items-center gap-2">
                <Plus className="size-16 text-blue-500 stroke-1" />
                <span className="text-lg text-blue-500">Thêm bài tập</span>
              </div>
            )}
          </div>
        </div>
        <div className="col-span-full lg:col-span-1 px-2">
          <h1 className="text-xl text-blue-400 mb-3">Bắt đầu phiên tập</h1>
          {!sessionLog && (
            <StartSessionControl
              setSessionLog={setSessionLog}
              exercises={exercises}
              setExercises={(exercises) => dispatchExercises({ type: "SET", exercises })}
            />
          )}
          {sessionLog?.status === SessionLogStatusEnum.STARTED && <InputSessionResult sessionLog={sessionLog} setSessionLog={setSessionLog} />}
          {sessionLog?.status === SessionLogStatusEnum.FINISHED && <ResultSession sessionLog={sessionLog} />}
        </div>
      </div>
    </>
  );
}
