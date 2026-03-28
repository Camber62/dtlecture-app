import React from 'react';
import { SceneType } from './type';
import MultiAxisLineChart from './charts/MultiAxisLineChart';
import TinyBarChart from './charts/TinyBarChart';
import DoughnutChart from './charts/DoughnutChart';
import { ChartConfig, TinyBarChartConfig, MultiAxisLineChartConfig, DoughnutChartConfig } from './type';

const chartFactory = (type: SceneType, config: ChartConfig) => {

    switch (type) {
        case 'TinyBarChart':
            const tinyBarConfig = config as TinyBarChartConfig;
            return <TinyBarChart data={tinyBarConfig.data} />;
        case 'MultiAxisLineChart':
            const multiAxisConfig = config as MultiAxisLineChartConfig;
            return <MultiAxisLineChart data={multiAxisConfig.data} />;
        case 'DoughnutChart':
            const doughnutConfig = config as DoughnutChartConfig;
            return <DoughnutChart data={doughnutConfig.data}/>;
        default:
            return null;
    }
};

interface SceneProps {
    type: SceneType;
    config: ChartConfig;
}

const SceneFactory: React.FC<SceneProps> = ({ type, config }) => {
    console.log("Rendering scene of type:", type);
    console.log("Configuration:", config);

    return chartFactory(type, config);
};

export default SceneFactory;
