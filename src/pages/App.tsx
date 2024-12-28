import { WebviewWindow } from "@tauri-apps/api/webviewWindow";
import { invoke } from "@tauri-apps/api/core";
import { getMatches } from "@tauri-apps/plugin-cli";
import { createEffect, createSignal, For, Show } from "solid-js";
import {
  FiBox,
  FiClock,
  FiCopy,
  FiHash,
  FiList,
  FiPlay,
  FiSettings,
  FiSquare,
} from "solid-icons/fi";
import { ImGoogle } from "solid-icons/im";
import toast, { Toaster } from "solid-toast";

import { Button } from "../components/Button";
import { Category } from "../components/Category";
import { StartupSetting } from "../features/StartupSetting";

type Code = {
  value: string;
  date: Date;
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

const App = () => {
  const [codes, setCodes] = createSignal<Code[]>([]);
  const [fetcher, setFetcher] = createSignal<number>();

  const addCode = (code: string) => {
    setCodes((old) => [...old, { value: code, date: new Date() }]);
  };

  const startFetcher = async () => {
    // Authenticate first
    await authenticate();

    setFetcher(
      setInterval(async () => {
        const snippet = (await invoke("get_last_email")) as string;
        const matches = snippet.match(/[^0-9][0-9]{6,8}[^0-9]/) || [];

        if (matches[0]) {
          const newCode = matches[0].slice(1, matches[0].length - 1);
          addCode(newCode);
          createNotification(newCode);
        }
      }, 5000)
    );

    toast.success(
      "Succesfully started the code fetcher. Updating at 5-second interval."
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

  // Make sure to start the fetcher on startup
  createEffect(async () => {
    const messages = await getMatches();
    if (messages.args.tray.value) {
      await startFetcher();
    }
  });

  return (
    <main class="flex flex-col h-screen">
      <div class="mb-2 bg-blue-800 text-white py-2 px-4">
        <h1 class="font-semibold text-xl">Email Code Fetcher</h1>
      </div>
      <Toaster position="bottom-center" />
      <Category text="Controls" icon={FiBox}>
        <div class="grid grid-cols-2 gap-x-2">
          <Button icon={ImGoogle} onClick={authenticate} successIcon>
            <span>Login with Google</span>
          </Button>
          <Show
            when={!fetcher()}
            fallback={
              <Button active icon={FiSquare} onClick={stopFetcher}>
                <span>Stop receiving codes</span>
              </Button>
            }
          >
            <Button icon={FiPlay} onClick={startFetcher}>
              <span>Start receiving codes</span>
            </Button>
          </Show>
        </div>
      </Category>
      <Category text="Settings" icon={FiSettings}>
        <StartupSetting />
      </Category>
      <Category text="Latest codes" icon={FiList}>
        <div class="px-2 flex flex-col gap-2">
          <Show
            when={codes().length > 0}
            fallback={
              <p class="text-center italic text-gray-600">
                No codes found yet.
              </p>
            }
          >
            <For
              each={codes().sort((a, b) => a.date.getDate() - b.date.getDate())}
            >
              {(code) => (
                <p class="flex items-center gap-x-1">
                  <FiClock />
                  <span>{code.date.toLocaleTimeString()}</span>
                  <FiHash class="ml-6" />
                  <span class="mr-2">{code.value}</span>
                  <Button
                    onClick={() => navigator.clipboard.writeText(code.value)}
                    icon={FiCopy}
                    successIcon
                    small
                  />
                </p>
              )}
            </For>
          </Show>
        </div>
      </Category>

      <p class="text-gray-400 m-auto mb-2">
        © {new Date().getFullYear()} Nathan Diepeveen
      </p>
    </main>
  );
};

export default App;
