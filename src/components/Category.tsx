import { IconTypes } from "solid-icons";
import { JSX } from "solid-js";

type CategoryProps = {
  icon: IconTypes;
  text: string;
  children: JSX.Element;
};

export const Category = (props: CategoryProps) => (
  <div class="w-full p-2 mb-2">
    <p class="flex gap-x-2 items-center border-b-2 pb-1 mb-3 px-2">
      <props.icon />
      <span>{props.text}</span>
    </p>
    {props.children}
  </div>
);
