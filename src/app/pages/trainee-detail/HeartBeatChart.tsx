import { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import dayjs from 'dayjs';
import type { ApexOptions } from 'apexcharts';
import { secureApi } from '../../../utils/http';

interface HeartRateData {
    timestamp: number;
    avgHeartRate: number;
}

export function HeartBeatChart({ userId }: { userId: number }) {
    const [heartRateData, setHeartRateData] = useState<HeartRateData[]>([]);

    useEffect(() => {
        const fetchHeartRateData = async () => {
            try {
                const response = await secureApi.get(`/users/${userId}/heart-rate`);
                const data = response.data as [number, number][];
                
                const formattedData = data.map(([timestamp, avgHeartRate]) => ({
                    timestamp,
                    avgHeartRate: Number.parseFloat(avgHeartRate.toFixed(2))
                }));
                
                setHeartRateData(formattedData);
            } catch (error) {
                console.error('Error fetching heart rate data:', error);
            }
        };

        fetchHeartRateData();
    }, [userId]);

    const last30Days = Array.from({ length: 30 }, (_, i) => {
        const date = dayjs().subtract(29 - i, 'day');
        return {
            timestamp: date.valueOf(),
            date: date.format('DD/MM')
        };
    });

    const chartData = last30Days.map(day => {
        const existingData = heartRateData.find(
            data => dayjs(data.timestamp).format('DD/MM') === day.date
        );
        return {
            x: day.date,
            y: existingData ? existingData.avgHeartRate : 0
        };
    });

    const options: ApexOptions = {
        chart: {
            type: 'line',
            toolbar: {
                show: false
            }
        },
        stroke: {
            curve: 'smooth',
            width: 2
        },
        xaxis: {
            type: 'category',
            labels: {
                rotate: -45,
                style: {
                    fontSize: '12px'
                }
            }
        },
        yaxis: {
            title: {
                text: 'Nhịp tim trung bình'
            }
        },
        tooltip: {
            y: {
                formatter: (value: number) => `${value} bpm`
            }
        },
        colors: ['#FF4560']
    };

    const series = [{
        name: 'Nhịp tim',
        data: chartData
    }];

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