import { getMatches } from "@tauri-apps/plugin-cli";
import { createEffect, createSignal, For, Show } from "solid-js";
import {
  FiAtSign,
  FiClock,
  FiCopy,
  FiHash,
  FiList,
  FiPlay,
  FiSettings,
  FiSquare,
  FiUser,
} from "solid-icons/fi";
import toast, { Toaster } from "solid-toast";

import { Button } from "../components/Button";
import { Category } from "../components/Category";
import { StartupSetting } from "../features/StartupSetting";
import { NotificationTime } from "../features/NotificationTime";
import { Container } from "../components/Container";
import { EmailCode, useFetcher } from "../fetcher";
import { AuthenticationModal } from "../features/AuthenticationModal";
import { AccountManager } from "../features/AccountManager";
import { DarkModeSetting } from "../features/DarkModeSetting";

const App = () => {
  const [codes, setCodes] = createSignal<EmailCode[]>([]);
  const { start, stop, running } = useFetcher();

  const addCode = (code: EmailCode) => {
    setCodes((old) => [...old, code]);
  };

  const extractEmail = (address: string) => {
    const matches = address.match(/<[^]+>/g) || [];
    const email = matches[0];

    return email?.slice(1, email.length - 1) || address;
  };

  // Make sure to start the fetcher on startup
  createEffect(async () => {
    const messages = await getMatches();
    if (messages.args.tray.value) {
      await start(addCode);
    }
  });

  return (
    <main class="flex flex-col min-h-screen text-gray-800 bg-gray-100 dark:text-white dark:bg-gray-900">
      <AuthenticationModal />
      <div class="p-2 px-4 flex gap-x-2 items-center">
        <h1 class="text-xl font-semibold">Email Code Fetcher</h1>
        <div class="ml-auto">
          <Show
            when={running().length === 0}
            fallback={
              <Button active icon={FiSquare} onClick={stop}>
                <span>Stop</span>
              </Button>
            }
          >
            <Button icon={FiPlay} onClick={async () => await start(addCode)}>
              <span>Start</span>
            </Button>
          </Show>
        </div>
      </div>

      <Toaster position="bottom-center" />
      <Category text="Accounts" icon={FiUser}>
        <AccountManager running={running().length > 0} />
      </Category>
      <Category text="Settings" icon={FiSettings} hidden>
        <StartupSetting />
        <DarkModeSetting />
        <NotificationTime />
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
            <For each={codes()}>
              {(code) => (
                <button
                  onClick={async () => {
                    navigator.clipboard.writeText(code.value);
                    toast.success("Copied to clipboard.");
                  }}
                >
                  <Container>
                    <div>
                      <div class="flex gap-x-6">
                        <p class="flex items-center gap-x-1">
                          <FiClock />
                          <span>{new Date().toLocaleTimeString()}</span>
                        </p>
                        <p class="flex items-center gap-x-1">
                          <FiHash />
                          <span>{code.value}</span>
                        </p>
                      </div>
                      <p class="flex items-center gap-x-1">
                        <FiAtSign />
                        <span>{extractEmail(code.address)}</span>
                      </p>
                    </div>
                    <FiCopy class="ml-auto" />
                  </Container>
                </button>
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
