import { useEffect } from "react";
import { useLoaderData, useNavigate } from "react-router";
import dayjs from "dayjs";
import type { ISession, IExercise } from "../../../utils/interfaces";
import coverImg from "../../../assets/session-cover.webp";
import avatarImg from "../../../assets/anonymous-avatar.jpg";
import { ExerciseCard } from "../../../components";

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
        <div className="flex flex-row gap-x-2">
          <span className="relative size-12 overflow-hidden rounded-full">
            <div className="absolute inset-0 flex items-center justify-center">
              <img src={session.owner?.avatar || avatarImg} className="h-full object-cover object-center" />
            </div>
          </span>
          <div className="flex flex-col">
            <div
              onClick={(e) => {
                e.stopPropagation();
                if (session.owner) navigate(`/profile?id=${session.owner.id}`);
              }}>
              <span className="font-semibold">{session.owner?.firstName || "Anomymous Trainer"}</span>{" "}
              {session.owner ? <span className="text-gray-700 text-sm">&#9210; {session.owner.username}</span> : ""}
            </div>
            <span className="text-gray-700 text-sm leading-3.5">{dayjs(session.createdOn).utcOffset(7).format("HH:mm  DD.MM.YYYY")}</span>
          </div>
        </div>
        <div className="flex flex-row items-center gap-2">
          <span className="rounded-lg text-balance px-2 font-medium transform bg-blue-400 text-white">Phiên tập</span>
          <h1 className="text-2xl text-blue-400 font-semibold">{session.name}</h1>
        </div>
        <p>{session.description}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {exercises.map((exercise) => (
            <ExerciseCard exercise={exercise} key={exercise.id} />
          ))}
        </div>
        <div>
          <button
            onClick={() => navigate(`/start-session?session_id=${session.id}`)}
            type="button"
            className="cursor-pointer rounded-full bg-blue-400 hover:bg-blue-300 text-white px-3 py-1 shadow-md">
            Bắt đầu luyện tập
          </button>
        </div>
      </div>
    </>
  );
}
