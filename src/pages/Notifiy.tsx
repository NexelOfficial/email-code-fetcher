import { invoke } from "@tauri-apps/api/core";
import { createSignal, Show } from "solid-js";
import { useParams } from "@solidjs/router";
import { FiCheck, FiCopy, FiHash } from "solid-icons/fi";

import { Container } from "../components/Container";

const Notifiy = () => {
  const [copied, setCopied] = createSignal(false);
  const [hidden, setHidden] = createSignal(true);

  const { code } = useParams();

  const hide = () => {
    setHidden(true);
    setTimeout(async () => await invoke("close_notification"), 500);
  };

  const copyCode = async () => {
    navigator.clipboard.writeText(code);

    setCopied(true);
    setTimeout(hide, 500);
  };

  // Animate the window opening and closing
  setTimeout(() => setHidden(false), 100);
  setTimeout(hide, 5000);

  return (
    <button
      onClick={copyCode}
      class="text-lg w-full relative transition-all"
      classList={{ "-translate-y-full": hidden() }}
    >
      <Container class="pb-3">
        <span>New code</span>
        <FiHash class="ml-auto" />
        <span class="font-bold">{code}</span>

        <Show when={!copied()} fallback={<FiCheck />}>
          <FiCopy class="ml-4" />
        </Show>

        <div class="absolute w-2/3 z-10 bottom-0 left-1/2 h-1 -translate-x-1/2 bg-gray-300">
          <div
            class="h-1 z-10 bg-gray-800 duration-[5s] ease-linear"
            classList={{
              "w-0": !hidden(),
              "w-full": hidden(),
            }}
          />
        </div>
      </Container>
    </button>
  );
};

export default Notifiy;
