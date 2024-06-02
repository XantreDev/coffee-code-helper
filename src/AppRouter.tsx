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
        <div class="px-[min(3vw,100px)] pt-[40px] relative">
          <Show when={canGoBack()}>
            <button class="mb-4 btn" onClick={goBack}>
              Go back
            </button>

          </Show>

          <label class="ml-auto swap swap-rotate absolute right-4">
            <input type="checkbox" class="theme-controller" value="dark" />

            <svg class="swap-off fill-current w-10 h-10" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" /></svg>

            <svg class="swap-on fill-current w-10 h-10" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" /></svg>

          </label>

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
