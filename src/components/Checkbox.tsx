import { createSignal } from "solid-js";
import { FiCheck } from "solid-icons/fi";

type CheckboxProps = {
  text: string;
  onCheck: () => void;
  default?: boolean;
};

export const Checkbox = (props: CheckboxProps) => {
  const [checked, setChecked] = createSignal(props.default || false);

  return (
    <div
      onClick={() => {
        setChecked(!checked());
        props.onCheck();
      }}
      class="cursor-pointer bg-white border-2 flex items-center px-4 py-2 gap-x-2 rounded border-gray-200"
    >
      <p>{props.text}</p>
      <div class="relative size-5 ml-auto">
        <input
          checked={checked()}
          type="checkbox"
          class="rounded size-5 border-2 appearance-none transition-all"
          classList={{
            "border-gray-400": !checked(),
            "bg-blue-800 border-blue-800": checked(),
          }}
        />
        <FiCheck class="top-0 absolute size-full p-1 text-white" />
      </div>
    </div>
  );
};
