import { createSignal, JSX, Show } from "solid-js";
import { IconTypes } from "solid-icons";
import { FiCheck, FiLoader } from "solid-icons/fi";
import { Container } from "./Container";

type ButtonProps = {
  onClick?: () => Promise<any> | any;
  icon?: IconTypes;
  successIcon?: boolean;
  active?: boolean;
  children?: JSX.Element;
};

export const Button = (props: ButtonProps) => {
  const [loading, setLoading] = createSignal(false);
  const [success, setSuccess] = createSignal(false);

  const clickPromise = async () => {
    if (props.onClick) {
      setLoading(true);
      await props.onClick();

      setLoading(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
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
    <button disabled={loading() || (success() && props.successIcon)}>
      <Container
        classList={{
          "pointer-events-none cursor-default": !props.onClick,
        }}
        active={props.active}
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
      </Container>
    </button>
  );
};
