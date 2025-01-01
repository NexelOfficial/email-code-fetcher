import { getMatches } from "@tauri-apps/plugin-cli";
import { createEffect, createSignal, Show } from "solid-js";
import { FiList, FiPlay, FiSettings, FiSquare, FiUser } from "solid-icons/fi";
import { Toaster } from "solid-toast";

import { Button } from "../components/Button";
import { Category } from "../components/Category";
import { StartupSetting } from "../features/StartupSetting";
import { NotificationTime } from "../features/NotificationTime";
import { EmailCode, useFetcher } from "../fetcher";
import { AuthenticationModal } from "../features/AuthenticationModal";
import { AccountManager } from "../features/AccountManager";
import { DarkModeSetting } from "../features/settings/DarkModeSetting";
import { ConnectionSetting } from "../features/settings/ConnectionSetting";
import { ConnectionModal } from "../features/ConnectionModal";
import { useSetting } from "../settings";
import { CodeList } from "../features/CodeList";
import { useAppInfo } from "../signals";

export const App = () => {
  const [codes, setCodes] = createSignal<EmailCode[]>([]);
  const { start, stop, running } = useFetcher();
  const { version, name } = useAppInfo();
  const onboarding = useSetting("onboarding");

  const addCode = (code: EmailCode) => {
    setCodes((old) => [...old, code]);
  };

  // Make sure to start the fetcher on startup
  createEffect(async () => {
    const messages = await getMatches();
    if (messages.args.tray.value) {
      await start(addCode);
    }
  });

  // Start onboarding if it's the first time
  createEffect(() => {
    if (!onboarding.is()) {
      window.location.href = "/onboarding";
    }
  });

  return (
    <main class="flex flex-col min-h-screen text-gray-800 bg-gray-100 dark:text-white dark:bg-gray-900">
      <Toaster position="bottom-center" />
      <AuthenticationModal />
      <ConnectionModal />

      <div class="p-2 px-4 flex gap-x-2 items-center">
        <h1 class="text-xl font-semibold">{name()}</h1>
        <div class="ml-auto flex gap-x-2">
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

      <div class="md:grid grid-cols-2">
        <div>
          <Category text="Accounts" icon={FiUser}>
            <AccountManager running={running().length > 0} />
          </Category>
          <Category text="Settings" icon={FiSettings}>
            <StartupSetting />
            <DarkModeSetting />
            <ConnectionSetting />
            <NotificationTime />
          </Category>
        </div>
        <div>
          <Category text="Latest codes" icon={FiList}>
            <CodeList codes={codes()} />
          </Category>
        </div>
      </div>

      <p class="text-gray-400 m-auto mb-2">
        © {new Date().getFullYear()} Nathan Diepeveen &#x2022; {version()}
      </p>
    </main>
  );
};
