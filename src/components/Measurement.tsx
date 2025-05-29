import { useEffect, useState } from "react";
import type { IHeartRate, IPrimaryMeasurementLog, IStepLog, IWaterLog } from "../utils/interfaces";
import { secureApi } from "../utils/http";
import { useUserState } from "../app/globalState";
import { calBmi } from "../utils/functions/calBmi";
import dayjs from "dayjs";

export function Measurement() {
  const user = useUserState((state) => state.user);
  const [heartRate, setHeartRate] = useState<IHeartRate | null>(null);
  const [water, setWater] = useState<number | undefined>();
  const [steps, setSteps] = useState<number | undefined>();
  const [measurement, setMeasurement] = useState<IPrimaryMeasurementLog | null>(null);

  useEffect(() => {
    secureApi.get("/primary-measurement/latest").then((res) => {
      setMeasurement(res.data);
    });
    secureApi.get("/heart-rate/latest").then((res) => {
      setHeartRate(res.data);
    });
    secureApi.get("/water-log/latest").then((res) => {
      setWater((res.data as [number, number])[1]);
    });
    secureApi.get("/step-log/latest").then((res) => {
      setSteps((res.data as [number, number])[1]);
    });
  }, [])

  return (
    <div>
      <h1 className="text-2xl font-[Mulish] font-semibold text-blue-400 mb-4">Chỉ số sức khỏe hiện tại</h1>
      <div className="grid lg:grid-cols-2 md:grid-cols-1 min-sm:grid-cols-2 gap-3">
        <div className="flex flex-col items-center rounded-2xl border-[1px] border-gray-300 px-3.5 py-2">
          <h1 className="text-sm text-gray-500">Nhịp tim</h1>
          <span className="text-4xl">{heartRate?.heartRate || "--"}</span>
          <span className="text-xs text-gray-500 text-center">bpm<br/>{heartRate?.createdOn ? dayjs(heartRate.createdOn).format("DD/MM/YYYY HH:mm:SS") : "--"}</span>
        </div>
        <div className="flex flex-col items-center rounded-2xl border-[1px] border-gray-300 px-3.5 py-2">
          <h1 className="text-sm text-gray-500">Lượng nước</h1>
          <span className="text-4xl">{water || "--"}</span>
          <span className="text-sm text-gray-500">ml</span>
        </div>
        <div className="flex flex-col items-center rounded-2xl border-[1px] border-gray-300 px-3.5 py-2">
          <h1 className="text-sm text-gray-500">Bước đi</h1>
          <span className="text-4xl">{steps || "--"}</span>
          <span className="text-sm text-gray-500">bước</span>
        </div>
        <div className="flex flex-col items-center rounded-2xl border-[1px] border-gray-300 px-3.5 py-2">
          <h1 className="text-sm text-gray-500">BMI</h1>
          <span className="text-4xl">{measurement && calBmi(measurement.weight, measurement.height).bmi.toFixed(1) || "--"}</span>
          <span className="text-sm text-gray-500">{measurement && dayjs(measurement.createdOn).format("DD/MM/YYYY")}</span>
        </div>
      </div>
    </div>
  );
}
