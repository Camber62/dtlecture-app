//micro
export type MicrophoneState = {
    state: string;
    message: number[];
    isMicrophoneEnabled: boolean
    pressSpace: boolean
    tmpRecognize: string | null
    recognize: string | null
}

//topic.tsx
interface TopicItem {
    id: string;
    name: string;
    active: boolean;
    time: string | null;
    blockId?: string;
}

export interface LectureTopic {
    id: string;
    name: string;
    isOpen: boolean;
    items: TopicItem[];
    blockId?: string;
    sumTime:number;
}