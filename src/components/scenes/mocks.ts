// Моковые данные для MultiAxisLineChart
import {
    DoughnutChartConfig,
    ImageSceneConfig,
    MultiAxisLineChartConfig,
    TinyBarChartConfig,
    VideoSceneConfig
} from "./type";


// Моковые данные для изображения
export const imageSceneMockData: ImageSceneConfig = {
    src: 'https://service.deeptalk.tech/cdn/demo/sergn/tttt.png',
    alt: 'Placeholder Image'
};

// Моковые данные для видео
export const videoSceneMockData: VideoSceneConfig = {
    src: 'https://www.w3schools.com/html/mov_bbb.mp4',
    autoplay: true,
    loop: false,
    muted: false,
    controls: true,
    volume: 1
};



// Моковые данные для MultiAxisLineChart
export const multiAxisLineChartMockData: MultiAxisLineChartConfig = {
    data: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [
            {
                label: 'Dataset 1',
                data: [65, 59, 80, 81, 56, 55, 40],
                borderColor: 'rgba(75,192,192,1)',
                backgroundColor: 'rgba(75,192,192,0.2)',
            }
        ]
    }
};

// Моковые данные для TinyBarChart
export const tinyBarChartMockData: TinyBarChartConfig = {
    data: {
        labels: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
        datasets: [
            {
                label: 'Tiny Bar Dataset',
                data: [12, 19, 3, 5, 2, 3, 7],
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
            }
        ]
    }
};

// Моковые данные для DoughnutChart
export const doughnutChartMockData: DoughnutChartConfig = {
    data: {
        labels: ['Red', 'Blue', 'Yellow'],
        datasets: [
            {
                label: 'My First Dataset',
                data: [300, 50, 100],
                backgroundColor: [
                    'rgb(255, 99, 132)',
                    'rgb(54, 162, 235)',
                    'rgb(255, 205, 86)',
                ],
            },
        ],
        hoverOffset: 4,
    },
};

// Конфигурации для сцен
export const multiAxisLineChartSceneConfig = {
    type: 'MultiAxisLineChart',
    config: multiAxisLineChartMockData
};

export const tinyBarChartSceneConfig = {
    type: 'TinyBarChart',
    config: tinyBarChartMockData
};

export const doughnutChartSceneConfig = {
    type: 'DoughnutChart',
    config: doughnutChartMockData
};
