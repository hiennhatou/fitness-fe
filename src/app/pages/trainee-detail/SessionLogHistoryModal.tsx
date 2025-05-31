import { useEffect, useState } from "react";
import { HSOverlay } from "preline";
import dayjs from "dayjs";

import { secureApi } from "../../../utils/http";
import type { ISessionLog } from "../../../utils/interfaces";

export function SessionLogHistoryModal({ traineeId, onClick }: { traineeId: number; onClick: (sessionLogId: number) => void }) {
  const [sessionLogs, setSessionLogs] = useState<ISessionLog[]>([]);

  useEffect(() => {
    HSOverlay.autoInit();
  }, []);

  useEffect(() => {
    secureApi
      .get<ISessionLog[]>(`/users/${traineeId}/session-log`)
      .then((res) => {
        setSessionLogs(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [traineeId]);

  return (
    <div
      id="hs-session-log-history-modal"
      className="hs-overlay hidden size-full fixed top-0 start-0 z-80 overflow-x-hidden overflow-y-auto pointer-events-none"
      role="dialog"
      tabIndex={-1}
      aria-labelledby="hs-session-log-history-modal-label">
      <div className="hs-overlay-open:mt-7 hs-overlay-open:opacity-100 hs-overlay-open:duration-500 mt-0 opacity-0 ease-out transition-all md:max-w-3xl md:w-full m-3 md:mx-auto">
        <div className="flex flex-col bg-white border border-gray-200 shadow-2xs rounded-xl pointer-events-auto">
          <div className="flex justify-between items-center py-3 px-4 border-b border-gray-200">
            <h3 id="hs-session-log-history-modal-label" className="font-semibold text-lg text-blue-500">
              Lịch sử luyện tập
            </h3>
            <button
              type="button"
              className="size-8 inline-flex justify-center items-center gap-x-2 rounded-full border border-transparent bg-gray-100 text-gray-800 hover:bg-gray-200 focus:outline-hidden focus:bg-gray-200 disabled:opacity-50 disabled:pointer-events-none"
              aria-label="Close"
              data-hs-overlay="#hs-session-log-history-modal">
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
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">
                    hời gian bắt đầu
                  </th>
                  <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">
                    Thời gian kết thúc
                  </th>
                  <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">
                    Nhịp tim trung bình
                  </th>
                  <th scope="col" className="px-6 py-3 text-end text-xs font-medium text-gray-500 uppercase">
                    Thời gian tập (phút)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {sessionLogs.map((sessionLog) => (
                  <tr tabIndex={-1} onClick={() => onClick(sessionLog.id)} key={sessionLog.id} className="cursor-pointer hover:bg-gray-100">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                      {dayjs(sessionLog.startedOn).format("DD/MM/YYYY HH:mm")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                      {(sessionLog.finishedOn && dayjs(sessionLog.finishedOn).format("DD/MM/YYYY HH:mm")) || "--"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{sessionLog.avgHeartRate || "--"}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{sessionLog.periodTime || "--"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-end items-center gap-x-2 py-3 px-4 border-t border-gray-200">
            <button
              type="button"
              data-hs-overlay="#hs-session-log-history-modal"
              className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-hidden focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none">
              Xong
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
