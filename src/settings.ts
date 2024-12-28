import { createEffect, createSignal } from "solid-js";

export const useSetting = (key: string) => {
  const [setting, setSetting] = createSignal("");

  const stored = localStorage.getItem(`app.v1.settings.${key}`);
  if (stored) {
    setSetting(stored);
  }

  createEffect(() => localStorage.setItem(`app.v1.settings.${key}`, setting()));

  const toggle = () => {
    setSetting(setting() === "true" ? "false" : "true");
  };

  const is = () => setting() === "true";

  return { setting, setSetting, toggle, is };
};

export const getSetting = (key: string) => {
  return localStorage.getItem(`app.v1.settings.${key}`);
};
