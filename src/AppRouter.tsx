import { A, Route, Router, useLocation, useNavigate } from "@solidjs/router";
import { LoginScreen } from "./features/LoginScreen";
import placesIcon from "./assets/places-icon.webp";
import { createEffect, createSignal, onCleanup, onMount, Show } from "solid-js";

type Dispose = () => void;
const useOnMountUnmount = (init: () => Dispose) => {
  let mountDispose: Dispose;
  onMount(() => {
    mountDispose = init();
  });

  onCleanup(() => {
    mountDispose();
  });
};
const getDepth = () => history.state._depth ?? 0;

const useGoBack = () => {
  const [historyLength, setHistoryLength] = createSignal(getDepth());

  const location = useLocation();
  createEffect(() => {
    location.pathname;
    setTimeout(() => {
      setHistoryLength(getDepth());
    });
  });

  const goBack = () => history.back();

  const canGoBack = () => historyLength() > 0;

  return [canGoBack, goBack] as const;
};

const NavigationScreen = () => (
  <div class="flex gap-5 flex-wrap ">
    <A href="/places" class="btn relative">
      Places
    </A>

    <A href="/draft" class="btn">
      Drafts
    </A>
  </div>
);

export const AppRouter = () => (
  <Router
    root={(props) => {
      const [canGoBack, goBack] = useGoBack();

      return (
        <div class="px-[min(3vw,100px)] pt-[40px]">
          <button
            class="mb-4 btn"
            classList={{
              invisible: !canGoBack(),
            }}
            onClick={goBack}
          >
            Go back
          </button>
          {props.children}
        </div>
      );
    }}
  >
    <Route path="/" component={NavigationScreen} />
    <Route path="*" component={() => <p>Route is not found</p>} />
  </Router>
);
