/* @refresh reload */
import { render } from "solid-js/web";

import "./styles.css";
import { AppRouter } from "./AppRouter";
import { QueryClientProvider } from "@tanstack/solid-query";
import { queryClient } from "./queryClient";
import { ModalRenderer } from "./modals";

render(
  () => (
    <QueryClientProvider client={queryClient}>
      <AppRouter />
      <ModalRenderer />
    </QueryClientProvider>
  ),
  document.getElementById("root") as HTMLElement
);
