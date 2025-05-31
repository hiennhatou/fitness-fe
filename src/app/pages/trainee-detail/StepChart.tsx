import { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import dayjs from 'dayjs';
import type { ApexOptions } from 'apexcharts';
import { secureApi } from '../../../utils/http';

interface StepLog {
  timestamp: number;
  steps: number;
}

export function StepChart({ userId }: { userId: number }) {
  const [stepData, setStepData] = useState<StepLog[]>([]);

  useEffect(() => {
    const fetchStepData = async () => {
      try {
        const response = await secureApi.get(`/users/${userId}/step-log/daily`);
        const data = response.data as [number, number][];
        
        // Chuyển đổi dữ liệu thành định dạng cần thiết
        const formattedData = data.map(([timestamp, steps]) => ({
          timestamp,
          steps
        }));
        
        setStepData(formattedData);
      } catch (error) {
        console.error('Error fetching step data:', error);
      }
    };

    fetchStepData();
  }, [userId]);

  // Tạo mảng 7 ngày gần nhất
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = dayjs().subtract(6 - i, 'day');
    return {
      timestamp: date.startOf('day').valueOf(),
      steps: 0
    };
  });

  // Kết hợp dữ liệu thực tế với các ngày không có dữ liệu
  const chartData = last7Days.map(day => {
    const existingData = stepData.find(
      item => dayjs(item.timestamp).format('YYYY-MM-DD') === dayjs(day.timestamp).format('YYYY-MM-DD')
    );
    return existingData || day;
  });

  const options: ApexOptions = {
    chart: {
      type: 'line',
      toolbar: {
        show: false
      }
    },
    xaxis: {
      categories: chartData.map(item => dayjs(item.timestamp).format('DD/MM')),
      labels: {
        style: {
          colors: '#666'
        }
      }
    },
    yaxis: {
      title: {
        text: 'Số bước chân'
      },
      labels: {
        style: {
          colors: '#666'
        }
      },
      min: 0,
      tickAmount: 5
    },
    stroke: {
      curve: 'smooth',
      width: 2
    },
    markers: {
      size: 4
    },
    colors: ['#4CAF50'],
    grid: {
      borderColor: '#f1f1f1'
    },
    tooltip: {
      y: {
        formatter: (value: number) => `${value.toLocaleString()} bước`
      }
    }
  };

  const series = [
    {
      name: 'Bước chân',
      data: chartData.map(item => item.steps)
    }
  ];

  return (
    <div>
      <ReactApexChart
        options={options}
        series={series}
        type="line"
        height={350}
      />
    </div>
  );
}