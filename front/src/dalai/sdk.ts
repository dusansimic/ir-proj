import ky from "ky";
import {
  AppState,
  CreateSessionResponse,
  Message,
  MessageProducer,
} from "./types";
import { lastId } from "../utils";

const backendHost = "http://127.0.0.1:5000";

const createSession = async () => {
  const resp = await ky
    .get("create-session", { prefixUrl: backendHost })
    .json<CreateSessionResponse>();

  return resp.id;
};

const setParagraph = async (json: { id: number; paragraph: string }) => {
  const resp = await ky.post("set-paragraph", {
    prefixUrl: backendHost,
    json,
  });

  return [await resp.text(), resp.ok];
};

const initializeModel = async (id: number) => {
  const resp = await ky.get(`start-session/${id}`, { prefixUrl: backendHost });

  return [await resp.text(), resp.ok];
};

const answerQuestion = async (
  id: number,
  index: number,
  answer: string
): Promise<[string, boolean]> => {
  const resp = await ky.post("grade-answer", {
    prefixUrl: backendHost,
    json: {
      id,
      question_index: index,
      answer,
    },
  });

  return [await resp.text(), resp.ok];
};

const sendAnswerPrompt = async ({
  id,
  content,
  index,
  state,
  setMessages,
  setAppState,
}: {
  id: number;
  content: string;
  index: number;
  state: AppState;
  setMessages: React.Dispatch<
    React.SetStateAction<(Message | MessageProducer)[]>
  >;
  setAppState: React.Dispatch<React.SetStateAction<AppState>>;
}) => {
  setMessages((messages) => [
    ...messages,
    {
      type: "message",
      id: lastId(messages),
      object: {
        isBot: false,
        content,
      },
    },
  ]);
  const [grade] = await answerQuestion(id, index, content);
  setMessages((messages) => [
    ...messages,
    {
      type: "message-producer",
      id: lastId(messages),
      producer() {
        return {
          isBot: true,
          content: grade,
        };
      },
    },
  ]);

  switch (state) {
    case "answer-1":
      setAppState("answer-2");
      break;
    case "answer-2":
      setAppState("answer-3");
      break;
  }
};

const sendPrompt = async ({
  id,
  content,
  state,
  setMessages,
  setAppState,
}: {
  id: number;
  content: string;
  state: AppState;
  setMessages: React.Dispatch<
    React.SetStateAction<(Message | MessageProducer)[]>
  >;
  setAppState: React.Dispatch<React.SetStateAction<AppState>>;
}) => {
  switch (state) {
    case "pre-init":
      setMessages((messages) => [
        ...messages,
        {
          type: "message",
          id: lastId(messages),
          object: {
            isBot: true,
            content: "Initializing model with the paragraph you sent me.",
          },
        },
      ]);
      await setParagraph({ id, paragraph: content });
      await initializeModel(id);
      setAppState("init");
      break;
    case "answer-1":
      await sendAnswerPrompt({
        id,
        content,
        index: 0,
        state,
        setMessages,
        setAppState,
      });
      break;
    case "answer-2":
      await sendAnswerPrompt({
        id,
        content,
        index: 1,
        state,
        setMessages,
        setAppState,
      });
      break;
    case "answer-3":
      await sendAnswerPrompt({
        id,
        content,
        index: 2,
        state,
        setMessages,
        setAppState,
      });
      break;
  }
};

const getSession = (id: number) =>
  ky.get(`get-session/${id}`, {
    prefixUrl: backendHost,
  });

export default {
  createSession,
  setParagraph,
  initializeModel,
  sendPrompt,
  getSession,
};
