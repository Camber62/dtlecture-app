import { useCallback, useEffect, useRef, useState } from 'react';
import RecordRTC from 'recordrtc';

type UseMicrophoneResult = {
  isRecording: boolean;
  recordingBlob: Blob | null;
  audioUrl: string | null;
  startRecording: () => Promise<void>;
  stopRecording: () => void;
  error: string | null;
  isInitialized: boolean;
};

export const useMicrophoneOld = (is: boolean, stream: MediaStream | null): UseMicrophoneResult => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingBlob, setRecordingBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  const recorderRef = useRef<RecordRTC | null>(null);

  // Детекция браузера для оптимальных настроек
  const detectBrowser = useCallback(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    const isSafari = /safari/.test(userAgent) && !/chrome/.test(userAgent);
    const isIOS = /iphone|ipad|ipod/.test(userAgent);
    const isFirefox = /firefox/.test(userAgent);

    return { isSafari, isIOS, isFirefox };
  }, []);

  // Выбор оптимальных настроек для текущего браузера
  const getRecorderOptions = useCallback(() => {
    const browser = detectBrowser();

    // Настройки для Safari/iOS - используем WAV формат с правильными настройками
    if (browser.isSafari || browser.isIOS) {
      return {
        type: 'audio' as const,
        mimeType: 'audio/wav' as const,
        recorderType: RecordRTC.StereoAudioRecorder, // Явно указываем тип рекордера
        numberOfAudioChannels: 1 as const,
        audioBitsPerSecond: 128000,
        bufferSize: 16384 as const, // Больший буфер для Safari
        sampleRate: 44100,
        // Дополнительные настройки для качества
        desiredSampRate: 44100,
      };
    }

    // Настройки для Firefox
    if (browser.isFirefox) {
      return {
        type: 'audio' as const,
        mimeType: 'audio/ogg' as const,
        numberOfAudioChannels: 1 as const,
        audioBitsPerSecond: 128000,
      };
    }

    // Настройки для Chrome и других браузеров
    return {
      type: 'audio' as const,
      mimeType: 'audio/webm' as const,
      numberOfAudioChannels: 1 as const,
      audioBitsPerSecond: 128000,
    };
  }, [detectBrowser]);

  // Инициализация медиа-стрима при монтировании
  useEffect(() => {
    const initializeStream = async () => {
      try {
        setError(null);

        // Детекция браузера для настройки аудио потока
        const browser = detectBrowser();

        setIsInitialized(true);

        // Диагностика аудио потока для Safari
        if (browser.isSafari || browser.isIOS) {
          const audioTrack = stream.getAudioTracks()[0];
          if (audioTrack) {
            console.log('Safari - аудио трек:', {
              label: audioTrack.label,
              enabled: audioTrack.enabled,
              muted: audioTrack.muted,
              readyState: audioTrack.readyState,
              settings: audioTrack.getSettings ? audioTrack.getSettings() : 'не поддерживается',
              constraints: audioTrack.getConstraints
                ? audioTrack.getConstraints()
                : 'не поддерживается',
            });
          }
        }

        console.log('Микрофон успешно инициализирован');
      } catch (err: any) {
        console.error('Ошибка инициализации микрофона:', err);
        setError(err.message || 'Не удалось получить доступ к микрофону');
        setIsInitialized(false);
      }
    };

    initializeStream();

    // Очистка при размонтировании
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      if (recorderRef.current) {
        recorderRef.current.destroy();
        recorderRef.current = null;
      }
      // Очищаем URL для освобождения памяти
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
        setAudioUrl(null);
      }
      setIsInitialized(false);
    };
  }, [audioUrl, detectBrowser, stream]);

  const startRecording = useCallback(async () => {
    if (!stream || !isInitialized) {
      setError('Микрофон не инициализирован');
      return;
    }

    try {
      setError(null);

      // Очищаем предыдущий URL и blob при начале новой записи
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
        setAudioUrl(null);
      }
      setRecordingBlob(null);

      // Получаем настройки для текущего браузера
      const options = getRecorderOptions();
      const browser = detectBrowser();

      // Для Safari добавляем дополнительные настройки
      if (browser.isSafari || browser.isIOS) {
        console.log('Safari/iOS обнаружен - используем специальные настройки');

        // Специальные настройки для Safari чтобы избежать шипения
        const safariOptions = {
          type: 'audio' as const,
          mimeType: 'audio/wav' as const,
          recorderType: RecordRTC.StereoAudioRecorder, // Принудительно используем StereoAudioRecorder
          numberOfAudioChannels: 1 as const,
          // Критически важные настройки для Safari
          bufferSize: 16384 as const, // Увеличиваем размер буфера
          sampleRate: 44100,
          // Настройки битрейта
          audioBitsPerSecond: 128000,
          disableLogs: false, // Включаем логи RecordRTC для отладки
        };

        recorderRef.current = new RecordRTC(stream, safariOptions);
      } else {
        // Создаем новый экземпляр RecordRTC для каждой записи
        recorderRef.current = new RecordRTC(stream, options);
      }

      // Запускаем запись
      recorderRef.current.startRecording();
      setIsRecording(true);

      console.log(`Запись началась с форматом: ${options.mimeType}`, options);
    } catch (err: any) {
      console.error('Ошибка запуска записи:', err);
      setError(err.message || 'Не удалось начать запись');
      setIsRecording(false);
    }
  }, [stream, isInitialized, audioUrl, getRecorderOptions, detectBrowser]);

  const stopRecording = useCallback(() => {
    if (!recorderRef.current || !isRecording) {
      return;
    }

    try {
      recorderRef.current.stopRecording(() => {
        if (!recorderRef.current) return;

        const blob = recorderRef.current.getBlob();
        const browser = detectBrowser();

        console.log(
          `Остановка записи - браузер: ${
            browser.isSafari ? 'Safari' : browser.isIOS ? 'iOS' : 'Other'
          }, размер: ${blob.size} байт, тип: ${blob.type}`
        );

        if (blob.size === 0) {
          console.warn('Записанный файл пуст - возможно проблема с настройками Safari');

          // Для Safari пробуем альтернативный подход
          if (browser.isSafari || browser.isIOS) {
            console.log('Попытка повторной записи с альтернативными настройками для Safari');
            setError('Файл записи пуст. Попробуйте еще раз или обновите страницу.');
          } else {
            setError('Записанный файл пуст');
          }
        } else {
          console.log(`Запись успешно завершена - размер: ${blob.size} байт, MIME: ${blob.type}`);

          // Очищаем предыдущий URL если он есть
          if (audioUrl) {
            URL.revokeObjectURL(audioUrl);
          }

          // Создаем URL для прослушивания
          const newAudioUrl = URL.createObjectURL(blob);
          console.log('Создан URL для прослушивания:', newAudioUrl);

          setRecordingBlob(blob);
          setAudioUrl(newAudioUrl);
        }

        setIsRecording(false);

        // Очищаем текущий рекордер для следующей записи
        recorderRef.current.destroy();
        recorderRef.current = null;
      });
    } catch (err: any) {
      console.error('Ошибка остановки записи:', err);
      setError(err.message || 'Ошибка при остановке записи');
      setIsRecording(false);
    }
  }, [audioUrl, detectBrowser, isRecording]);

  // Управление записью по флагу
  useEffect(() => {
    if (!isInitialized) return;

    if (is && !isRecording) {
      startRecording();
    } else if (!is && isRecording) {
      stopRecording();
    }
  }, [is, isInitialized, isRecording, startRecording, stopRecording]);

  return {
    isRecording,
    recordingBlob,
    audioUrl,
    startRecording,
    stopRecording,
    error,
    isInitialized,
  };
};
