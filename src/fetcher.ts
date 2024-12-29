import { WebviewWindow } from "@tauri-apps/api/webviewWindow";
import { invoke } from "@tauri-apps/api/core";
import toast from "solid-toast";
import { createSignal } from "solid-js";

export type EmailCode = {
  value: string;
  address: string;
};

export type UserInfo = {
  id: string;
  email: string;
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

  const fetch = async (id: string, callback: (code: EmailCode) => void) => {
    // Stop trigger
    if (stopped()) {
      return setReady(true);
    }

    // Extract code from last email
    const message = await invoke<EmailCode>("get_last_email", {
      id,
    });

    if (message.value) {
      callback(message);
      createNotification(message.value);
    }

    // Run again after 5 seconds
    setTimeout(() => fetch(id, callback), 5000);
  };

  const start = async (callback: (code: EmailCode) => void) => {
    if (!ready()) {
      return toast.error("Fetcher is not ready yet.");
    }

    setStopped(false);

    // Remove duplicate emails
    const users = await getUsers();
    const unique = Array.from(
      new Map(users.map((item) => [item.email, item])).values()
    );

    for (const user of unique) {
      await fetch(user.id, callback);
    }

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

export const getUsers = async () => {
  const info = await invoke("get_users");
  return info as UserInfo[];
};

export const getUser = async (id?: string) => {
  // If no ID is given, a new user is being created
  if (!id) {
    id = Math.floor(Math.random() * 2e8).toString();
  }

  const info = await invoke("get_user", { id });
  return info as UserInfo;
};

export const removeUser = async (id: string) => {
  await invoke("remove_user", { id });
};
