import { createSignal } from "solid-js";
import { FiCheck } from "solid-icons/fi";
import { Container } from "./Container";

type CheckboxProps = {
  text: string;
  onCheck: () => void;
  default?: boolean;
};

export const Checkbox = (props: CheckboxProps) => {
  const [checked, setChecked] = createSignal(props.default || false);

  return (
    <Container
      onClick={() => {
        setChecked(!checked());
        props.onCheck();
      }}
      class="cursor-pointer"
    >
      <p>{props.text}</p>
      <div class="relative size-5 ml-auto">
        <input
          checked={checked()}
          type="checkbox"
          class="rounded size-5 border-2 appearance-none transition-all"
          classList={{
            "border-gray-400": !checked(),
            "bg-blue-700 border-blue-700": checked(),
          }}
        />
        <FiCheck
          class="top-0 absolute size-full p-1"
          classList={{
            "text-transparent": !checked(),
            "text-white": checked(),
          }}
        />
      </div>
    </Container>
  );
};
