export type CreateSessionResponse = {
  id: number;
};

export type GetSessionResponse = {
  paragraph: string;
  questions: string[];
  answers: string[];
};

export type AppState =
  | "pre-init"
  | "init"
  | "select-topic"
  | "answer-1"
  | "answer-2"
  | "answer-3";

export type Message = {
  type: "message";
  id: number;
  object: {
    isBot: boolean;
    content: string;
  };
};

export type MessageProducer = {
  type: "message-producer";
  id: number;
  producer: (archive: [string, string, string]) => Message["object"];
};
