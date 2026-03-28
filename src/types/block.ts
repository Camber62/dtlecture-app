interface BlockContentParams {
    answerAnalyze?: {
      key?: string;
      endpoint: string;
    };
    promptAnalyze?: {
      key: string;
      endpoint?: string;
    };
    questionDynamic?: {
      endpoint: string;
      competenceEndpoint?: string;
    };
    saveAnswer?: {
      localStorageKey?: string;
      globalStorageKey?: string;
      analyze?: {
        endpoint: string;
        instructions: string;
      };
    };
    chat?: {
      endpoint: string;
      endpointWs: string;
      maxQuestion: number;
      initialPhrase: string;
      params: Record<string, string>;
    };
    answerMode?: "text" | "voice" | "default"
  }

  interface BlockContentScene {
    type: "image" | "video";
    url: string;
    animation?: string;
    random?: boolean;
    audio?: boolean;
    videoParams?: {
      loop: boolean;
      mute: string;
    };
  }

  interface BaseBlock {
    id: string;
    type: "just" | "question" | "prompt" | "chat";
    topicId: string;
    topicName?: string;
    content: {
      text: string;
      audio: string | null;
      params: BlockContentParams | null;
      scene: BlockContentScene;
      speed?: number;
      volume?: number;
      tone?: string;
    };
  }

  interface JustBlock extends BaseBlock {
    type: "just";
  }

  interface QuestionBlock extends BaseBlock {
    type: "question";
  }

  interface PromptBlock extends BaseBlock {
    type: "prompt";
  }

  interface ChatBlock extends BaseBlock {
    type: "chat";
  }

  export type AllBlocksItem = JustBlock | QuestionBlock | PromptBlock | ChatBlock;

  interface ComponentBlockProps {
    setAudioTextCB: (audioText: string) => void;
    setChatTextCB: (audioText: string) => void;
  }

  export interface JustBlockProps extends ComponentBlockProps {}
  export interface QuestionBlockProps extends ComponentBlockProps {}
  export interface PromptBlockProps extends ComponentBlockProps {}
  export interface ChatBlockProps extends ComponentBlockProps {}
