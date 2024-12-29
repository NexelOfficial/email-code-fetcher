import { IconTypes } from "solid-icons";
import { FiChevronUp } from "solid-icons/fi";
import { createSignal, JSX } from "solid-js";

type CategoryProps = {
  icon: IconTypes;
  text: string;
  children: JSX.Element;
  hidden?: boolean;
};

export const Category = (props: CategoryProps) => {
  const [hidden, setHidden] = createSignal(props.hidden || false);

  return (
    <div class="p-2">
      <button onClick={() => setHidden(!hidden())} class="w-full">
        <p class="flex gap-x-2 items-center border-b-2 pb-1 mb-3 px-2">
          <props.icon />
          <span>{props.text}</span>
          <FiChevronUp class="ml-auto" classList={{ "rotate-180": hidden() }} />
        </p>
      </button>
      <div
        class="origin-top transition-all"
        classList={{
          "h-0 scale-y-0": hidden(),
        }}
      >
        {props.children}
      </div>
    </div>
  );
};
