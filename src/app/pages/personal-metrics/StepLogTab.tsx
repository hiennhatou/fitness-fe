import { useEffect, useState, useMemo, Fragment } from "react";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import { secureApi } from "../../../utils/http";
import type { IStepLog } from "../../../utils/interfaces";
import { Trash, UploadIcon } from "../../../components/icons";
import StepLogChart from "./StepLogChart";

export default function StepLogTab() {
  const [stepLogs, setStepLogs] = useState<IStepLog[]>([]);
  const [newSteps, setNewSteps] = useState<string>("");

  useEffect(() => {
    const fetchStepLogs = async () => {
      try {
        const { data } = await secureApi.get<IStepLog[]>("/step-log");
        setStepLogs(data);
      } catch (error) {
        console.error(error);
        toast.error("Không thể tải dữ liệu số bước đi");
      }
    };

    fetchStepLogs();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const steps = parseInt(newSteps);
    if (isNaN(steps) || steps <= 0) {
      toast.error("Vui lòng nhập số bước hợp lệ");
      return;
    }

    try {
      const { data } = await secureApi.post<IStepLog>("/step-log", { step: steps });
      setStepLogs([data, ...stepLogs]);
      setNewSteps("");
      toast.success("Đã lưu số bước đi thành công");
    } catch (error) {
      console.error(error);
      toast.error("Không thể lưu số bước đi");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await secureApi.delete(`/step-log/${id}`);
      setStepLogs(stepLogs.filter((log) => log.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const groupedLogs = useMemo(() => {
    return stepLogs.reduce((acc, log) => {
      const date = dayjs(log.createdOn).format("YYYY-MM-DD");
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(log);
      return acc;
    }, {} as Record<string, IStepLog[]>);
  }, [stepLogs]);

  return (
    <div className="w-full">
      <h1 className="text-2xl font-medium text-blue-500">Số bước đi</h1>

      <StepLogChart />

      <form onSubmit={handleSubmit} className="mt-6 mb-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col sm:flex-row gap-6 items-end">
          <div className="flex-1">
            <label htmlFor="steps" className="block text-sm font-medium text-gray-700 mb-2">
              Nhập số bước đi
            </label>
            <div className="relative rounded-md shadow-sm">
              <input
                type="number"
                id="steps"
                value={newSteps}
                onChange={(e) => setNewSteps(e.target.value)}
                className="block w-full rounded-lg border-gray-300 pl-4 pr-12 py-3 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 sm:text-sm transition-colors"
                placeholder="Ví dụ: 1000"
                min="1"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <span className="text-gray-500 sm:text-sm">bước</span>
              </div>
            </div>
          </div>
          <button
            type="submit"
            className="w-full sm:w-auto inline-flex justify-center items-center rounded-lg border border-transparent bg-blue-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors">
            <UploadIcon className="h-5 w-5 mr-2" />
            Lưu
          </button>
        </div>
      </form>

      <div className="mt-4">
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thời gian</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số bước</th>
                <th></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {Object.entries(groupedLogs).map(([date, logs]) => (
                <Fragment key={date}>
                  {logs.map((log, index) => (
                    <tr key={log.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index === 0 ? dayjs(date).format("DD/MM/YYYY") : ""}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{dayjs(log.createdOn).format("HH:mm")}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">{log.step.toLocaleString()} bước</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        <button type="button" className="cursor-pointer rounded-full p-2 bg-red-50 hover:bg-red-100" onClick={() => handleDelete(log.id)}>
                          <Trash className="size-4 text-red-500" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-gray-50 font-medium">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"></td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">Tổng cộng</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                      {logs.reduce((sum, log) => sum + log.step, 0).toLocaleString()} bước
                    </td>
                  </tr>
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
