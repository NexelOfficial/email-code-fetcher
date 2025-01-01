import { createEffect } from "solid-js";
import { Radio } from "../../components/Radio";
import { useSetting } from "../../settings";

export const ThemePickerSetting = () => {
  const dark = useSetting("dark-mode");

  createEffect(() => {
    if (dark.is()) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  });

  return (
    <div class="mt-2 space-y-1">
      <Radio
        onCheck={() => dark.setSetting("true")}
        checked={dark.is()}
        text="Dark"
      />
      <Radio
        onCheck={() => dark.setSetting("false")}
        checked={!dark.is()}
        text="Light"
      />
    </div>
  );
};
