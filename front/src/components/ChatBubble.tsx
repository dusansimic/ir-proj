import { AspectRatio, Avatar, Flex, Paper } from "@mantine/core";
import { FC } from "react";

type ChatBubbleProps = {
  content: string;
  isBot: boolean;
};

type ConditionalAvatarProps = Pick<ChatBubbleProps, "isBot">;

const ConditionalAvatar: FC<ConditionalAvatarProps> = ({ isBot }) => (
  <AspectRatio ratio={1}>
    <Avatar
      src={
        isBot
          ? "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-7.png"
          : "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-9.png"
      }
      size="lg"
      radius="xl"
    />
  </AspectRatio>
);

const ChatBubble: FC<ChatBubbleProps> = ({ content, isBot }) => {
  return (
    <Flex w={100} justify={isBot ? "start" : "end"} gap="md">
      {isBot ? <ConditionalAvatar isBot={isBot} /> : null}
      <Paper withBorder p="md">
        {content}
      </Paper>
      {!isBot ? <ConditionalAvatar isBot={isBot} /> : null}
    </Flex>
  );
};

export default ChatBubble;
