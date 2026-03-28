import { ApiFetchConfigRecognizeSettings } from '../types/api';
import axios from 'axios';
import { getDeeptalkApiToken } from '../utils/deeptalkToken';

export const microphoneRunRecognizeAPI = async (content: Blob, recognizeSettings: ApiFetchConfigRecognizeSettings) => {
  const fileName = `audio.${getFilenameExtension(content.type)}`;
  const audioFile = new File([content], fileName, { type: content.type });

  const params = new FormData();

  params.append('model_stt', recognizeSettings.model_stt || 'y-STT-v3');
  params.append('language', recognizeSettings.language || 'ru-RU');
  params.append('transcription_needed', recognizeSettings.transcription_needed ? '1' : '0');
  params.append('audio_file', audioFile);

  const endpoint = recognizeSettings.endpoint || 'https://service.deeptalk.tech/new-stt/api/v1/audio/stt/sync/';

  const deeptalkToken = getDeeptalkApiToken();
  if (!deeptalkToken) {
    throw new Error('Задайте DEEPTALK_API_TOKEN в .env (см. .env.example)');
  }

  const response = await axios.post(
    endpoint,
    params,
    {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
        Authorization: `Token ${deeptalkToken}`,
      },
    }
  );

  if (response.status !== 201) {
    throw new Error(`Ошибка при преобразовании голоса в текст: ${response.status}`);
  }

  if (!response.data.text?.trim()?.length) {
    throw new Error('Сервис распознавания не смог распознать голос');
  }

  console.log('Распознанный текст:', response.data.text.trim());
  return response.data.text.trim();
};

function getFilenameExtension(mimeType: string): string {
  // Нормализуем MIME-тип (убираем параметры codecs)
  const normalizedMimeType = mimeType.split(';')[0].trim();

  switch (normalizedMimeType) {
    // OGG форматы
    case 'audio/ogg':
    case 'audio/ogg; codecs=opus':
      return 'ogg';

    // WebM форматы
    case 'audio/webm':
    case 'audio/webm; codecs=opus':
    case 'audio/webm; codecs=vorbis':
      return 'webm';

    // MP4 форматы
    case 'audio/mp4':
    case 'audio/mp4; codecs="mp4a.40.2"':
    case 'audio/aac':
    case 'audio/mpeg':
      return 'mp4';

    // WAV форматы (теперь поддерживается сервером)
    case 'audio/wav':
    case 'audio/wave':
    case 'audio/x-wav':
      console.log('WAV формат - поддерживается сервером');
      return 'wav';

    default:
      console.warn(`Неизвестный MIME-тип: ${mimeType}, используется .webm как fallback`);
      return 'webm'; // Fallback на webm вместо bin
  }
}
