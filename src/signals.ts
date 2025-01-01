import { getName } from "@tauri-apps/api/app";
import { createEffect, createSignal } from "solid-js";

export const useName = () => {
  const [name, setName] = createSignal("");

  createEffect(async () => setName(await getName()));

  return name;
};

export const useStep = () => {
  const [current, setCurrent] = createSignal(0);

  const next = () => setCurrent(current() + 1);
  const previous = () => setCurrent(Math.max(current() - 1, 0));
  const is = (value: number) => current() === value;

  return { is, next, previous };
};
