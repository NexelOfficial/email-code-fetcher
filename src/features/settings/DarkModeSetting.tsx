import { createEffect } from "solid-js";
import { Checkbox } from "../../components/Checkbox";
import { useSetting } from "../../settings";

export const DarkModeSetting = () => {
  const dark = useSetting("dark-mode");

  createEffect(() => {
    if (dark.is()) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  });

  return (
    <div class="mt-2">
      <Checkbox
        default={dark.is()}
        onCheck={() => dark.toggle()}
        text="Dark mode"
      />
    </div>
  );
};
