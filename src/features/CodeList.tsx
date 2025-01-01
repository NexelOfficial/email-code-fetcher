import { For, Show } from "solid-js";
import { EmailCode } from "../fetcher";
import { Container } from "../components/Container";
import toast from "solid-toast";
import { FiAtSign, FiClock, FiCopy, FiHash } from "solid-icons/fi";

type CodeListProps = {
  codes: EmailCode[];
};

export const CodeList = (props: CodeListProps) => {
  const extractEmail = (address: string) => {
    const matches = address.match(/<[^]+>/g) || [];
    const email = matches[0];

    return email?.slice(1, email.length - 1) || address;
  };

  return (
    <div class="px-2 flex flex-col gap-2">
      <Show
        when={props.codes.length > 0}
        fallback={
          <p class="text-center italic text-gray-600">No codes found yet.</p>
        }
      >
        <For each={props.codes}>
          {(code) => (
            <button
              onClick={async () => {
                navigator.clipboard.writeText(code.value);
                toast.success("Copied to clipboard.");
              }}
            >
              <Container>
                <div>
                  <div class="flex gap-x-6">
                    <p class="flex items-center gap-x-1">
                      <FiClock />
                      <span>{new Date().toLocaleTimeString()}</span>
                    </p>
                    <p class="flex items-center gap-x-1">
                      <FiHash />
                      <span>{code.value}</span>
                    </p>
                  </div>
                  <p class="flex items-center gap-x-1">
                    <FiAtSign />
                    <span>{extractEmail(code.address)}</span>
                  </p>
                </div>
                <FiCopy class="ml-auto" />
              </Container>
            </button>
          )}
        </For>
      </Show>
    </div>
  );
};
