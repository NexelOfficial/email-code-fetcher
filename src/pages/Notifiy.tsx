import { invoke } from "@tauri-apps/api/core";
import { createSignal, Show } from "solid-js";
import { useParams } from "@solidjs/router";
import { FiCheck, FiCopy, FiHash } from "solid-icons/fi";

import { Button } from "../components/Button";

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
    setTimeout(hide, 500)
  };

  // Animate the window opening and closing
  setTimeout(() => setHidden(false), 100);
  setTimeout(hide, 5000);

  return (
    <main
      class="h-screen flex items-center bg-white/90 rounded-lg py-1 px-2 transition-all"
      classList={{ "-translate-y-full": hidden() }}
    >
      <h1 class="text-lg flex gap-x-1 items-center text-gray-800">
        <FiHash />
        <span>Your code: {code}</span>
      </h1>
      <div class="ml-auto">
        <Show when={!copied()} fallback={<Button icon={FiCheck} />}>
          <Button onClick={copyCode} icon={FiCopy} />
        </Show>
      </div>
    </main>
  );
};

export default Notifiy;
