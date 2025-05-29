import { useEffect, useState } from "react";
import dayjs from "dayjs";
import * as yup from "yup";
import { toast } from "react-toastify";
import { secureApi } from "../../../utils/http";
import type { IPrimaryMeasurementLog } from "../../../utils/interfaces";
import { calBmi } from "../../../utils/functions/calBmi";

const measurementSchema = yup.object().shape({
  weight: yup.number().min(0.1).required("Cân nặng không được để trống"),
  height: yup.number().min(0.1).required("Chiều cao không được để trống"),
});

export default function HeightWeightTab() {
  const [latestMeasurement, setLatestMeasurement] = useState<IPrimaryMeasurementLog | null>(null);
  const [weight, setWeight] = useState<string>("");
  const [height, setHeight] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchLatestMeasurement = async () => {
    try {
      const response = await secureApi.get<IPrimaryMeasurementLog>("/primary-measurement/latest");
      setLatestMeasurement(response.data);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu đo lường mới nhất:", error);
    }
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      await measurementSchema.validate({ weight: Number.parseFloat(weight), height: Number.parseFloat(height) });

      const response = await secureApi.post<IPrimaryMeasurementLog>("/primary-measurement", {
        weight: Number.parseFloat(weight),
        height: Number.parseFloat(height),
      });

      setLatestMeasurement(response.data);

      toast.success("Cập nhật chỉ số thành công!");
      setWeight("");
      setHeight("");
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        toast.error(error.message);
      } else {
        toast.error("Có lỗi xảy ra khi cập nhật chỉ số");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLatestMeasurement();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-medium text-blue-500">Chiều cao - cân nặng</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-800">Cân nặng</h3>
          <p className="mt-2 text-3xl font-bold text-blue-600">{latestMeasurement?.weight || "-"} kg</p>
          <p className="text-sm text-gray-500 mt-1">
            Cập nhật lần cuối: {latestMeasurement?.createdOn && dayjs(latestMeasurement.createdOn).format("HH:mm DD/MM/YYYY")}
          </p>
        </div>

        <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-800">Chiều cao</h3>
          <p className="mt-2 text-3xl font-bold text-blue-600">{latestMeasurement?.height || "-"} m</p>
          <p className="text-sm text-gray-500 mt-1">
            Cập nhật lần cuối: {latestMeasurement?.createdOn && dayjs(latestMeasurement.createdOn).format("HH:mm DD/MM/YYYY")}
          </p>
        </div>

        <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-800">Chỉ số BMI</h3>
          <p className="mt-2 text-3xl font-bold text-green-600">
            {latestMeasurement ? Math.round(calBmi(latestMeasurement.weight, latestMeasurement.height).bmi) : "-"}
          </p>
          <p className="text-sm text-gray-500 mt-1">{latestMeasurement ? calBmi(latestMeasurement.weight, latestMeasurement.height).status : "-"}</p>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-medium text-gray-800 mb-4">Cập nhật chỉ số</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">
              Cân nặng (kg)
            </label>
            <input
              type="number"
              id="weight"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="py-2 px-3 block w-full border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Nhập cân nặng"
            />
          </div>

          <div>
            <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-1">
              Chiều cao (m)
            </label>
            <input
              type="number"
              id="height"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className="py-2 px-3 block w-full border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Nhập chiều cao"
            />
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={isLoading}
          type="button"
          className="mt-4 py-2 px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none">
          {isLoading ? "Đang lưu..." : "Lưu thay đổi"}
        </button>
      </div>
    </div>
  );
}
