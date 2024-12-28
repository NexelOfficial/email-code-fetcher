import { createSignal, JSX, Show } from "solid-js";
import { IconTypes } from "solid-icons";
import { FiCheck, FiLoader } from "solid-icons/fi";

type ButtonProps = {
  onClick?: () => Promise<void>;
  icon?: IconTypes;
  successIcon?: boolean;
  active?: boolean;
  children?: JSX.Element;
  small?: boolean;
};

export const Button = (props: ButtonProps) => {
  const [loading, setLoading] = createSignal(false);
  const [success, setSuccess] = createSignal(false);

  const clickPromise = () => {
    if (props.onClick) {
      setLoading(true);
      props.onClick().then(() => {
        setLoading(false);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 2000);
      });
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
      disabled={loading() || (success() && props.successIcon)}
      class="rounded gap-x-2 flex items-center"
      classList={{
        "p-1.5": props.small,
        "py-2 px-4": !props.small,
        "pointer-events-none cursor-default": !props.onClick,
        "bg-blue-800 text-white border-0": props.active,
        "border-2 border-gray-200": !props.active,
      }}
      onClick={clickPromise}
    >
      <Show
        when={success() && props.successIcon}
        fallback={
          <Show when={loading()} fallback={<Icon />}>
            <FiLoader class="animate-spin" />
          </Show>
        }
      >
        <FiCheck
          class="scale-110 transition-all"
          classList={{
            "scale-100": success(),
          }}
        />
      </Show>
      {props.children}
    </button>
  );
};
