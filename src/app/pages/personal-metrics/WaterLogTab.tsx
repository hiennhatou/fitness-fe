import { useEffect, useState, useMemo, Fragment } from "react";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import { secureApi } from "../../../utils/http";
import type { IWaterLog } from "../../../utils/interfaces";
import { Trash, UploadIcon } from "../../../components/icons";
import WaterLogChart from "./WaterLogChart";

export default function WaterLogTab() {
  const [waterLogs, setWaterLogs] = useState<IWaterLog[]>([]);
  const [newQuantity, setNewQuantity] = useState<string>("");

  useEffect(() => {
    const fetchWaterLogs = async () => {
      try {
        const { data } = await secureApi.get<IWaterLog[]>("/water-log");
        setWaterLogs(data);
      } catch (error) {
        console.error(error);
        toast.error("Không thể tải dữ liệu lượng nước uống");
      }
    };

    fetchWaterLogs();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const quantity = parseInt(newQuantity);
    if (isNaN(quantity) || quantity <= 0) {
      toast.error("Vui lòng nhập lượng nước hợp lệ");
      return;
    }

    try {
      const { data } = await secureApi.post<IWaterLog>("/water-log", { quantity });
      setWaterLogs([data, ...waterLogs]);
      setNewQuantity("");
      toast.success("Đã lưu lượng nước uống thành công");
    } catch (error) {
      console.error(error);
      toast.error("Không thể lưu lượng nước uống");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await secureApi.delete(`/water-log/${id}`);
      setWaterLogs(waterLogs.filter((log) => log.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const groupedLogs = useMemo(() => {
    return waterLogs.reduce((acc, log) => {
      const date = dayjs(log.createdOn).format("YYYY-MM-DD");
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(log);
      return acc;
    }, {} as Record<string, IWaterLog[]>);
  }, [waterLogs]);

  return (
    <div className="w-full">
      <h1 className="text-2xl font-medium text-blue-500">Lượng nước uống</h1>

      <WaterLogChart />

      <form onSubmit={handleSubmit} className="mt-6 mb-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col sm:flex-row gap-6 items-end">
          <div className="flex-1">
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
              Nhập lượng nước uống
            </label>
            <div className="relative rounded-md shadow-sm">
              <input
                type="number"
                id="quantity"
                value={newQuantity}
                onChange={(e) => setNewQuantity(e.target.value)}
                className="block w-full rounded-lg border-gray-300 pl-4 pr-12 py-3 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 sm:text-sm transition-colors"
                placeholder="Ví dụ: 200"
                min="1"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <span className="text-gray-500 sm:text-sm">ml</span>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lượng nước</th>
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">{log.quantity.toLocaleString()} ml</td>
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
                      {logs.reduce((sum, log) => sum + log.quantity, 0).toLocaleString()} ml
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
