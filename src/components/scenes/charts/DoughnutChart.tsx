import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { ArcElement, Chart as ChartJS, Tooltip, Legend, Title, ChartData } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, Title);

interface DoughnutChartProps {
    data: ChartData<'doughnut'>;

}

const DoughnutChart: React.FC<DoughnutChartProps> = ({ data }) => {
    // Опции графика
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            tooltip: {
                enabled: true,
            },
        },
    };

    return (
        <Doughnut data={data} options={options} />
    );
};

export default DoughnutChart;
