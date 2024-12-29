import { getMatches } from "@tauri-apps/plugin-cli";
import { createEffect, createSignal, For, Show } from "solid-js";
import {
  FiAtSign,
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
import { UpdateInterval } from "../features/UpdateInterval";
import { Container } from "../components/Container";
import { authenticate, EmailCode, useFetcher } from "../fetcher";
import { AuthenticationModal } from "../features/AuthenticationModal";

const App = () => {
  const [codes, setCodes] = createSignal<EmailCode[]>([]);
  const { start, stop, stopped } = useFetcher();

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
    <main class="flex flex-col min-h-screen bg-gray-100">
      <AuthenticationModal />

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
            when={stopped()}
            fallback={
              <Button active icon={FiSquare} onClick={stop}>
                <span>Stop receiving codes</span>
              </Button>
            }
          >
            <Button
              icon={FiPlay}
              onClick={async () => {
                await start(addCode);
              }}
            >
              <span>Start receiving codes</span>
            </Button>
          </Show>
        </div>
      </Category>
      <Category text="Settings" icon={FiSettings}>
        <StartupSetting />
        <UpdateInterval />
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
