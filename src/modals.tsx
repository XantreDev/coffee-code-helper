import { createSignal, For, JSX } from "solid-js";
import { DeferredPromise } from "@open-draft/deferred-promise";

const getId = (() => {
  let id = 0;
  return () => id++;
})();

export type ModalProps<T> = {
  resolve: (_: T) => void;
  reject: (_: unknown) => void;
};

export const showModal = <T,>(Component: Modal<T>["Component"]) => {
  const promise = new DeferredPromise<T>();

  const reject = promise.reject.bind(promise);
  const resolve = promise.resolve.bind(promise);

  const id = getId();
  const onClose = () => {
    setModal((modals) => modals.filter((it) => it.id !== id));
  };
  promise.finally(onClose);

  setModal((items) => [
    ...items,
    {
      Component,
      id,
      onClose: () => {
        if (promise.state === "pending") {
          promise.reject();
        }
      },
      reject,
      resolve,
    },
  ]);

  return Promise.resolve(promise);
};

type Modal<T> = {
  id: number;
  Component: (params: ModalProps<T>) => JSX.Element;
  onClose: () => void;
} & ModalProps<T>;
const [modals, setModal] = createSignal<Modal<any>[]>([]);

export const ModalRenderer = () => (
  <For each={modals()}>
    {(it) => (
      <dialog
        open
        onClose={() => {
          it.onClose();
        }}
        class="modal"
      >
        {<it.Component resolve={it.resolve} reject={it.reject} />}
      </dialog>
    )}
  </For>
);
