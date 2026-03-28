import { appSliceActions, appSliceSelectors } from '@features/appSlice';
import { chatSliceActions } from '@features/chatSlice';
import {
  microphoneChangeIsEnabled,
  microphoneChangeIsRecording,
  microphoneChangeIsRun,
  microphoneRunRecognize,
  setResetRecognizeAction,
} from '@features/MicrophoneSlice';
import { useAppDispatch } from '@hooks/useAppDispatch';
import { useAppSelector } from '@hooks/useAppSelector';
import { useKeyboardPress } from '@hooks/useKeyboardPress';
import { useMicrophone } from '@hooks/useMicrophone';
import React, { useEffect, useRef } from 'react';

export const MicrophoneListener = () => {
  const dispatch = useAppDispatch();
  const { isRun, isMicrophoneEnabled, isRecognize, recognizeResult } = useAppSelector(
    (state) => state.microphone
  );
  const { needAnswer, config } = useAppSelector((state) => state.app);
  const isSpacePressed = useKeyboardPress('Space');

  const answerMode = appSliceSelectors.getAnswerMode(useAppSelector((state) => state.app));
  const prevAnswerModeRef = useRef(answerMode);

  const { isRecording, recordingBlob, cleanup, isInitialized } = useMicrophone(
    isRun && isMicrophoneEnabled
  );

  useEffect(() => {
    if (recognizeResult) {
      dispatch(appSliceActions.setAnswerMessage(recognizeResult));
      dispatch(chatSliceActions.addMessage({ text: recognizeResult, system: false }));
      dispatch(setResetRecognizeAction());
    }
  }, [dispatch, recognizeResult]);

  useEffect(() => {
    const shouldRunMicrophone =
      isSpacePressed && isMicrophoneEnabled && !isRecognize && answerMode === 'voice';
    dispatch(microphoneChangeIsRun(shouldRunMicrophone));
  }, [isSpacePressed, isMicrophoneEnabled, isRecognize, dispatch, needAnswer, answerMode]);

  useEffect(() => {
    dispatch(microphoneChangeIsRecording(isRecording));
  }, [isRecording, dispatch]);

  useEffect(() => {
    if (recordingBlob instanceof Blob) {
      dispatch(
        microphoneRunRecognize({
          content: recordingBlob,
          recognizeSettings: config.recognizeSettings || {},
        })
      );
    }
  }, [config.recognizeSettings, dispatch, recordingBlob]);

  useEffect(() => {
    if (answerMode === 'voice') {
      dispatch(microphoneChangeIsEnabled(needAnswer));
    } else {
      dispatch(microphoneChangeIsEnabled(false));
    }
  }, [dispatch, needAnswer, answerMode]);

  useEffect(() => {
    if (prevAnswerModeRef.current === 'voice' && answerMode === 'text') {
      cleanup();
    }
    prevAnswerModeRef.current = answerMode;
  }, [answerMode, cleanup]);

  useEffect(() => {
    if (answerMode === 'voice') {
      console.log('Микрофон инициализирован:', isInitialized);
    }
  }, [isInitialized, answerMode]);

  return <></>;
};
