import { createMutation } from "@tanstack/solid-query";
import { createSignal } from "solid-js";
import { type ModalProps, showModal } from "../modals";
import { telegramClient } from "../mtprotoClient";

export const PhoneCodeModal = (props: ModalProps<string>) => {
	const [phoneCode, setPhoneCode] = createSignal("");

	return (
		<div class="modal-box flex flex-col items-center">
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
						class="input input-bordered mt-4 w-full max-w-xs"
						onInput={(e) => {
							setPhoneCode(e.target.value);
						}}
						value={phoneCode()}
					/>

					<button type="button" class="btn btn-primary mt-4">
						Submit
					</button>

					<button
						onClick={() => {
							props.reject("closed");
						}}
						type="button"
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
			class="flex h-screen flex-col items-center justify-center"
		>
			Input your phone number
			<input
				type="text"
				placeholder="+78005353535"
				class="input input-bordered mt-2 w-full max-w-xs"
				onInput={(e) => {
					setPhoneNumber(e.target.value);
				}}
				value={phoneNumber()}
			/>
			<button type="button" class="btn btn-outline mt-4">
				Submit
			</button>
		</form>
	);
};
