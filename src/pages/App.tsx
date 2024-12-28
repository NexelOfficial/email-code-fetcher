import { WebviewWindow } from "@tauri-apps/api/webviewWindow";
import { invoke } from "@tauri-apps/api/core";
import { createSignal, Show } from "solid-js";
import { FiInfo, FiPlay, FiStopCircle } from "solid-icons/fi";
import { ImGoogle } from "solid-icons/im";
import toast, { Toaster } from "solid-toast";

import { Button } from "../components/Button";

const createNotification = (code: string) => {
  new WebviewWindow("notification", {
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
};

const App = () => {
  const [code, setCode] = createSignal("");
  const [fetcher, setFetcher] = createSignal<number>();

  const startFetcher = async () => {
    // Authenticate first
    await authenticate();

    setFetcher(
      setInterval(async () => {
        const snippet = (await invoke("get_last_email")) as string;
        const matches = snippet.match(/[0-9]{6}/) || [];
        setCode(matches[0] || "");

        if (matches[0]) {
          createNotification(code());
        }
      }, 10000)
    );

    toast.success(
      "Succesfully started the code fetcher. Updating at 10-second interval."
    );
  };

  const stopFetcher = async () => {
    clearInterval(fetcher());
    setFetcher();

    await invoke("close_notification");
    toast.success("Succesfully stopped the code fetcher.");
  };

  const authenticate = async () => {
    await invoke("authenticate");
  };

  return (
    <main class="p-2">
      <Toaster />
      <div class="w-fit">
        <div class="flex gap-x-2">
          <Button icon={ImGoogle} onClick={authenticate}>
            <span>Login with Google</span>
          </Button>
          <Show
            when={!fetcher()}
            fallback={
              <Button icon={FiStopCircle} onClick={stopFetcher}>
                <span>Stop receiving codes</span>
              </Button>
            }
          >
            <Button icon={FiPlay} onClick={startFetcher}>
              <span>Start receiving codes</span>
            </Button>
          </Show>
        </div>

        <p class="flex gap-x-1 items-center mt-2 border-2 border-gray-200 py-2 px-4">
          <FiInfo />
          <span>Latest code:</span>
          <span>{code()}</span>
        </p>
      </div>
    </main>
  );
};

export default App;
