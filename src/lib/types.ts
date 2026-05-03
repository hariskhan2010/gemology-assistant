export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
  image?: string;
}

export interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  image?: string;
  timestamp: Date;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}
