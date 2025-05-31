import type { IPrimaryMeasurementLog, IUser } from "../../../utils/interfaces";
import anonymousAvatar from "../../../assets/anonymous-avatar.jpg";
import { GenderEnum } from "../../../utils/enums";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { secureApi } from "../../../utils/http";
import { calBmi } from "../../../utils/functions/calBmi";

export function TraineeHeader({ user }: { user: Omit<IUser, "password" | "status" | "username"> }) {
  const [measure, setMeasure] = useState<IPrimaryMeasurementLog | null>(null);

  useEffect(() => {
    secureApi
      .get<IPrimaryMeasurementLog>(`/users/${user.id}/primary-measurement`)
      .then((res) => {
        if (res.status === 200 && res.data) {
          setMeasure(res.data);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }, [user.id]);

  return (
    <div className="flex flex-row items-center gap-4 rounded-xl bg-gray-100 p-6">
      <div className="flex flex-col items-center justify-center">
        <div className="size-40 rounded-full overflow-hidden relative border border-gray-300 bg-white">
          <img src={user.avatar || anonymousAvatar} alt={user.firstName} className="absolute inset-0 h-full object-cover" />
        </div>
      </div>
      <div className="flex flex-col gap-2 basis-full">
        <h2 className="text-3xl font-medium text-blue-700">{[user.lastName, user.middleName, user.firstName].filter(Boolean).join(" ")}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3">
          <div className="flex flex-col gap-2">
            <div className="flex flex-row gap-2">
              <h3 className="font-semibold">Ngày sinh:</h3>
              <p>{(user.birthdate && dayjs(user.birthdate).format("DD/MM/YYYY")) || "--"}</p>
            </div>
            <div className="flex flex-row gap-2">
              <h3 className="font-semibold">Giới tính:</h3>
              <p>{(user.gender && (user.gender === GenderEnum.MALE ? "Nam" : "Nữ")) || "--"}</p>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex flex-row gap-2">
              <h3 className="font-semibold">Chiều cao:</h3>
              <p>{(measure?.height && `${measure.height} m`) || "--"}</p>
            </div>
            <div className="flex flex-row gap-2">
              <h3 className="font-semibold">Cân nặng:</h3>
              <p>{(measure?.weight && `${measure.weight} kg`) || "--"}</p>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex flex-row gap-2">
              <h3 className="font-semibold">BMI:</h3>
              <p>{((measure?.height && measure.weight) && (calBmi(measure.weight, measure.height) || 0).bmi.toFixed(2)) || "--"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
