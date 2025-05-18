import { useEffect } from "react";
import { useLoaderData, useNavigate } from "react-router";
import type { ISession } from "../../../utils/interfaces";
import type { IExercise } from "../../../utils/interfaces/IExercise";
import coverImg from "../../../assets/session-cover.webp";
import ExerciseCard from "../../../components/ExerciseCard";

export function SessionDetail() {
  const { session, exercises } = useLoaderData<{ session: ISession; exercises: IExercise[] }>();
  const navigate = useNavigate();
  useEffect(() => {
    if (!session) navigate("/");
  }, [session, navigate]);

  return (
    <>
      <div
        style={{ backgroundImage: `url(${session.coverImage || coverImg})` }}
        className="col-span-full h-96 overflow-hidden rounded-lg animate-(--animate-open-cover) bg-center bg-cover"></div>
      <div className="col-span-3 min-md:col-span-2 flex flex-col gap-3">
        <div className="flex flex-row items-center gap-2">
          <span className="rounded-lg text-balance px-2 font-medium transform bg-blue-400 text-white">Phiên tập</span>
          <h1 className="text-2xl text-blue-400 font-semibold">{session.name}</h1>
        </div>
        <p>{session.description}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {
          exercises.map(exercise => (<ExerciseCard exercise={exercise} key={exercise.id}/>))
        }
      </div>
      </div>
    </>
  );
}
