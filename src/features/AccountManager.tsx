import { createEffect, createSignal, For } from "solid-js";
import { ImGoogle } from "solid-icons/im";
import { FiAtSign } from "solid-icons/fi";

import { Button } from "../components/Button";
import { Container } from "../components/Container";
import { getUser, getUsers, removeUser, UserInfo } from "../fetcher";
import toast from "solid-toast";

type AccountManagerProps = {
  running: boolean;
};

export const AccountManager = (props: AccountManagerProps) => {
  const [users, setUsers] = createSignal<UserInfo[]>([]);

  const getAccounts = async () => setUsers(await getUsers());

  createEffect(getAccounts);

  return (
    <div class="flex flex-col">
      <div class="mb-2">
        <For each={users()}>
          {(user) => (
            <Container>
              <p class="flex items-center gap-x-2">
                <FiAtSign />
                <span>{user.email}</span>
              </p>
              <div class="ml-auto">
                <Button
                  active
                  onClick={async () => {
                    if (props.running) {
                      return toast.error("Please stop the fetcher first.");
                    }

                    await removeUser(user.id);
                    await getAccounts();

                    toast.success(`Succesfully removed ${user.email}.`);
                  }}
                >
                  Remove
                </Button>
              </div>
            </Container>
          )}
        </For>
      </div>
      <div class="mx-auto">
        <Button
          icon={ImGoogle}
          onClick={async () => {
            if (props.running) {
              return toast.error("Please stop the fetcher first.");
            }

            await getUser();
            await getAccounts();
          }}
        >
          <span>Add Google account</span>
        </Button>
      </div>
    </div>
  );
};
