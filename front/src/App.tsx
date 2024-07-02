// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import "@mantine/core/styles.css";

import { Container, MantineProvider, Stack } from "@mantine/core";
import AppShell from "./components/AppShell";
import ChatBubble from "./components/ChatBubble";
import Prompt from "./components/Prompt";
import { useState } from "react";

type Message = {
  isBot: boolean;
  content: string;
};

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);

  return (
    <MantineProvider>
      <AppShell>
        <Container size="sm">
          <Stack gap="md">
            {messages.map((message) => (
              <ChatBubble content={message.content} isBot={message.isBot} />
            ))}
            <Prompt
              onSubmit={({ content }) => {
                console.log(content);
                setMessages([...messages, { content, isBot: false }]);
              }}
            />
          </Stack>
        </Container>
      </AppShell>
    </MantineProvider>
  );
}
