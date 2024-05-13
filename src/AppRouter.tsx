import {
  A,
  Route,
  Router,
  useLocation,
  useNavigate,
  useParams,
} from "@solidjs/router";
import { LoginScreen } from "./features/LoginScreen";
import placesIcon from "./assets/places-icon.webp";
import { createEffect, createSignal, onCleanup, onMount, Show } from "solid-js";
import { PlaceScreen, PlacesScreen } from "./features/places";

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
  /* createEffect(() => {
    location.pathname;
    setTimeout(() => {
      setHistoryLength(getDepth());
    });
  }); */

  const goBack = () => history.back();

  // const canGoBack = () => historyLength() > 0;
  const canGoBack = () =>
    location.pathname.length > 0 && location.pathname !== "/";

  return [canGoBack, goBack] as const;
};

const NavigationScreen = () => (
  <div class="flex gap-5 flex-wrap">
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
          <Show when={canGoBack()}>
            <button class="mb-4 btn" onClick={goBack}>
              Go back
            </button>
          </Show>
          {props.children}
        </div>
      );
    }}
  >
    <Route path="/" component={NavigationScreen} />
    <Route path="/places" component={PlacesScreen} />
    <Route
      path="/place/edit/:id"
      component={() => {
        const { id } = useParams();

        return <PlaceScreen action="edit" id={id} />;
      }}
    />
    <Route
      path="/place/new"
      component={() => <PlaceScreen action="create" />}
    />
    <Route path="*" component={() => <p>Route is not found</p>} />
  </Router>
);
