import { createSignal, JSX, Show } from "solid-js";
import { IconTypes } from "solid-icons";
import { FiLoader } from "solid-icons/fi";

type ButtonProps = {
  onClick?: () => Promise<void>;
  icon?: IconTypes;
  children?: JSX.Element;
};

export const Button = (props: ButtonProps) => {
  const [loading, setLoading] = createSignal(false);

  const clickPromise = () => {
    if (props.onClick) {
      setLoading(true);
      props.onClick().then(() => setLoading(false));
    }
  };

  const Icon = () => {
    if (props.icon) {
      return <props.icon />;
    } else {
      return <></>;
    }
  };

  return (
    <button
      class="rounded border-gray-200 border-2 py-2 px-4 gap-x-2 flex items-center"
      classList={{
        "pointer-events-none cursor-default": !props.onClick,
      }}
      onClick={clickPromise}
    >
      <Show when={loading()} fallback={<Icon />}>
        <FiLoader class="animate-spin" />
      </Show>
      {props.children}
    </button>
  );
};
