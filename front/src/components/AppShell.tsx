import { PropsWithChildren, FC } from "react";
import { AppShell as MantineAppShell } from "@mantine/core";

const AppShell: FC<PropsWithChildren> = ({ children }) => {
  return (
    <MantineAppShell header={{ height: 60 }} padding="md">
      <MantineAppShell.Header>Navbar</MantineAppShell.Header>
      <MantineAppShell.Main>{children}</MantineAppShell.Main>
    </MantineAppShell>
  );
};

export default AppShell;
