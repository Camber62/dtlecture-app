
interface ChatMessageWSCommand {
    command: "send_message" | "status" | "status_chat";
  }
  
  export interface ChatMessageWSStatus extends ChatMessageWSCommand {
    command: "status";
    body: {
      status: "generating" | "done";
    };
  }

  export interface ChatMessageWSStatusChat extends ChatMessageWSCommand {
    command: "status_chat";
    body: {
      status: "ended";
    };
  }
  
  export interface ChatMessageWSSendMessage extends ChatMessageWSCommand {
    command: "send_message";
    body: {
      hide_message: boolean;
      message_id: string;
      message: {
        change_history: [];
        content: {
          docs: string | null;
          images: string[];
          json: string | null;
          text: string;
        };
        message_number: number;
        metadata: {
          condition: string;
          date: string;
          last_message: boolean;
          modified: boolean;
        };
      };
      role: "ai" | "user";
    };
  }