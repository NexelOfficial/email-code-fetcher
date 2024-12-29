import { createEffect, createSignal, For } from "solid-js";
import { ImGoogle } from "solid-icons/im";
import { FiAtSign } from "solid-icons/fi";

import { Button } from "../components/Button";
import { Container } from "../components/Container";
import { getUser, getUsers, removeUser, UserInfo } from "../fetcher";

export const AccountManager = () => {
  const [users, setUsers] = createSignal<UserInfo[]>([]);

  const addAccount = (account: UserInfo) => setUsers((o) => [...o, account]);
  const getAccounts = async () => setUsers(await getUsers());

  createEffect(getAccounts);

  return (
    <div>
      <div class="mb-4">
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
                    await removeUser(user.id);
                    await getAccounts();
                  }}
                >
                  Remove
                </Button>
              </div>
            </Container>
          )}
        </For>
      </div>
      <Button
        icon={ImGoogle}
        onClick={async () => addAccount(await getUser())}
        successIcon
      >
        <span>Add Google account</span>
      </Button>
    </div>
  );
};
