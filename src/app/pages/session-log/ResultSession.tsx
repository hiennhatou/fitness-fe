import { useEffect, useState } from "react";
import { calBurnedCalories } from "../../../utils/functions/calBurnedCalories";
import type { IPrimaryMeasurementLog, ISessionLog } from "../../../utils/interfaces";
import { useUserState } from "../../globalState";
import { secureApi } from "../../../utils/http";
import dayjs from "dayjs";
import { HSOverlay } from "preline";
import { QuestionIcon } from "../../../components/icons";
import { MathJax } from "better-react-mathjax";

export function ResultSession({ sessionLog }: { sessionLog: ISessionLog }) {
  const user = useUserState((state) => state.user);
  const [primaryMeasurementLog, setPrimaryMeasurementLog] = useState<IPrimaryMeasurementLog | null>(null);

  useEffect(() => {
    if (user) {
      secureApi
        .get<IPrimaryMeasurementLog>(`primary-measurement/latest`)
        .then((res) => {
          if (res.status === 200) setPrimaryMeasurementLog(res.data);
        })
        .catch((err) => console.log(err));
      HSOverlay.autoInit();
    }
  }, [user]);

  return (
    <div className="flex flex-col gap-3">
      <div>
        <label className="block text-sm font-medium">Nhịp tim trung bình</label>
        <p className="py-3 px-4 text-sm text-gray-600">{sessionLog.avgHeartRate} nhịp/phút</p>
      </div>
      <div>
        <label className="block text-sm font-medium">Thời gian luyện tập</label>
        <p className="py-3 px-4 text-sm text-gray-600">{sessionLog.periodTime} phút</p>
      </div>
      {user && (
        <div>
          <div className="flex items-center gap-1">
            <label className="text-sm font-medium">Lượng calo tiêu thụ:</label>
            <div className="hs-tooltip [--trigger:click] [--placement:bottom] inline-block">
              <div className="hs-tooltip-toggle block text-center">
                <button
                  type="button"
                  className="flex justify-center items-center size-6 text-sm font-semibold rounded-full border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-200 active:bg-gray-300 focus:outline-hidden focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none">
                  <QuestionIcon className="size-full" />
                </button>
                <div
                  className="hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible hidden opacity-0 transition-opacity absolute invisible z-10 max-w-xs bg-white border border-gray-100 text-start rounded-lg shadow-md"
                  role="tooltip">
                  <div className="py-3 px-4 text-sm text-gray-600">
                    <p className="font-extrabold">Công thức tính Calo tiêu thụ:</p>
                    <dl>
                      <dt className="font-bold first:pt-0">Nam:</dt>
                      <MathJax>{"\\(t \\frac {0.6309 HR + 0.1988 W + 0.2017 A - 55.0969) }{4.184}\\)"}</MathJax>
                      <dt className="font-bold first:pt-0">Nữ:</dt>
                      <MathJax>{"\\(t \\frac {0.4472 HR - 0.1263 W + 0.074 A - 20.4022) }{4.184}\\)"}</MathJax>
                      <p className="font-semibold">Trong đó:</p>
                      <p>t: Thời gian tập luyện (phút)</p>
                      <p>HR: Nhịp tim trung bình (nhịp/phút)</p>
                      <p>W: Cân nặng (kg)</p>
                      <p>A: Tuổi</p>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <p className="py-3 px-4 text-sm text-gray-600">
            {primaryMeasurementLog && user.gender && user.birthdate
              ? `${Math.round(
                  calBurnedCalories(
                    sessionLog.avgHeartRate,
                    sessionLog.periodTime,
                    primaryMeasurementLog.weight,
                    -dayjs(user.birthdate).diff(dayjs(), "y"),
                    user.gender
                  ) * 1000
                )} calo`
              : "Hãy cập thông tin cá nhân: giới tính, cân nặng, ngày sinh để tính toán lượng calo tiêu thụ"}
          </p>
        </div>
      )}
    </div>
  );
}
