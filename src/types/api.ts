import {VoiceLangSystemSupported, VoiceSystemSupported, VoiceToneSystemSupported} from "./common";
import {AllBlocksItem} from "./block";
import {GetVariables} from "../api/getVariables";

export interface ApiFetchConfigTopic {
    name: string
    id: string
    blockId?: string;
}

export interface ApiFetchConfigInstructions {
    url: string
    animations: string
}

export interface ApiFetchConfigVoiceSettings {
    sttUrl?: string
    ttsUrl: string
    lang: VoiceLangSystemSupported
    voice: VoiceSystemSupported
    speed: number
    tone: VoiceToneSystemSupported
    model_tts?: string
    language?: string
    ssml?: boolean
    filter_profanity?: boolean
    numbers_as_words?: boolean
    transcription_needed?: boolean
}

export interface ApiFetchConfigRecognizeSettings {
  model_stt?: string;
  language?: string;
  transcription_needed?: boolean;
  endpoint?: string;
}

export interface ApiFetchConfigResponse {

    firstBlockId: string
    coverUrl: string
    voiceSettings: ApiFetchConfigVoiceSettings,
    recognizeSettings?: ApiFetchConfigRecognizeSettings,
    topics: ApiFetchConfigTopic[],
    blocks: AllBlocksItem[],
    instructions?: ApiFetchConfigInstructions[]
    replaceTranscriptions?: {
        endpoint: string
        groupId: string
    }
    sceneImages?: string[]

}

export interface ApiFetchLectureConfig {
  config: string;
  name: string;
  jwt: string;
  next_url: string;
  personal: boolean;
  status: "pending" | "done" | "error";
}

export interface ApiGetVariablesItemResponse {
    key: string
    value: string
}
