import { invoke } from "@tauri-apps/api/core";
import { Show } from "solid-js";
import { Button } from "../components/Button";
import { Container } from "../components/Container";
import { ThemePickerSetting } from "../features/settings/ThemePickerSetting";
import { AccountManager } from "../features/AccountManager";
import { AuthenticationModal } from "../features/AuthenticationModal";
import { StartupSetting } from "../features/StartupSetting";
import { createCodeNotification } from "../notifications";
import { useStep } from "../signals";
import { useSetting } from "../settings";
import { NotificationTime } from "../features/NotificationTime";

export const Onboarding = () => {
  const onboarding = useSetting("onboarding");
  const step = useStep(3, () => {
    onboarding.setSetting("true");
    window.location.href = "/";
  });

  const sendTest = () => {
    // Clear old one and create new one
    invoke("close_notification").then(() => {
      createCodeNotification({
        address: "example@gmail.com",
        value: "123456",
      });
    });
  };

  return (
    <main class="flex flex-col p-4 min-h-screen text-gray-800 bg-gray-100 dark:text-white dark:bg-gray-900">
      <AuthenticationModal />

      <Container class="my-auto flex-col w-96 max-w-full mx-auto">
        <h1 class="mx-auto text-lg font-semibold">Let's get started</h1>
        <Show when={step.is(0)}>
          <p>Please choose your theme below.</p>
          <div class="w-full flex flex-col">
            <ThemePickerSetting />
          </div>
        </Show>
        <Show when={step.is(1)}>
          <p>How long would you like your notifications to last?</p>
          <div class="w-full mt-2">
            <NotificationTime />
          </div>
        </Show>
        <Show when={step.is(2)}>
          <p>Add at least one Google account.</p>
          <div class="w-full mb-4 mt-2">
            <AccountManager running={false} />
          </div>
        </Show>
        <Show when={step.is(3)}>
          <p>Would you like to start the app with your device?</p>
          <div class="w-full mb-4 mt-2">
            <StartupSetting />
          </div>
        </Show>

        <Show when={step.is(0) || step.is(1)}>
          <div class="mx-auto my-2">
            <Button onClick={sendTest}>Send test notification</Button>
          </div>
        </Show>
        <div class="space-x-2">
          <Button onClick={step.previous}>Back</Button>
          <Button onClick={step.next} active>
            {step.isLast() ? "Finish" : "Continue"}
          </Button>
        </div>
      </Container>
    </main>
  );
};
