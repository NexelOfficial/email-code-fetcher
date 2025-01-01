import { makeConnectivityListener } from "@solid-primitives/connectivity";
import { Checkbox } from "../components/Checkbox";
import { useSetting } from "../settings";
import { createMessageNotification } from "../notifications";

export const ConnectionSetting = () => {
  const notifications = useSetting("connection-notifications", "true");

  makeConnectivityListener((isOnline) => {
    if (!notifications.is()) {
      return;
    }

    createMessageNotification(
      isOnline
        ? "You're back online. Codes can be received again."
        : "You're currently offline. No codes can be received."
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
