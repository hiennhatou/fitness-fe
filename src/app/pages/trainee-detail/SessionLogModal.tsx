import { useEffect, useState } from "react";
import { HSOverlay, type ICollectionItem } from "preline";
import type { IExerciseLog } from "../../../utils/interfaces";
import { secureApi } from "../../../utils/http";
import { ExerciseCard } from "./ExerciseCard";

export function SessionLogModal({ sessionId }: { sessionId: number | null }) {
  const [exerciseLogs, setExerciseLogs] = useState<IExerciseLog[]>([]);

  useEffect(() => {
    if (!sessionId) return;
    secureApi
      .get<IExerciseLog[]>(`/session-log/${sessionId}/session-log-exercise`)
      .then((res) => {
        if (res.status === 200 && res.data) setExerciseLogs(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [sessionId]);

  useEffect(() => {
    HSOverlay.autoInit();
  }, []);

  return (
    <div
      id="hs-session-log-modal"
      className="hs-overlay hidden size-full fixed top-0 start-0 z-80 overflow-x-hidden overflow-y-auto pointer-events-none"
      role="dialog"
      tabIndex={-1}
      aria-labelledby="hs-session-log-modal-label">
      <div className="hs-overlay-open:mt-7 hs-overlay-open:opacity-100 hs-overlay-open:duration-500 mt-0 opacity-0 ease-out transition-all md:max-w-3xl md:w-full m-3 md:mx-auto">
        <div className="flex flex-col bg-white border border-gray-200 shadow-2xs rounded-xl pointer-events-auto">
          <div className="flex justify-between items-center py-3 px-4 border-b border-gray-200">
            <h3 id="hs-session-log-modal-label" className="font-semibold text-lg text-blue-500">
              Lịch sử luyện tập
            </h3>
            <button
              onClick={() => {
                const modal = HSOverlay.getInstance("#hs-session-log-history-modal", true) as ICollectionItem<HSOverlay>;
                modal.element.open();
              }}
              type="button"
              className="size-8 inline-flex justify-center items-center gap-x-2 rounded-full border border-transparent bg-gray-100 text-gray-800 hover:bg-gray-200 focus:outline-hidden focus:bg-gray-200 disabled:opacity-50 disabled:pointer-events-none">
              <span className="sr-only">Close</span>
              <svg
                className="shrink-0 size-4"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round">
                <path d="M18 6 6 18"></path>
                <path d="m6 6 12 12"></path>
              </svg>
            </button>
          </div>
          <div className="p-4 overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {exerciseLogs.map((log) => (
                <ExerciseCard key={log.id} exerciseLog={log} />
              ))}
            </div>
          </div>
          <div className="flex justify-end items-center gap-x-2 py-3 px-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => {
                const modal = HSOverlay.getInstance("#hs-session-log-history-modal", true) as ICollectionItem<HSOverlay>;
                modal.element.open();
              }}
              className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-hidden focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none">
              Xong
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
