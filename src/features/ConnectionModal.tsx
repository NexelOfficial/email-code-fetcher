import { createEffect, createSignal } from "solid-js";
import { FiWifiOff } from "solid-icons/fi";
import { Portal } from "solid-js/web";
import { createConnectivitySignal } from "@solid-primitives/connectivity";

import { Container } from "../components/Container";
import { Button } from "../components/Button";
import { useAppInfo } from "../signals";

export const ConnectionModal = () => {
  const [hidden, setHidden] = createSignal(navigator.onLine);
  const isOnline = createConnectivitySignal();
  const { name } = useAppInfo();

  // Hide / show modal based on connection
  createEffect(() => setHidden(isOnline()));

  return (
    <div
      class="transition-all fixed z-40 flex size-full top-0"
      classList={{
        "backdrop-blur-sm bg-black/20": !hidden(),
        "pointer-events-none": hidden(),
      }}
    >
      <Container
        class="transition-all m-auto w-4/5 flex-col gap-2 text-lg py-4"
        classList={{
          "scale-90 opacity-0": hidden(),
          "scale-100 opacity-1": !hidden(),
        }}
      >
        <h2 class="font-semibold text-2xl flex items-center gap-2">
          <FiWifiOff />
          <span>No connection</span>
        </h2>
        <p class="mt-2">
          Please connect to the internet in order to use {name()}.
        </p>

        <Button onClick={() => setHidden(true)} active>
          I understand
        </Button>
      </Container>
      <Portal>
        <div
          class="fixed transition-all bottom-0 w-full bg-red-500 py-1 px-2 origin-bottom"
          classList={{
            "h-0 scale-y-0": isOnline(),
          }}
        >
          <p class="flex items-center gap-x-2 text-white">
            <FiWifiOff />
            <span>No connection</span>
          </p>
        </div>
      </Portal>
    </div>
  );
};
