// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import "@mantine/core/styles.css";

import { MantineProvider } from "@mantine/core";
import AppShell from "./components/AppShell";
import ChatBubble from "./components/ChatBubble";

export default function App() {
  return (
    <MantineProvider>
      <AppShell>
        <ChatBubble content="a" />
        <ChatBubble content="b" />
        <ChatBubble content="c" />
        <ChatBubble content="d" />
        <ChatBubble content="e" />
      </AppShell>
    </MantineProvider>
  );
}
