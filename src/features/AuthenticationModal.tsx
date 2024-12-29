import { openUrl } from "@tauri-apps/plugin-opener";
import { listen } from "@tauri-apps/api/event";
import { createSignal } from "solid-js";
import { ImGoogle } from "solid-icons/im";

import { Container } from "../components/Container";
import { Button } from "../components/Button";

export const AuthenticationModal = () => {
  const [authUrl, setAuthUrl] = createSignal("");

  listen("show-auth-modal", (event) => setAuthUrl(event.payload as string));
  listen("hide-auth-modal", () => setAuthUrl(""));

  return (
    <div
      class="transition-all fixed z-40 flex size-full top-0"
      classList={{
        "backdrop-blur-sm bg-black/20": authUrl() !== "",
        "pointer-events-none": authUrl() === "",
      }}
    >
      <Container
        class="transition-all m-auto w-4/5 flex-col gap-2 text-lg py-4"
        classList={{
          "scale-90 opacity-0": authUrl() === "",
          "scale-100 opacity-1": authUrl() !== "",
        }}
      >
        <h2 class="font-semibold text-2xl flex items-center gap-2">
          <ImGoogle />
          <span>Login with Google</span>
        </h2>
        <p class="mt-2">
          Please follow the instructions in your browser and authenticate with
          Google.
        </p>
        <h3 class="font-semibold">
          Make sure to give proper access by checking the checkboxes!
        </h3>

        <i class="text-gray-600 text-sm mb-4">
          These permissions are needed to extract a code from your latest email.
          Your emails won't pass through a server.
        </i>
        <Button onClick={() => openUrl(authUrl())} active>
          Authenticate
        </Button>
      </Container>
    </div>
  );
};
