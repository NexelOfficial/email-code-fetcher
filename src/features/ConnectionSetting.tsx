import { Checkbox } from "../components/Checkbox";
import { useSetting } from "../settings";
import { createMessageNotification } from "../notifications";

export const ConnectionSetting = () => {
  const notifications = useSetting("connection-notifications", "true");

  window.addEventListener("offline", () => {
    if (!notifications.is()) {
      return;
    }

    createMessageNotification(
      "You're currently offline. No codes can be received."
    );
  });

  window.addEventListener("online", () => {
    if (!notifications.is()) {
      return;
    }

    createMessageNotification(
      "You're back online. Codes can be received again."
    );
  });

  return (
    <div class="mt-2">
      <Checkbox
        default={notifications.is()}
        onCheck={() => notifications.toggle()}
        text="Show network notifications"
      />
    </div>
  );
};
