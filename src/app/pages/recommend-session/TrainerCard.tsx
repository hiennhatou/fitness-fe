import { useEffect, useState } from "react";
import type { ITrainer } from "../../../utils/interfaces";
import { secureApi } from "../../../utils/http";
import anonymousAvatar from "../../../assets/anonymous-avatar.jpg";

export function TrainerCard() {
  const [trainer, setTrainer] = useState<ITrainer | null>(null);

  useEffect(() => {
    secureApi
      .get<ITrainer>("/me/pt")
      .then((res) => {
        if (res.status === 200) setTrainer(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const onCancel = () => {
    secureApi
      .delete("/register-pt")
      .then((res) => {
        setTrainer(null);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <div className="rounded-xl bg-gray-100 p-4 flex flex-col gap-2">
      <div className="flex items-center justify-center">
        <div className="size-20 rounded-full overflow-hidden relative border border-gray-300 bg-white">
          <img src={trainer?.avatar || anonymousAvatar} alt={trainer?.firstName} className="absolute inset-0 h-full object-cover" />
        </div>
      </div>
      {trainer && (
        <>
          <div className="flex flex-col gap-2 justify-center items-center">
            <h1 className="text-2xl font-semibold">{[trainer.lastName, trainer.middleName, trainer.firstName].filter(Boolean).join(" ")}</h1>
          </div>
          <div className="flex justify-center">
            <button onClick={onCancel} className="bg-red-400 text-white px-3 py-1 rounded-md text-sm">Hủy đăng ký</button>
          </div>
        </>
      )}
      {!trainer && <div className="text-sm text-gray-500 text-center">Bạn chưa có huấn luyện viên nào</div>}
    </div>
  );
}
