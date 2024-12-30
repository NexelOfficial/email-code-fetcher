import { enable, disable } from "@tauri-apps/plugin-autostart";

import { Checkbox } from "../components/Checkbox";
import { useSetting } from "../settings";
import { FiInfo } from "solid-icons/fi";
import { Show } from "solid-js";

export const StartupSetting = () => {
  const start = useSetting("start-with-system");

  return (
    <div>
      <Checkbox
        default={start.is()}
        onCheck={() => {
          start.toggle();
          if (start.is()) {
            enable();
          } else {
            disable();
          }
        }}
        text="Run at startup"
      />
      <Show when={start.is()}>
        <p class="flex gap-x-1 justify-center items-center text-gray-600">
          <FiInfo />
          <span>App will be started in tray.</span>
        </p>
      </Show>
    </div>
  );
};
