import { appSliceActions } from "@features/appSlice";
import { useAppDispatch } from "@hooks/useAppDispatch";
import { useAppSelector } from "@hooks/useAppSelector";
import { Spin } from "antd";
import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

export const AnswerModeScene = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const { lectureConfigPath } = useAppSelector((state) => state.app);

  const checkInputDevices = useCallback(async (): Promise<boolean> => {
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices.filter((device) => device.kind === 'audioinput').length > 0;
  }, []);

  const checkMicrophonePermission = useCallback(async (): Promise<boolean> => {
    const permission = await navigator.permissions.query({ name: 'microphone' as PermissionName });
    return permission.state === 'granted';
  }, []);

  const requestMicrophoneAccess = useCallback(async (): Promise<boolean> => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      return true;
    } catch (error) {
      return false;
    }
  }, []);

  const handleClick = useCallback(
    async (mode: 'text' | 'voice') => {
      if (!lectureConfigPath) {
        toast.warning(t('answer_mode_scene.no_microphone_permission_2'));
        return;
      }

      if (mode === 'voice') {
        //Проверить доступность микрофона
        const hasInputDevices = await checkInputDevices();
        //Если нет доступных микрофонов, то вывести сообщение
        if (!hasInputDevices) {
          toast.error(t('answer_mode_scene.no_input_devices'));
          return;
        }

        //Если есть доступные микрофоны, то проверить доступность микрофона
        const hasMicrophonePermission = await checkMicrophonePermission();
        //Если нет доступности микрофона, то попробовать запросить доступ снова
        if (!hasMicrophonePermission) {
          const accessGranted = await requestMicrophoneAccess();
          if (!accessGranted) {
            toast.error(t('answer_mode_scene.no_microphone_permission'));
            return;
          }
        }
      }

      dispatch(appSliceActions.setAnswerMode(mode));
    },
    [
      checkInputDevices,
      checkMicrophonePermission,
      dispatch,
      lectureConfigPath,
      requestMicrophoneAccess,
      t,
    ]
  );

  return (
    <Spin spinning={!lectureConfigPath} wrapperClassName="answer-mode-scene-container-spin-wrapper">
      <div className="answer-mode-scene-container">
        <p>
          {t('welcome_message')}
          <br />
          {t('choose_method')} <span className="colorize">{t('how_do_you_want_to_proceed')}</span>:
        </p>
        <div className="actions-wrapper">
          <div className="actions-item">
            <div className="action" onClick={() => handleClick('voice')}>
              {t('microphone')}
            </div>
            <div className="description">{t('voice_answers')}</div>
          </div>
          <div className="actions-item">
            <div className="action" onClick={() => handleClick('text')}>
              {t('manual_input')}
            </div>
            <div className="description">{t('typing_only')}</div>
          </div>
        </div>
      </div>
    </Spin>
  );
};
