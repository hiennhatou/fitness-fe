import { useCallback, useEffect, useState } from "react";
import { useLoaderData } from "react-router";
import { HSOverlay, type ICollectionItem } from "preline";

import type { IRecommendSessionTrainer, IRegisterPT } from "../../../utils/interfaces";
import { TraineeHeader } from "./TraineeHeader";
import { RecommendCard } from "./RecommendCard";
import { ChooseSessionModal } from "./ChooseSessionModal";
import { secureApi } from "../../../utils/http";
import { SessionLogHistoryModal } from "./SessionLogHistoryModal";
import { SessionLogModal } from "./SessionLogModal";
import { HeartBeatChart } from "./HeartBeatChart";
import { StepChart } from "./StepChart";

export function TraineeDetail() {
  const registerPt = useLoaderData<IRegisterPT>();
  const [recommendSession, setRecommendSession] = useState<IRecommendSessionTrainer[]>([]);
  const [currentSessionLogId, setCurrentSessionLogId] = useState<number | null>(null);

  useEffect(() => {
    secureApi
      .get<IRecommendSessionTrainer[]>(`/users/${registerPt.trainee.id}/recommend-session`)
      .then((res) => {
        if (res.status === 200 && res.data) {
          setRecommendSession(res.data);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }, [registerPt.trainee.id]);

  const openAddRecommendModal = useCallback(() => {
    const modal = HSOverlay.getInstance("#hs-choose-session-modal", true) as ICollectionItem<HSOverlay>;
    modal.element.open();
  }, []);

  const openSessionLogHistoryModal = useCallback(() => {
    const modal = HSOverlay.getInstance("#hs-session-log-history-modal", true) as ICollectionItem<HSOverlay>;
    modal.element.open();
  }, []);

  const onDeleteRecommend = useCallback(
    (session: IRecommendSessionTrainer) => {
      secureApi
        .delete(`recommend-session/${session.recommendSessionId}`)
        .then((res) => {
          setRecommendSession(recommendSession.filter((s) => s.session.id !== session.session.id));
        })
        .catch((err) => {
          console.error(err);
        });
    },
    [recommendSession]
  );

  return (
    <>
      <ChooseSessionModal
        onSuccess={async (newRecommend) => {
          const req = await secureApi.post<IRecommendSessionTrainer>("/recommend-session", {
            traineeId: registerPt.trainee.id,
            sessionId: newRecommend.id,
          });
          if (req.status === 201 && req.data) {
            setRecommendSession([...recommendSession, req.data]);
          } else throw new Error("Failed to add recommend session");
        }}
      />
      <SessionLogHistoryModal
        onClick={(sessionLogId) => {
          setCurrentSessionLogId(sessionLogId);
          const modal = HSOverlay.getInstance("#hs-session-log-modal", true) as ICollectionItem<HSOverlay>;
          modal.element.open();
        }}
        traineeId={registerPt.trainee.id}
      />
      <SessionLogModal sessionId={currentSessionLogId} />
      <div className="col-span-full md:col-span-2">
        <TraineeHeader user={registerPt.trainee} />
        <div className="my-4">
          <h3 className="text-2xl font-bold">Nhịp tim trong 30 ngày</h3>
          <HeartBeatChart userId={registerPt.trainee.id} />
        </div>
        <div className="my-4">
          <h3 className="text-2xl font-bold">Bước đi trong 1 tuần</h3>
          <StepChart userId={registerPt.trainee.id} />
        </div>
        <div className="flex flex-row gap-2 my-4">
          <button onClick={openSessionLogHistoryModal} className="rounded-lg bg-blue-500 px-4 py-2 text-white">
            Xem lịch sử luyện tập
          </button>
          <button onClick={openAddRecommendModal} className="rounded-lg bg-blue-500 px-4 py-2 text-white">
            Gợi ý bài tập
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <h3 className="text-2xl font-semibold my-2 text-blue-500 col-span-full">Bài tập bạn gợi ý</h3>
          {recommendSession.map((session) => (
            <RecommendCard onDelete={() => onDeleteRecommend(session)} key={session.recommendSessionId} recommendSession={session} />
          ))}
        </div>
      </div>
    </>
  );
}
