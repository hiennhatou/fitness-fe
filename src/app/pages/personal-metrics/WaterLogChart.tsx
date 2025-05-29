import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";
import { secureApi } from "../../../utils/http";
import { toast } from "react-toastify";
import ReactApexChart from "react-apexcharts";
import { RefreshIcon } from "../../../components/icons";

const getChartOptions = (labels: string[]) => ({
  chart: {
    type: "line" as const,
    toolbar: {
      show: false,
    },
    zoom: {
      enabled: false,
    },
  },
  stroke: {
    curve: "smooth" as const,
    width: 3,
    colors: ["#3B82F6"],
  },
  markers: {
    size: 4,
    colors: ["#3B82F6"],
    strokeWidth: 0,
    hover: {
      size: 6,
    },
  },
  grid: {
    borderColor: "#E5E7EB",
    strokeDashArray: 4,
    xaxis: {
      lines: {
        show: true,
      },
    },
  },
  xaxis: {
    categories: labels,
    labels: {
      style: {
        colors: "#6B7280",
        fontSize: "12px",
      },
    },
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  yaxis: {
    title: {
      text: "Lượng nước (ml)",
      style: {
        fontSize: "14px",
        color: "#6B7280",
      },
    },
    labels: {
      formatter: (value: number) => value.toLocaleString(),
    },
    min: 0,
    tickAmount: 5,
  },
  tooltip: {
    y: {
      formatter: (value: number) => `${value.toLocaleString()} ml`,
    },
  },
});

export default function WaterLogChart() {
  const [isLoading, setIsLoading] = useState(false);
  const [dailyWater, setDailyWater] = useState<[string, number][]>([]);

  const chartSeries = [
    {
      name: "Lượng nước",
      data: dailyWater.map(([, quantity]) => quantity),
    },
  ];

  const chartOptions = useMemo(() => getChartOptions(dailyWater.map(([date]) => dayjs(date, "DD:MM:YYYY").format("DD/MM"))), [dailyWater]);

  const fetchDailyWater = async () => {
    setIsLoading(true);
    try {
      const { data } = await secureApi.get<[string, number][]>("/water-log/daily");

      const waterMap = new Map(data);

      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = dayjs().subtract(i, "day");
        return date.format("DD:MM:YYYY");
      }).reverse();

      const filledData = last7Days.map((date) => [date, waterMap.get(date) || 0] as [string, number]);

      setDailyWater(filledData);
    } catch (error) {
      console.error(error);
      toast.error("Không thể tải dữ liệu thống kê");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDailyWater();
  }, []);

  return (
    <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-gray-700">Thống kê 7 ngày gần nhất</h2>
        <button
          onClick={fetchDailyWater}
          disabled={isLoading}
          className="inline-flex items-center px-3 py-2 gap-1 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
          {isLoading && (
            <div
              className="animate-spin inline-block size-4 border-3 border-current border-t-transparent text-blue-600 rounded-full"
              role="status"
              aria-label="loading">
              <span className="sr-only">Loading...</span>
            </div>
          )}
          {!isLoading && <RefreshIcon className="size-4" />}
          {!isLoading && "Làm mới"}
        </button>
      </div>
      <div className="h-[300px]">
        <ReactApexChart options={chartOptions} series={chartSeries} type="line" height="100%" />
      </div>
    </div>
  );
} 