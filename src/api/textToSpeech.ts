import axios from "axios";
import {ApiFetchConfigVoiceSettings} from "../types/api";
import { getDeeptalkApiToken } from "../utils/deeptalkToken";
interface TextToSpeechParams {
    model_tts: string;
    voice: string;
    language: string;
    speed: string;
    tone: string | null;
    text: string;
    ssml: boolean;
    filter_profanity: boolean;
    numbers_as_words: boolean;
    transcription_needed: boolean;
}
export const textToSpeechAPI = async (text: string, speed: number,tone:string, settings: ApiFetchConfigVoiceSettings = {} as ApiFetchConfigVoiceSettings) => {
    let params: TextToSpeechParams = {
        model_tts: settings?.model_tts ?? "y-TTS",
        voice: settings.voice ?? "ermil",
        language: settings?.language ?? "ru-RU",
        speed: speed.toString(),
        tone: tone ?? settings.tone ?? null,
        text: text,
        ssml: settings?.ssml ?? false,
        filter_profanity: settings?.filter_profanity ?? false,
        numbers_as_words: settings?.numbers_as_words ?? false,
        transcription_needed: settings?.transcription_needed ?? false,
    };

    if (params.voice === "alica") {
        params.voice = "alena";
    }

    if (params.tone === "normal") {
        params.tone = "neutral";
    }

    if (params.model_tts === "o-TTS") {
        delete params.language;
        delete params.tone;
        delete params.ssml;
        delete params.filter_profanity;
        delete params.numbers_as_words;
        delete params.transcription_needed;
    }

    let url = 'https://service.deeptalk.tech/new-stt/api/v1/audio/tts/sync/';

    if (settings.sttUrl !== '') {
        url = settings.sttUrl;
    }

    const deeptalkToken = getDeeptalkApiToken();
    if (!deeptalkToken) {
        throw new Error("Задайте DEEPTALK_API_TOKEN в .env (см. .env.example)");
    }

    try {
        const response = await axios.post(
            url,
            params,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${deeptalkToken}`
                },
            }
        );

        if (![200, 201].includes(response.status)) {
            throw new Error("Ошибка при преобразовании текста в речь");
        }

        //
        // const ttsResult = {
        //     ...response.data,
        //     audio_file_url: `https://storage.yandexcloud.net/photo-upload${new URL(response.data.audio_file_url).pathname}`
        // };
        return response.data;

    } catch (error) {
        console.error("Ошибка при преобразовании текста в речь:", error);
        throw new Error("Ошибка при преобразовании текста в речь");
    }
};
