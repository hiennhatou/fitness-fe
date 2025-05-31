import { useNavigate } from "react-router";
import sessionCover from "../../../assets/session-cover.webp";
import type { IRecommendSessionTrainer } from "../../../utils/interfaces";
import { Trash } from "../../../components/icons";

export function RecommendCard({ recommendSession, onDelete }: { recommendSession: IRecommendSessionTrainer; onDelete: () => void }) {
  const navigate = useNavigate();

  return (
    <div
      className="h-80 cursor-pointer relative shadow-xs rounded-xl  border-gray-200 border bg-indigo-50 hover:shadow-xl transition-shadow duration-100 ease-in-out z-0 overflow-hidden bg-center bg-cover"
      style={{ backgroundImage: `url(${recommendSession.session.coverImage || sessionCover})` }}>
      <div
        onClick={() => {
          navigate(`/sessions/${recommendSession.session.id}`);
        }}
        className="relative block h-full z-20 bg-[rgba(0,0,0,0.3)] backdrop-saturate-200 active:bg-[rgba(0,0,0,0.25)] py-2 px-3 text-white text-shadow-gray-800 text-shadow-md">
        <h1 className="text-xl font-semibold my-1 overflow-ellipsis overflow-hidden text-nowrap">{recommendSession.session.name}</h1>
        <div className="line-clamp-5">{recommendSession.session.description}</div>
        <div className="flex flex-row justify-end">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="rounded-full bg-red-100 p-2 hover:bg-red-200">
            <Trash className="size-6 text-red-500" />
          </button>
        </div>
      </div>
    </div>
  );
}
