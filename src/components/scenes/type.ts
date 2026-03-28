// Типы для разных типов сцен
export type SceneType = 'image' | 'video' | 'MultiAxisLineChart' | 'TinyBarChart' | 'DoughnutChart';






// Конфигурация для изображения
export interface ImageSceneConfig {
    src: string;
    alt?: string;
}

// Конфигурация для видео
export interface VideoSceneConfig {
    src: string;
    autoplay?: boolean;
    loop?: boolean;
    muted?: boolean;
    controls?: boolean;
    volume?: number;
}

// src/type.ts

// Типы для разных типов графиков
export interface TinyBarChartConfig {
    data: {
        labels: string[];
        datasets: {
            label: string;
            data: number[];
            backgroundColor: string;
        }[];
    };
    options?: any;
}

export interface MultiAxisLineChartConfig {
    data: {
        labels: string[],
        datasets: [
            {
                label: string,
                data: number[],
                borderColor: string,
                backgroundColor: string,
            }
        ]
    }
}

export interface DoughnutChartConfig {
    data: {
        labels: string[];
        datasets: {
            label: string;
            data: number[];
            backgroundColor: string[];
        }[];
        hoverOffset: number;
    };
    options?: any;
}



// Объединённый тип для всех графиков
export type ChartConfig =
    | TinyBarChartConfig
    | MultiAxisLineChartConfig
    | DoughnutChartConfig;
