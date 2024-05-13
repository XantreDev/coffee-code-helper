import { createSignal } from "solid-js";
import { createMutation } from "@tanstack/solid-query";
import { telegramClient } from "../mtprotoClient";
import { ModalProps, showModal } from "../modals";

export const PhoneCodeModal = (props: ModalProps<string>) => {
  const [phoneCode, setPhoneCode] = createSignal("");

  return (
    <div class="modal-box items-center flex flex-col">
      <h3 class="font-bold text-lg">Enter phone code</h3>
      <div class="modal-action contents">
        <form
          onSubmit={() => {
            props.resolve(phoneCode());
          }}
          class="contents"
        >
          <input
            type="text"
            class="mt-4 input input-bordered w-full max-w-xs"
            onInput={(e) => {
              setPhoneCode(e.target.value);
            }}
            value={phoneCode()}
          />

          <button class="btn btn-primary mt-4">Submit</button>

          <button
            onClick={() => {
              props.reject("closed");
            }}
            class="btn mt-2"
          >
            Close
          </button>
        </form>
      </div>
    </div>
  );
};

export const LoginScreen = () => {
  const [phoneNumber, setPhoneNumber] = createSignal("");

  const loginMutation = createMutation(() => ({
    mutationFn: () =>
      telegramClient.start({
        phoneNumber: phoneNumber(),
        onError: async (err) => {
          console.error(err);
          return false;
        },
        phoneCode: () => showModal(PhoneCodeModal),
      }),
  }));

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();

        loginMutation.mutate();
      }}
      class="h-screen flex items-center justify-center flex-col"
    >
      Input your phone number
      <input
        type="text"
        placeholder="+78005353535"
        class="mt-2 input input-bordered w-full max-w-xs"
        onInput={(e) => {
          setPhoneNumber(e.target.value);
        }}
        value={phoneNumber()}
      />
      <button class="btn mt-4 btn-outline">Submit</button>
    </form>
  );
};
