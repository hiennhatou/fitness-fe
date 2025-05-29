import { useNavigate } from "react-router";
import dayjs from "dayjs";
import type { ISession } from "../utils/interfaces";
import sessionCover from "../assets/session-cover.webp";

export function SessionCardNoOwner({
  session,
}: {
  session: ISession;
}) {
  const navigate = useNavigate();

  return (
    <div
      className="cursor-pointer relative shadow-xs rounded-lg  border-gray-200 border bg-indigo-50 hover:shadow-xl transition-shadow duration-100 ease-in-out z-0 overflow-hidden bg-center bg-cover"
      style={{ backgroundImage: `url(${session.coverImage || sessionCover})` }}>
      <div
        onClick={() => {
          navigate(`/sessions/${session.id}`);
        }}
        className="relative block h-full z-20 bg-[rgba(0,0,0,0.3)] backdrop-saturate-200 active:bg-[rgba(0,0,0,0.25)] py-2 px-3 text-white text-shadow-gray-800 text-shadow-md">
        <div className="flex flex-row items-center my-2">
          <div className="flex flex-col pl-2">
            <span className="text-gray-100 text-lg leading-3.5">{dayjs(session.createdOn).utcOffset(7).format("HH:mm  DD.MM.YYYY")}</span>
          </div>
        </div>
        <h1 className="text-xl font-semibold my-1 overflow-ellipsis overflow-hidden text-nowrap">{session.name}</h1>
        <div className="line-clamp-3">{session.description}</div>
      </div>
    </div>
  );
}
