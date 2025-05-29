import { useState, type Dispatch, type SetStateAction } from "react";
import type { ISessionLog } from "../../../utils/interfaces";
import { secureApi } from "../../../utils/http";

export function InputSessionResult({
  setSessionLog,
  sessionLog,
}: {
  sessionLog: ISessionLog;
  setSessionLog: Dispatch<SetStateAction<ISessionLog | undefined>>;
}) {
  const finishSession = async () => {
    try {
      const avgHeartRateNumber = Number(avgHeartRate);
      const periodTimeNumber = Number(periodTime);

      if (isNaN(avgHeartRateNumber) || isNaN(periodTimeNumber) || avgHeartRateNumber <= 0 || periodTimeNumber <= 0) return;

      const { data } = await secureApi.post(`/session-log/${sessionLog.id}/finish`, {
        avgHeartRate: avgHeartRateNumber,
        periodTime: periodTimeNumber,
      });
      setSessionLog({
        ...sessionLog,
        ...data,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const [avgHeartRate, setAvgHeartRate] = useState<string>("");
  const [periodTime, setPeriodTime] = useState<string>("");

  return (
    <div className="flex flex-col gap-3">
      <div>
        <label htmlFor="avgHeartRate" className="block text-sm font-medium">
          Nhịp tim trung bình
        </label>
        <input
          type="number"
          id="avgHeartRate"
          value={avgHeartRate}
          onChange={(e) => setAvgHeartRate(e.target.value)}
          className="py-3 px-4 block w-full border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
          placeholder="Nhập nhịp tim trung bình"
        />
      </div>
      <div>
        <label htmlFor="periodTime" className="block text-sm font-medium">
          Thời gian luyện tập
        </label>
        <input
          type="number"
          id="periodTime"
          value={periodTime}
          onChange={(e) => setPeriodTime(e.target.value)}
          className="py-3 px-4 block w-full border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
          placeholder="Nhập thời gian luyện tập (phút)"
        />
      </div>
      <button
        onClick={finishSession}
        className="w-full rounded-full px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-400 cursor-pointer">
        Hoàn thành
      </button>
    </div>
  );
}
