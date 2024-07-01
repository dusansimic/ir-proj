import { Avatar, Box, Group } from "@mantine/core";
import { FC } from "react";

type ChatBubbleProps = {
  content: string;
};

const ChatBubble: FC<ChatBubbleProps> = ({ content }) => {
  return (
    <Group grow wrap="nowrap">
      <Avatar
        src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-7.png"
        size="lg"
        radius="xl"
      />
      <Box bg="red.5">{content}</Box>
    </Group>
  );
};

export default ChatBubble;
