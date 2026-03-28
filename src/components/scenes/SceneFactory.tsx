import React from 'react';
import ImageScene from './ImageScene';
import VideoScene from './VideoScene';
import ChartFactory from './ChartFactory';
import {ChartConfig, ImageSceneConfig, SceneType, VideoSceneConfig} from './type';

const sceneFactory = (type: SceneType, config: ImageSceneConfig | VideoSceneConfig | ChartConfig) => {

    switch (type) {
        case 'video':
            return <VideoScene config={config as VideoSceneConfig} />;
        case 'DoughnutChart':
        case 'TinyBarChart':
        case 'MultiAxisLineChart':
            return <ChartFactory type={type as 'DoughnutChart' | 'TinyBarChart' | 'MultiAxisLineChart'} config={config as ChartConfig} />;
        default:
            return <ImageScene {...(config as ImageSceneConfig)} />;
    }
};

interface SceneProps {
    type: SceneType;
    config: ImageSceneConfig | VideoSceneConfig | ChartConfig;
}

const SceneFactory: React.FC<SceneProps> = ({ type, config }) => {


    return sceneFactory(type, config);
};

export default SceneFactory;
