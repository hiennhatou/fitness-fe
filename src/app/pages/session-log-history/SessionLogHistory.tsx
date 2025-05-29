import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { secureApi } from "../../../utils/http";
import type { ISessionLog } from "../../../utils/interfaces";

export function SessionLogHistory() {
  const [sessionLogs, setSessionLogs] = useState<ISessionLog[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSessionLogs = async () => {
      try {
        const { data } = await secureApi.get<ISessionLog[]>("/session-log");
        setSessionLogs(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchSessionLogs();
  }, []);

  const handleDelete = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await secureApi.delete(`/session-log/${id}`);
      setSessionLogs(sessionLogs.filter(log => log.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="col-span-3 min-md:col-span-2">
      <h1 className="text-2xl font-bold text-blue-400 mb-6">Lịch sử tập luyện</h1>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thời gian bắt đầu
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thời gian kết thúc
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nhịp tim trung bình
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thời gian tập (phút)
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sessionLogs.map((sessionLog) => (
              <tr key={sessionLog.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => navigate(`/session-log/${sessionLog.id}`)}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(sessionLog.startedOn).toLocaleString("vi-VN")}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {sessionLog.finishedOn ? new Date(sessionLog.finishedOn).toLocaleString("vi-VN") : "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {sessionLog.avgHeartRate || "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {sessionLog.periodTime || "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button 
                    onClick={(e) => handleDelete(sessionLog.id, e)}
                    className="text-red-600 hover:text-red-800 focus:outline-none cursor-pointer"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
