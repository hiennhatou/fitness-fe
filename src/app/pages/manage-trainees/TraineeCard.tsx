import { useNavigate } from "react-router";
import type { ITrainee } from "../../../utils/interfaces";
import { Trash } from "../../../components/icons";
import anonymousAvatar from "../../../assets/anonymous-avatar.jpg";

export function TraineeCard({ trainee, onDelete }: { trainee: ITrainee; onDelete: (e: React.MouseEvent<HTMLDivElement>) => void }) {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => {
        navigate(`/trainees/${trainee.registerId}`);
      }}
      className="w-full py-3 px-4 rounded-xl bg-gray-200 overflow-hidden flex flex-row items-center gap-4">
      <div>
        <div className="cursor-pointer size-16 rounded-full overflow-hidden relative border border-gray-300 bg-white">
          <img src={trainee.avatar || anonymousAvatar} alt={trainee.firstName} className="absolute inset-0 h-full object-cover" />
        </div>
      </div>
      <div className="basis-full">
        <h2 className="cursor-pointer text-lg font-medium text-blue-700">
          {trainee.firstName} {trainee.lastName}
        </h2>
      </div>
      <div className="cursor-pointer bg-red-100 rounded-full p-1 hover:bg-red-200" onClick={onDelete}>
        <Trash className="size-7 text-red-500" />
      </div>
    </div>
  );
}
