import { TelegramClient, sessions } from "telegram";

const appId = import.meta.env.VITE_APP_ID;
const appHash = import.meta.env.VITE_APP_HASH;

const prevSession = localStorage.getItem("mtproto_session");

const session = new sessions.StringSession(prevSession ?? "");

export const telegramClient = new TelegramClient(session, appId, appHash, {
	connectionRetries: 5,
});
