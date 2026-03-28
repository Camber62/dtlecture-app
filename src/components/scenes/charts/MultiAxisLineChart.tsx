import React from 'react';
import { Line } from 'react-chartjs-2';
import { ChartData, ChartOptions, Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Регистрация необходимых компонентов Chart.js
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

interface MultiAxisLineChartConfig {
    data: ChartData<'line'>;

}

const MultiAxisLineChart: React.FC<MultiAxisLineChartConfig> = ({ data }) => {
    // Опции для графика
    const options: ChartOptions<'line'> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            tooltip: {
                enabled: true,
            },
            legend: {
                position: 'top' as const,
            },
        },
    };

    return (
        <Line data={data} options={options} />
    );
};

export default MultiAxisLineChart;
