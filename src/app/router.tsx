import { createBrowserRouter, data, type LoaderFunctionArgs } from "react-router";

import { normalApi, secureApi } from "../utils/http";
import type { IExercise, IExerciseLog, ISessionLog } from "../utils/interfaces";
import { TwoColumnLayout } from "../components";
import { RootTemplate } from "./RootTemplate";
import { ErrorBoundary } from "./ErrorBoundary";
import {
  Home,
  Login,
  Register,
  Sessions,
  SessionDetail,
  SessionLog,
  StartSessionLog,
  SessionLogHistory,
  UserInform,
  PersonalMetrics,
  Profile,
  ScheduleSession,
  AddSession,
} from "./pages";

const router = createBrowserRouter([
  {
    path: "/",
    ErrorBoundary: ErrorBoundary,
    hasErrorBoundary: true,
    children: [
      { path: "/login", Component: Login },
      { path: "/register", Component: Register },
      {
        path: "/",
        Component: RootTemplate,
        children: [
          {
            Component: TwoColumnLayout,
            children: [
              { index: true, Component: Home },
              {
                path: "sessions",
                children: [
                  { index: true, Component: Sessions },
                  {
                    path: ":id",
                    Component: SessionDetail,
                    loader: loadSessionDetail,
                  },
                ],
              },
              {
                path: "session-log",
                Component: SessionLogHistory,
              },
              {
                path: "user-inform",
                Component: UserInform,
              },
            ],
          },
          {
            path: "/start-session",
            Component: StartSessionLog,
            loader: startSessionLoader,
          },
          {
            path: "/session-log/:id",
            Component: SessionLog,
            loader: sessionLogLoader,
          },
          {
            path: "/user-inform/metrics",
            Component: PersonalMetrics,
          },
          {
            path: "/profile",
            Component: Profile,
            loader: profileLoader,
          },
          { path: "/schedule-session", Component: ScheduleSession },
          { path: "/add-session", Component: AddSession },
        ],
      },
    ],
  },
]);

async function loadSessionDetail({ params }: LoaderFunctionArgs) {
  if (!params.id) return {};
  try {
    const id = parseInt(params.id);
    const result = await Promise.all([normalApi.get(`/sessions/${id}`), normalApi.get(`/sessions/${id}/exercises`)]);
    if (result[0].status === 200 && result[1].status === 200) {
      return {
        session: result[0].data,
        exercises: result[1].data,
        coverImg: result[0].data.coverImage,
      };
    }
  } catch (err) {
    console.log(err);
  }
  return {};
}

async function startSessionLoader({ request }: LoaderFunctionArgs) {
  const requestUrl = new URL(request.url);
  const sessionId = requestUrl.searchParams.get("session_id");
  const exerciseId = requestUrl.searchParams.get("exercise_id");

  const returnResult: { exercises: IExerciseLog[] } = { exercises: [] };
  if (sessionId)
    try {
      const id = parseInt(sessionId);
      const result = await normalApi.get(`/sessions/${id}/exercises`);
      const exercises: IExerciseLog[] = (result.data as IExercise[]).map((exercise) => {
        return {
          id: 0,
          exerciseId: exercise.id,
          exerciseName: exercise.name,
          exerciseDescription: exercise.description,
          exerciseImage: exercise.image,
        };
      });
      if (result.status === 200) {
        returnResult.exercises.push(...exercises);
      }
    } catch (err) {
      console.log(err);
    }

  if (exerciseId)
    try {
      const id = parseInt(exerciseId);
      const result = await normalApi.get(`/exercises/${id}`);
      const exercise: IExercise = result.data;
      if (result.status === 200) {
        returnResult.exercises.push({
          id: 0,
          exerciseId: exercise.id,
          exerciseName: exercise.name,
          exerciseDescription: exercise.description,
          exerciseImage: exercise.image,
        });
      }
    } catch (err) {
      console.log(err);
    }

  return {
    exercises: returnResult.exercises.filter((value, index) => {
      return returnResult.exercises.slice(0, index).findIndex((valuePrevious) => value.exerciseId === valuePrevious.exerciseId) < 0;
    }),
  };
}

type A = (Omit<IExerciseLog, "exerciseId"> & { exerciseId?: { id: number } })[];

async function sessionLogLoader({ params }: LoaderFunctionArgs) {
  if (!params.id) return {};
  const returnResult: { sessionLog?: ISessionLog; exercises?: IExerciseLog[] } = {};
  try {
    const id = parseInt(params.id);
    const result = await Promise.allSettled([secureApi.get(`/session-log/${id}`), secureApi.get(`/session-log/${id}/session-log-exercise`)]);

    if (result[0].status === "fulfilled" && result[0].value.status === 200) returnResult.sessionLog = result[0].value.data;
    if (result[1].status === "fulfilled" && result[1].value.status === 200)
      returnResult.exercises = (result[1].value.data as A).map((exercise) => {
        return {
          ...exercise,
          exerciseId: exercise.exerciseId?.id,
        };
      });
  } catch (err) {
    console.log(err);
  }
  return returnResult;
}

async function profileLoader({ request }: LoaderFunctionArgs) {
  const requestUrl = new URL(request.url);
  const idInString = requestUrl.searchParams.get("id");
  if (idInString)
    try {
      const id = parseInt(idInString);
      const result = await normalApi.get(`/users/${id}`);
      if (result.status === 200) {
        return { user: result.data };
      }
    } catch (err) {
      console.log(err);
    }
  throw data(null, { status: 404 });
}

export default router;
