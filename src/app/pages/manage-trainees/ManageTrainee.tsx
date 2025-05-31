import { useEffect, useState } from "react";
import { secureApi } from "../../../utils/http";
import type { ITrainee } from "../../../utils/interfaces";
import { useUserState } from "../../globalState";
import { UserRoleEnum } from "../../../utils/enums";
import { HttpError } from "../../../utils/errors";
import { TraineeCard } from "./TraineeCard";

export function ManageTrainees() {
  const [trainees, setTrainees] = useState<ITrainee[]>([]);
  const user = useUserState((state) => state.user);
  const isLoadedUser = useUserState((state) => state.isLoaded);

  useEffect(() => {
    if (isLoadedUser && user) {
      if (user.role === UserRoleEnum.ROLE_TRAINER)
        secureApi
          .get("/me/trainees")
          .then((res) => {
            setTrainees(res.data);
          })
          .catch((error) => {
            console.error(error);
          });
      else throw new HttpError(403, "Bạn không có quyền truy cập trang này");
    }
  }, [isLoadedUser, user]);

  const onDelete = async (registerId: number) => {
    try {
      await secureApi.delete(`/register-pt/${registerId}`);
      setTrainees(trainees.filter((trainee) => trainee.registerId !== registerId));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="col-span-full md:col-span-2">
      <h1 className="text-2xl font-medium text-blue-400">Quản lý học viên</h1>
      <div className="flex flex-col gap-4 my-3">
        {trainees.map((trainee) => (
          <TraineeCard
            onDelete={(e) => {
              e.stopPropagation();
              onDelete(trainee.registerId);
            }}
            key={trainee.id}
            trainee={trainee}
          />
        ))}
      </div>
    </div>
  );
}
