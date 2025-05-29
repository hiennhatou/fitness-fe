import { useLoaderData, useNavigate } from "react-router";
import { StartSessionLog } from "./StartSessionLog";
import type { IExerciseLog, ISessionLog } from "../../../utils/interfaces";
import { useEffect } from "react";

export function SessionLog() {
  const navigate = useNavigate();
  const data = useLoaderData<{ sessionLog?: ISessionLog, exercise?: IExerciseLog[] }>();
  useEffect(() => {
    if (!data || !data.sessionLog) navigate("/");
  }, [data, navigate]);
  
  return <StartSessionLog />;
}
