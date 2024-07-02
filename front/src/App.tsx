// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import "@mantine/core/styles.css";

import { Container, MantineProvider, Stack } from "@mantine/core";
import AppShell from "./components/AppShell";
import ChatBubble from "./components/ChatBubble";
import Prompt from "./components/Prompt";
import { useEffect, useState } from "react";
import sdk from "./dalai/sdk";
import {
  AppState,
  GetSessionResponse,
  Message,
  MessageProducer,
} from "./dalai/types";
import { lastId } from "./utils";
import { useInterval } from "@mantine/hooks";

export default function App() {
  const [messages, setMessages] = useState<(Message | MessageProducer)[]>([]);
  const [appState, setAppState] = useState<AppState>("pre-init");
  const [sessionId, setSessionId] = useState<number>(-1);
  const [session, setSession] = useState<GetSessionResponse | undefined>(
    undefined
  );
  const sessionGettingInterval = useInterval(() => {
    (async () => {
      const resp = await sdk.getSession(sessionId);
      if (resp.ok) {
        const json = await resp.json<GetSessionResponse>();
        setSession(json);
        setMessages((messages) => [
          ...messages,
          {
            type: "message-producer",
            id: lastId(messages),
            producer: (questions) => {
              return {
                isBot: true,
                content: questions[0],
              };
            },
          },
        ]);
        setAppState("answer-1");
        sessionGettingInterval.stop();
      }
    })();
  }, 1000);

  useEffect(() => {
    console.log(appState);
    switch (appState) {
      case "pre-init":
        (async () => {
          setMessages((messages) => [
            ...messages,
            {
              type: "message",
              id: 0,
              object: {
                isBot: true,
                content: "Creating session...",
              },
            },
          ]);

          console.log("Creating session...");

          const id = await sdk.createSession();
          setSessionId(id);

          setMessages((messages) => [
            ...messages,
            {
              type: "message",
              id: 1,
              object: {
                isBot: true,
                content:
                  "Please send me the paragraph you would like to test your knowledge on.",
              },
            },
          ]);
        })();
        break;
      case "init":
        "little dance while waiting for questions";
        sessionGettingInterval.start();
        break;
      case "answer-1":
        "little dance while waiting for answer";
        break;
      case "answer-2":
        setMessages((messages) => [
          ...messages,
          {
            type: "message-producer",
            id: lastId(messages),
            producer(questions) {
              return {
                isBot: true,
                content: questions[1],
              };
            },
          },
        ]);
        break;
      case "answer-3":
        setMessages((messages) => [
          ...messages,
          {
            type: "message-producer",
            id: lastId(messages),
            producer(questions) {
              return {
                isBot: true,
                content: questions[2],
              };
            },
          },
        ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appState]);

  return (
    <MantineProvider>
      <AppShell>
        <Container size="sm">
          <Stack gap="md">
            {messages.map((message) => {
              switch (message.type) {
                case "message":
                  return (
                    <ChatBubble
                      key={message.id}
                      content={message.object.content}
                      isBot={message.object.isBot}
                    />
                  );
                case "message-producer":
                  return (
                    <ChatBubble
                      key={message.id}
                      content={
                        message.producer(
                          session?.questions as [string, string, string]
                        ).content
                      }
                      isBot={
                        message.producer(
                          session?.questions as [string, string, string]
                        ).isBot
                      }
                    />
                  );
                // const content = message.producer("", 0, )
              }
            })}
            <Prompt
              onSubmit={({ content }) => {
                setMessages((messages) => [
                  ...messages,
                  {
                    type: "message",
                    id: lastId(messages),

                    object: {
                      isBot: false,
                      content: content,
                    },
                  },
                ]);
                sdk.sendPrompt({
                  id: sessionId,
                  state: appState,
                  content,
                  setMessages,
                  setAppState,
                });
              }}
            />
          </Stack>
        </Container>
      </AppShell>
    </MantineProvider>
  );
}
