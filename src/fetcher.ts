import { WebviewWindow } from "@tauri-apps/api/webviewWindow";
import { invoke } from "@tauri-apps/api/core";
import toast from "solid-toast";
import { createSignal } from "solid-js";

export type EmailCode = {
  value: string;
  address: string;
};

const createNotification = (code: string) => {
  const webview = new WebviewWindow("notification", {
    width: 300,
    height: 50,
    transparent: true,
    alwaysOnTop: true,
    decorations: false,
    dragDropEnabled: false,
    shadow: false,
    y: 8,
    x: 8,
    url: `notification/${code}`,
  });

  webview.once("tauri://error", (e) => console.error(e));
};

export const useFetcher = () => {
  const [stopped, setStopped] = createSignal(true);
  const [ready, setReady] = createSignal(true);

  const fetch = async (callback: (code: EmailCode) => void) => {
    // Stop trigger
    if (stopped()) {
      return setReady(true);
    }

    // Extract code from last email
    const message = await invoke<EmailCode>("get_last_email");
    if (message.value) {
      callback(message);
      createNotification(message.value);
    }

    // Run again after 5 seconds
    setTimeout(() => fetch(callback), 5000);
  };

  const start = async (callback: (code: EmailCode) => void) => {
    if (!ready()) {
      return toast.error("Fetcher is not ready yet.");
    }

    setStopped(false);

    // Authenticate first
    await authenticate();
    await fetch(callback);

    toast.success(
      "Succesfully started the code fetcher. Updating at 5-second interval."
    );
  };

  const stop = async () => {
    setStopped(true);
    setReady(false);

    await invoke("close_notification");
    toast.success("Succesfully stopped the code fetcher.");
  };

  return { stopped, start, stop };
};

export const authenticate = async () => {
  await invoke("authenticate");
};
