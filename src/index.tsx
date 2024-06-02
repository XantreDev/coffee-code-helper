/* @refresh reload */
import { render } from "solid-js/web";

import "./styles.css";
import { QueryClientProvider } from "@tanstack/solid-query";
import { AppRouter } from "./AppRouter";
import { ModalRenderer } from "./modals";
import { queryClient } from "./queryClient";

render(
	() => (
		<QueryClientProvider client={queryClient}>
			<AppRouter />
			<ModalRenderer />
		</QueryClientProvider>
	),
	document.getElementById("root") as HTMLElement,
);
