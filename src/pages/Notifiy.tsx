import { invoke } from "@tauri-apps/api/core";
import { createSignal, Show } from "solid-js";
import { useSearchParams } from "@solidjs/router";
import {
  FiAlertTriangle,
  FiAtSign,
  FiCheck,
  FiCopy,
  FiHash,
} from "solid-icons/fi";

import { getSetting } from "../settings";

const Notifiy = () => {
  const [copied, setCopied] = createSignal(false);
  const [hidden, setHidden] = createSignal(true);

  const [searchParams] = useSearchParams();

  const code = searchParams.code as string;
  const sender = searchParams.sender as string;
  const message = searchParams.message as string;

  const hide = () => {
    setHidden(true);
    setTimeout(async () => await invoke("close_notification"), 500);
  };

  const duration = () => {
    const time = getSetting("notification-time") || "5";
    return parseFloat(time) * 1000;
  };

  const copyCode = async () => {
    navigator.clipboard.writeText(code);

    setCopied(true);
    hide();
  };

  // Animate the window opening and closing
  setTimeout(() => setHidden(false), 100);
  setTimeout(hide, duration());

  return (
    <button
      onClick={copyCode}
      class="text-lg w-full relative transition-all overflow-hidden"
      classList={{
        "-translate-y-full": hidden(),
        dark: getSetting("dark-mode") === "true",
      }}
    >
      <div class="pb-3 flex-col py-1 px-3 gap-2 rounded border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 dark:text-white">
        <Show
          when={!message}
          fallback={
            <div class="flex gap-x-2 items-center w-full">
              <FiAlertTriangle />
              <span class="text-base">{message}</span>
            </div>
          }
        >
          <div class="flex items-center gap-x-2 w-full">
            <FiHash />
            <span class="font-bold">{code}</span>

            <Show when={!copied()} fallback={<FiCheck class="ml-auto" />}>
              <FiCopy class="ml-auto" />
            </Show>
          </div>
          <div class="flex items-center gap-x-2 w-full text-base text-gray-600">
            <FiAtSign />
            <span>{sender}</span>
          </div>
        </Show>

        <div class="absolute w-2/3 z-10 bottom-0 left-1/2 h-1 -translate-x-1/2 bg-gray-300 dark:bg-gray-600">
          <div
            class="h-1 z-10 bg-gray-800 dark:bg-white ease-linear"
            style={{ "transition-duration": `${duration()}ms` }}
            classList={{
              "w-0": !hidden(),
              "w-full": hidden(),
            }}
          />
        </div>
      </div>
    </button>
  );
};

export default Notifiy;
