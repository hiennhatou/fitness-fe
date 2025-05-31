import { useLoaderData, useNavigate } from "react-router";
import type { IRecommendSessionTrainer } from "../../../utils/interfaces";
import sessionCover from "../../../assets/session-cover.webp";
import defaultAvatar from "../../../assets/anonymous-avatar.jpg";
import { TrainerCard } from "./TrainerCard";

export function RecommendSession() {
  const { recommendSession } = useLoaderData() as { recommendSession: IRecommendSessionTrainer[] };

  const navigate = useNavigate();

  return (
    <div className="col-span-full md:col-span-2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="col-span-full flex flex-col gap-2">
          <h1 className="text-2xl font-semibold">Huấn luyện viên hiện tại của bạn</h1>
          <TrainerCard />
        </div>
        <div className="col-span-full">
          <h1 className="text-2xl font-semibold">Gợi ý bài tập</h1>
        </div>
        {recommendSession.map((session) => (
          <div className="flex flex-col rounded-xl border border-gray-200 overflow-hidden" key={session.session.id}>
            <div className="flex flex-row items-center gap-2">
              <div className="bg-blue-50 text-sm h-full text-blue-500 px-2 flex items-center">Gợi ý bởi</div>
              <div
                className="my-2 size-12 rounded-full overflow-hidden relative border border-gray-300 bg-white">
                <img src={session.trainer.avatar || defaultAvatar} alt={session.trainer.firstName} className="absolute inset-0 h-full object-cover" />
              </div>
              <h1 className=" font-medium overflow-ellipsis overflow-hidden text-nowrap">{session.trainer.firstName}</h1>
            </div>
            <div
              className="basis-full cursor-pointer relative shadow-xs min-h-40 border-gray-200 border bg-indigo-50 hover:shadow-xl transition-shadow duration-100 ease-in-out z-0 overflow-hidden bg-center bg-cover"
              style={{ backgroundImage: `url(${session.session.coverImage || sessionCover})` }}>
              <div
                onClick={() => {
                  navigate(`/sessions/${session.session.id}`);
                }}
                className="relative block h-full z-20 bg-[rgba(0,0,0,0.3)] backdrop-saturate-200 active:bg-[rgba(0,0,0,0.25)] py-2 px-3 text-white text-shadow-gray-800 text-shadow-md">
                <h1 className="text-xl font-semibold my-1 overflow-ellipsis overflow-hidden text-nowrap">{session.session.name}</h1>
                <div className="line-clamp-5">{session.session.description}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
