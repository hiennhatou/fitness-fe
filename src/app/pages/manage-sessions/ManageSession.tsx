import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import dayjs from "dayjs";

import type { ISession } from "../../../utils/interfaces";
import { secureApi } from "../../../utils/http";
import sessionCover from "../../../assets/session-cover.webp";
import { Trash } from "../../../components/icons";

export function ManageSession() {
  const [sessions, setSessions] = useState<ISession[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [nextPage, setNextPage] = useState<number>(1);
  const navigate = useNavigate();

  const fetchSessions = useCallback(async () => {
    if (!isLoading && nextPage !== 0) {
      setIsLoading(true);

      try {
        const res = await secureApi.get<ISession[]>("/me/sessions", {
          params: {
            page: nextPage,
          },
        });
        if (res.status === 200 && res.data && res.data.length > 0) {
          setSessions(nextPage === 1 ? res.data : [...sessions, ...res.data]);
          setNextPage(nextPage + 1);
        } else throw new Error();
      } catch (err) {
        console.error(err);
        setNextPage(0);
      } finally {
        setIsLoading(false);
      }
    }
  }, [isLoading, nextPage, sessions]);

  useEffect(() => {
    if (nextPage === 1) fetchSessions();
  }, [fetchSessions, nextPage]);

  useEffect(() => {
    const loadMore = () => {
      const sessionsEle = document.getElementById("sessions");
      if (!sessionsEle || window.scrollY + window.innerHeight < sessionsEle.offsetTop + sessionsEle.offsetHeight) return;
      fetchSessions();
    };
    window.addEventListener("scroll", loadMore);
    return () => window.removeEventListener("scroll", loadMore);
  }, [fetchSessions]);

  const onDelete = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>, sessionId: number) => {
      e.stopPropagation();
      secureApi
        .delete(`/sessions/${sessionId}`)
        .then((res) => {
          if (res.status === 204) {
            setSessions(sessions.filter((session) => session.id !== sessionId));
          }
        })
        .catch((err) => {
          console.error(err);
        });
    },
    [sessions]
  );

  return (
    <div className="col-span-full md:col-span-2">
      <h1 className="text-2xl font-semibold text-blue-500">Quản lý bài tập tổng hợp</h1>
      <div className="flex flex-row items-center justify-between my-2">
        <button onClick={() => navigate("/add-session")} className="rounded-lg bg-blue-500 text-white px-4 py-2">
          Thêm bài tập tổng hợp
        </button>
      </div>
      <div id="sessions" className="grid grid-cols-2 gap-3 my-3">
        {sessions.map((session) => (
          <div
            key={session.id}
            className="cursor-pointer relative shadow-xs rounded-lg  border-gray-200 border bg-indigo-50 hover:shadow-xl transition-shadow duration-100 ease-in-out z-0 overflow-hidden bg-center bg-cover"
            style={{ backgroundImage: `url(${session.coverImage || sessionCover})` }}>
            <div
              onClick={() => {
                navigate(`/sessions/${session.id}`);
              }}
              className="flex flex-col relative gap-y-2 h-full z-20 bg-[rgba(0,0,0,0.3)] backdrop-saturate-200 active:bg-[rgba(0,0,0,0.25)] py-2 px-3 text-white text-shadow-gray-800 text-shadow-md">
              <div className="flex flex-row items-center my-2">
                <div className="flex flex-col pl-2">
                  <span className="text-gray-100 text-lg leading-3.5">{dayjs(session.createdOn).utcOffset(7).format("HH:mm  DD.MM.YYYY")}</span>
                </div>
              </div>
              <h1 className="text-xl font-semibold overflow-ellipsis overflow-hidden text-nowrap">{session.name}</h1>
              <div className="line-clamp-3">{session.description}</div>
              <div className="flex flex-row items-center justify-between mt-auto">
                <button onClick={(e) => onDelete(e, session.id)} className="rounded-full size-10 bg-red-50 p-2">
                  <Trash className="size-full text-red-500 hover:text-red-600" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/sessions/${session.id}/edit`);
                  }}
                  className="rounded-lg bg-blue-500 text-white px-4 py-2">
                  Chỉnh sửa
                </button>
              </div>
            </div>
          </div>
        ))}
        {!!nextPage && (
          <div className="col-span-full flex justify-center items-center">
            <div
              className="animate-spin inline-block size-10 border-3 border-current border-t-transparent text-blue-600 rounded-full"
              role="status"
              aria-label="loading">
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
