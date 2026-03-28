import ImageScene from '@components/scenes/ImageScene';
import { useAppSelector } from '@hooks/useAppSelector';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  doughnutChartMockData,
  imageSceneMockData,
  multiAxisLineChartMockData,
  tinyBarChartMockData,
  videoSceneMockData,
} from './mocks';
import VideoScene from './VideoScene';

export const imageSceneConfig = {
  type: 'image' as 'image',
  config: imageSceneMockData,
};

export const videoSceneConfig = {
  type: 'video' as 'video',
  config: videoSceneMockData,
};

// Обновление типа конфигурации
export const tinyBarChartSceneConfig = {
  type: 'TinyBarChart' as 'TinyBarChart',
  config: tinyBarChartMockData,
};

export const multiAxisLineChartSceneConfig = {
  type: 'MultiAxisLineChart' as 'MultiAxisLineChart',
  config: multiAxisLineChartMockData,
};

export const doughnutChartSceneConfig = {
  type: 'DoughnutChart' as 'DoughnutChart',
  config: doughnutChartMockData,
};
const Scene = () => {
  const { t } = useTranslation();

  const { answerMode, needAnswer } = useAppSelector((state) => state.app);
  const { currentBlock } = useAppSelector((state) => state.block);
  const { isRecording, isRecognize } = useAppSelector((state) => state.microphone);

  return (
    <div className="d-flex flex-column align-items-center h-100 w-100 position-relative">
      {currentBlock && currentBlock.content.scene.type === 'image' && (
        <ImageScene
          src={currentBlock.content.scene.url}
          animation={currentBlock.content.scene?.animation ?? 'animate__fadeIn'}
        />
      )}
             {currentBlock && currentBlock.content.scene.type === 'video' && (
         <VideoScene
           config={{
             src: currentBlock.content.scene.url,
             audio: currentBlock.content.scene.audio,
             muted: !currentBlock.content.scene.audio,
             controls: false,
             volume: 0.5
           }}
         />
       )}
      {answerMode === 'voice' && needAnswer && (
        <div
          style={{
            position: 'absolute',
            backgroundColor: '#0B0D11CC',
            display: 'flex',
            fontSize: '32px',
            maxWidth: '85%',
            padding: '1rem',
            borderRadius: '10px',
            bottom: '1rem',
            fontWeight: '400',
            zIndex: 1025,
          }}
        >
          {isRecording && <div>{t('chat_input.hint_text_2')}</div>}
          {isRecognize && <div>{t('chat_input.hint_text_3')}</div>}
          {!isRecording && !isRecognize && (
            <div>
              <span style={{ color: '#74D414' }}>{t('chat_input.hint_text_4')}</span>
              {t('chat_input.hint_text_5')}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Scene;
