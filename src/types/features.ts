import {ApiFetchConfigResponse} from "./api";
import {StatusState} from "./common";
import {AllBlocksItem} from "./block";

export type ControllersKey = "scene" | "play" | "pause" | "stop" | "topics" | "chat" | "subtitles" | "settings" | "raiseHand"

export interface AppSliceStateControllersItem {
    id: ControllersKey
    show: boolean
    disabled: boolean
    active: boolean
    help?: string
}

export interface AppSliceState {
    lectureName: string
    lectureConfigPath: string
    lectureJWT: string
    lectureNextUrl: string
    controllers: AppSliceStateControllersItem[],
    config: ApiFetchConfigResponse | null
    configStatus: StatusState
    modSettings: any,
    modSettingsStatus: StatusState,
    lectureIsPlay: boolean
    lectureIsPause: boolean
    lectureIsStop: boolean
    needAnswer: boolean
    answerMessage: string
    attemptId: string
    answerStatus: StatusState
    answerMode: "voice" | "text" | null
    blockAnswerMode: "voice" | "text" | "default"
    isStartLecture: boolean
    isContinue: boolean
    isSingleView: boolean
    currentTopicId: string
    sceneRandomNumber: number
    lectureState: {
        isPlay: boolean
        isPause: boolean
        isStop: boolean
    }
    singleActiveControlList: { [key in ControllersKey]?: string[] }
}

export interface BlockSliceState {
    blocksStatus: StatusState;
    blocks: AllBlocksItem[];
    currentBlock: AllBlocksItem | null;
    currentBlockId: string | null | number;
    currentBlockIndex: number | null;
    isEnd: boolean,
    answerVariables: { [key: string]: string }
    promptVariables: { [key: string]: { status: StatusState, value: string } }
    videoEnded: boolean
    audioEnded: boolean
}

