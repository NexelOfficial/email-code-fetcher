import { getName, getVersion } from "@tauri-apps/api/app";
import { createEffect, createSignal } from "solid-js";

export const useAppInfo = () => {
  const [name, setName] = createSignal("");
  const [version, setVersion] = createSignal("");

  createEffect(async () => {
    setName(await getName());
    setVersion(await getVersion());
  });

  return { name, version };
};

export const useStep = (length: number, onFinish: () => void) => {
  const [current, setCurrent] = createSignal(0);

  const next = () => {
    if (current() === length) {
      return onFinish();
    }

    setCurrent(current() + 1);
  };
  const previous = () => setCurrent(Math.max(current() - 1, 0));
  const is = (value: number) => current() === value;
  const isLast = () => current() === length;

  return { is, isLast, next, previous };
};
