import {textToSpeechAPI} from './textToSpeech';
import {microphoneRunRecognizeAPI} from './microphoneRunRecognize';
import {FetchConfig} from "./fetchConfig";
import {FetchAnalyzeAnswer} from "./fetchAnalyzeAnswer";
import {FetchBlockPrompt} from "./fetchBlockPrompt";
import {FetchBlockQuestionDynamic} from "./fetchBlockQuestionDynamic";
import {FetchModSettings} from "./fetchModSettings";
import {FetchDynamicQuestionAnswer} from "./fetchDynamicQuestionAnswer";
import {FetchLectureConfig} from "./fetchLectureConfig";
import {FetchReplaceTranscriptions} from "./fetchReplaceTranscriptions";
import {SaveUserAnswer} from "./saveUserAnswer";
import {GetVariables} from "./getVariables";
import { ChatCreate } from './chatCreate';
import { SaveChatHistory } from './saveChatHistory';

export const API = {
    textToSpeechAPI,
    microphoneRunRecognizeAPI,
    FetchConfig,
    FetchAnalyzeAnswer,
    FetchBlockPrompt,
    FetchBlockQuestionDynamic,
    FetchModSettings,
    FetchDynamicQuestionAnswer,
    FetchLectureConfig,
    FetchReplaceTranscriptions,
    SaveUserAnswer,
    SaveChatHistory,
    GetVariables,
    Chat: {
        ChatCreate,
    }
};
