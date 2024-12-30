import { invoke } from "@tauri-apps/api/core";
import toast from "solid-toast";
import { createSignal } from "solid-js";

import { createCodeNotification } from "./notifications";

export type EmailCode = {
  value: string;
  address: string;
};

export type UserInfo = {
  id: string;
  email: string;
};

type LongId = [string, Date];

export const useFetcher = () => {
  const [running, setRunning] = createSignal<LongId[]>([]);

  const fetch = async (longId: LongId, callback: (code: EmailCode) => void) => {
    // Stop trigger
    if (!running().includes(longId)) {
      return;
    }

    // Extract code from last email
    const message = await invoke<EmailCode>("get_last_email", {
      id: longId[0],
    });

    if (message.value) {
      callback(message);
      createCodeNotification(message);
    }

    // Run again after interval
    setTimeout(() => fetch(longId, callback), 5000);
  };

  const start = async (callback: (code: EmailCode) => void) => {
    if (running().length > 0) {
      return toast.error("Fetcher is not ready yet.");
    }

    // Remove duplicate emails
    const users = await getUsers();
    const unique = Array.from(
      new Map(users.map((item) => [item.email, item])).values()
    );

    // Check for no account
    if (users.length === 0) {
      return toast.error(
        "No accounts were added. Add one under the 'Accounts' tab."
      );
    }

    // Create a LongId for each user
    for (const user of unique) {
      const longId: LongId = [user.id, new Date()];
      setRunning((r) => [...r, longId]);
      await fetch(longId, callback);
    }

    // Get interval string
    toast.success(`Succesfully started the code fetcher.`);
  };

  const stop = async () => {
    setRunning([]);

    await invoke("close_notification");
    toast.success("Succesfully stopped the code fetcher.");
  };

  return { running, start, stop };
};

export const getUsers = async () => {
  const info = await invoke("get_users");
  return Object.values(info!) as UserInfo[];
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
