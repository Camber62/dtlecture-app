import { ControllerBlock } from '@components/blocks/ControllerBlock';
import { Chat } from '@components/chat/Chat';
import { ControlBar } from '@components/core/controls/ControlBar';
import { MainLogo } from '@components/icons/MainLogo';
import { MicrophoneListener } from '@components/MicrophoneListener';
import { AnswerModeScene } from '@components/scenes/AnswerModeScene';
import { ContinueScene } from '@components/scenes/ContinueScene';
import ProgressBar from '@components/scenes/ProgressBar';
import Scene from '@components/scenes/Scene';
import { StartScene } from '@components/scenes/StartScene';
import { Settings } from '@components/settings/Settings';
import Subtitles from '@components/Subtitles';
import { Topics } from '@components/Topics';
import {
  appSliceActions,
  appSliceSelectors,
  fetchAppConfig,
  fetchLectureConfig,
  fetchModSettings,
} from '@features/appSlice';
import { blockSliceActions } from '@features/blockSlice';
import { useAppDispatch } from '@hooks/useAppDispatch';
import { useAppSelector } from '@hooks/useAppSelector';
import { ReplacingVariables } from '@tools/ReplacingVariables';
import { AllBlocksItem } from '@types/block';
import classNames from 'classnames';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { v4 as uuidv4 } from 'uuid';
import { API } from './api';

export const Main = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const [currentMessage, setCurrentMessage] = useState('Test text');

  const answerMode = appSliceSelectors.getAnswerMode(useAppSelector((state) => state.app));
  const { answerVariables, currentBlockId } = useAppSelector((state) => state.block);

  const {
    configStatus,
    modSettingsStatus,
    isStartLecture,
    isContinue,
    isSingleView,
    controllers,
    lectureConfigPath,
    config,
    currentTopicId,
  } = useAppSelector((state) => state.app);

  const hideNavDrawer = useCallback(() => {
    const navDrawer = document.getElementById('nav-drawer');
    const navDrawerButton = document.getElementById('mainNav');
    if (navDrawer && navDrawerButton && !navDrawer.classList.contains('closed')) {
      navDrawerButton.click();
    }
  }, []);

  useEffect(() => {
    hideNavDrawer();
  }, [hideNavDrawer]);

  useEffect(() => {
    API.GetVariables()
      .then((data) => {
        if (data.error) {
          console.error('Error getting variables...', data);
          toast.error(t('Ошибка при получение переменных!'));
          return;
        }
        data.data.map((item) => dispatch(blockSliceActions.setAnswerVariables(item)));
        dispatch(
          blockSliceActions.setAnswerVariables({
            key: '##chat:history##',
            value: '',
          })
        );
      })
      .catch((error) => {
        console.error('API.GetVariables', error);
      });
  }, [dispatch, t]);

  useEffect(() => {
    dispatch(fetchLectureConfig());
    dispatch(appSliceActions.setAttemptId(uuidv4().toString()));
  }, [dispatch]);

  useEffect(() => {
    if (configStatus === 'idle' && lectureConfigPath) {
      dispatch(fetchAppConfig());
    } else {
      dispatch(appSliceActions.setDisabledAllControls());
    }
  }, [dispatch, configStatus, lectureConfigPath]);

  useEffect(() => {
    if (answerMode) {
      dispatch(appSliceActions.changeDisabledControls({ id: 'play', value: false }));
    }
  }, [answerMode, dispatch]);

  useEffect(() => {
    if (modSettingsStatus === 'idle') {
      dispatch(fetchModSettings());
    }
  }, [dispatch, modSettingsStatus]);

  useEffect(() => {
    if (config && answerVariables?.['##user:firstname##']) {
      function getAllJustBlocksTextAsString(blocks: AllBlocksItem[]): string {
        return blocks
          .filter((block) => block.type === 'just')
          .map((block) => block.content.text)
          .join('\n');
      }

      dispatch(
        blockSliceActions.setAnswerVariables({
          key: '##chat:alljust##',
          value: ReplacingVariables(getAllJustBlocksTextAsString(config.blocks), answerVariables),
        })
      );
    }
  }, [config, answerVariables]);

  const showChat = useMemo(() => {
    return controllers.find((item) => item.id === 'chat').active;
  }, [controllers]);

  const showTopics = useMemo(() => {
    return controllers.find((item) => item.id === 'topics').active;
  }, [controllers]);

  const showSettings = useMemo(() => {
    return controllers.find((item) => item.id === 'settings').active;
  }, [controllers]);

  return (
    <div className="base-container">
      <div className="left-panel">
        <div className="left-panel-logo">
          <MainLogo />
        </div>
        <ControlBar />
      </div>

      <div className={classNames('right-panel', { single: isSingleView })}>
        {isSingleView ? (
          <>
            <div style={{ width: '66%' }}>
              {!answerMode && <AnswerModeScene />}
              {!isStartLecture && !isContinue && answerMode && <StartScene />}
              {!isStartLecture && isContinue && answerMode && <ContinueScene />}
            </div>
            {isStartLecture && (
              <div className="position-relative" style={{ minHeight: '720px', maxHeight: '720px' }}>
                <Scene />
                <Subtitles text={currentMessage} />
              </div>
            )}
          </>
        ) : (
          <div
            className="right-panel-adaptive"
            style={{
              display: 'flex',
              // minHeight: "720px",
              // height: "65%",
              height: '60vh',
              gap: '24px',
            }}
          >
            <div
              className="position-relative"
              style={{
                flexBasis: '66%',
                // height: 'fit-content'
              }}
            >
              <Scene />
              <Subtitles text={currentMessage} />
              <ProgressBar config={config} currentBlockId={currentBlockId} />
            </div>
            <div style={{ flexBasis: '34%' }}>
              {showChat && <Chat />}
              {showTopics && <Topics />}
              {showSettings && <Settings />}
            </div>
          </div>
        )}
      </div>
      <ControllerBlock />
      {answerMode === 'voice' && <MicrophoneListener />}
      <ToastContainer theme="dark" />
    </div>
  );
};
