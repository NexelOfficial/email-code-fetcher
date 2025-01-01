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

export const Onboarding = () => {
  const onboarding = useSetting("onboarding");
  const step = useStep();

  const finish = () => {
    onboarding.setSetting("true");
    window.location.href = "/";
  };

  return (
    <main class="flex flex-col p-4 min-h-screen text-gray-800 bg-gray-100 dark:text-white dark:bg-gray-900">
      <AuthenticationModal />

      <Container class="my-auto flex-col">
        <h1 class="mx-auto text-lg font-semibold">Let's get started</h1>
        <Show when={step.is(0)}>
          <p>Please choose your theme below.</p>
          <div class="w-full mb-4 flex flex-col">
            <ThemePickerSetting />
            <div class="mx-auto mt-4">
              <Button
                onClick={() =>
                  createCodeNotification({
                    address: "example@gmail.com",
                    value: "123456",
                  })
                }
              >
                Send test notification
              </Button>
            </div>
          </div>
        </Show>
        <Show when={step.is(1)}>
          <p>Add at least one Google account.</p>
          <div class="w-full mb-4 mt-2">
            <AccountManager running={false} />
          </div>
        </Show>
        <Show when={step.is(2)}>
          <p>Would you like to start the app with your device?</p>
          <div class="w-full mb-4 mt-2">
            <StartupSetting />
          </div>
        </Show>
        <div class="space-x-2">
          <Button onClick={step.previous}>Back</Button>
          <Show
            when={!step.is(2)}
            fallback={
              <Button onClick={finish} active>
                Finish
              </Button>
            }
          >
            <Button onClick={step.next} active>
              Continue
            </Button>
          </Show>
        </div>
      </Container>
    </main>
  );
};
