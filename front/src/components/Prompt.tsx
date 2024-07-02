import { Button, Group, Textarea } from "@mantine/core";
import { FC, useState } from "react";

type PromptProps = {
  onSubmit: (prompt: { content: string }) => void;
};

const Prompt: FC<PromptProps> = ({ onSubmit }) => {
  const [prompt, setPrompt] = useState("");
  return (
    <Group>
      <Textarea
        autosize
        minRows={1}
        value={prompt}
        onChange={(event) => setPrompt(event.currentTarget.value)}
      />
      <Button
        onClick={(event) => {
          event.preventDefault();
          onSubmit({ content: prompt });
        }}
      >
        Answer
      </Button>
    </Group>
  );
};

export default Prompt;
