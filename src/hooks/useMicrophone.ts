import { useCallback, useEffect, useRef, useState } from 'react';
import { RecordRTCPromisesHandler } from 'recordrtc';

type UseMicrophoneResult = {
  isRecording: boolean;
  recordingBlob: Blob | null;
  cleanup: () => void;
  isInitialized: boolean;
};

export const useMicrophone = (is: boolean): UseMicrophoneResult => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingBlob, setRecordingBlob] = useState<Blob | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const recorderRef = useRef<RecordRTCPromisesHandler | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const isPressedRef = useRef(false);

  // 🔹 Безопасная очистка рекордера
  const safeCleanupRecorder = useCallback((recorder: RecordRTCPromisesHandler) => {
    try {
      // Пробуем разные методы очистки в зависимости от версии RecordRTC
      const recorderAny = recorder as any;
      if (typeof recorderAny.destroy === 'function') {
        recorderAny.destroy();
      } else if (typeof recorderAny.reset === 'function') {
        recorderAny.reset();
      } else if (typeof recorderAny.clearRecordedData === 'function') {
        recorderAny.clearRecordedData();
      }
    } catch (err) {
      console.log('Ошибка при очистке рекордера:', err);
    }
  }, []);

  // 🔹 Функция создания нового стрима и рекордера для каждой записи
  const createNewRecorder = useCallback(async () => {
    try {
      // Создаем новый стрим для каждой записи
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      // Создаем новый рекордер
      console.log('Создаем новый рекордер с MIME-типом: audio/wav');
      const recorder = new RecordRTCPromisesHandler(stream, {
        type: 'audio',
        mimeType: 'audio/wav',
        recorderType: (RecordRTCPromisesHandler as any).StereoAudioRecorder,
        numberOfAudioChannels: 1,
        desiredSampRate: 16000,
      });

      return { stream, recorder };
    } catch (err) {
      console.error('Не удалось создать рекордер:', err);
      return null;
    }
  }, []);

  // 🔹 Начать запись - всегда создаем новые ресурсы
  const startListening = useCallback(async () => {
    console.log('startListening:', isPressedRef.current, is);
    if (!isPressedRef.current || !is) return;

    try {
      // Очищаем старые ресурсы если есть
      if (recorderRef.current) {
        safeCleanupRecorder(recorderRef.current);
        recorderRef.current = null;
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }

      // Создаем новые ресурсы для каждой записи
      const newResources = await createNewRecorder();
      if (!newResources) {
        setIsRecording(false);
        setIsInitialized(false);
        return;
      }

      // Сохраняем ссылки на новые ресурсы
      streamRef.current = newResources.stream;
      recorderRef.current = newResources.recorder;
      setIsInitialized(true);

      // Начинаем запись
      await recorderRef.current.startRecording();
      setIsRecording(true);
    } catch (err) {
      console.error('Ошибка запуска записи:', err);
      setIsRecording(false);
      setIsInitialized(false);

      // Очищаем ресурсы при ошибке
      if (recorderRef.current) {
        safeCleanupRecorder(recorderRef.current);
        recorderRef.current = null;
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    }
  }, [is, createNewRecorder, safeCleanupRecorder]);

  // 🔹 Остановить запись и полностью очистить ресурсы
  const stopListening = useCallback(async () => {
    console.log('stopListening:', recorderRef.current, isPressedRef.current);
    if (!recorderRef.current || !isPressedRef.current) return;

    try {
      await recorderRef.current.stopRecording();
      const blob = await recorderRef.current.getBlob();

      // Проверяем и при необходимости принудительно устанавливаем WAV тип
      let finalBlob = blob;
              console.log(`Оригинальный тип: ${blob.type}, принудительно устанавливаем audio/wav`);
              console.log(`URL blob ${blob.type}:`, URL.createObjectURL(blob));

      // Вызываем внешний обработчик
      setRecordingBlob(finalBlob);
      setIsRecording(false);

      // Полностью очищаем ресурсы после каждой записи (единообразно для всех браузеров)
      safeCleanupRecorder(recorderRef.current);
      recorderRef.current = null;

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }

      setIsInitialized(false);
    } catch (err) {
      console.error('Ошибка остановки записи:', err);
      setIsRecording(false);

      // При ошибке полностью очищаем ресурсы
      if (recorderRef.current) {
        safeCleanupRecorder(recorderRef.current);
        recorderRef.current = null;
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      setIsInitialized(false);
    }
  }, [safeCleanupRecorder]);

  // 🔹 Полная очистка ресурсов
  const cleanup = useCallback(() => {
    if (recorderRef.current) {
      safeCleanupRecorder(recorderRef.current);
      recorderRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    setIsInitialized(false);
    setIsRecording(false);
    setRecordingBlob(null);
  }, [safeCleanupRecorder]);

  useEffect(() => {
    if (is) {
      isPressedRef.current = true;
      startListening();
    } else {
      stopListening();
      isPressedRef.current = false;
    }
  }, [is, startListening, stopListening]);

  // Очистка при размонтировании
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  return {
    isRecording,
    recordingBlob,
    cleanup,
    isInitialized,
  };
};
