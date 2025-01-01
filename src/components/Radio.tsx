import { FiCheck } from "solid-icons/fi";
import { Container } from "./Container";

type RadioProps = {
  text: string;
  onCheck: () => void;
  checked: boolean;
};

export const Radio = (props: RadioProps) => (
  <Container onClick={props.onCheck} class="cursor-pointer">
    <p>{props.text}</p>
    <div class="relative size-5 ml-auto">
      <input
        checked={props.checked}
        type="checkbox"
        class="rounded-full size-5 border-2 appearance-none transition-all"
        classList={{
          "border-gray-400": !props.checked,
          "bg-blue-700 border-blue-700": props.checked,
        }}
      />
      <FiCheck
        class="top-0 absolute size-full p-1"
        classList={{
          "text-transparent": !props.checked,
          "text-white": props.checked,
        }}
      />
    </div>
  </Container>
);
