import { JSX } from "solid-js";

type ContainerProps = JSX.HTMLAttributes<HTMLDivElement> & {
  active?: boolean;
};

export const Container = (props: ContainerProps) => (
  <div
    {...props}
    class={`flex items-center border-2 gap-2 rounded py-2 px-4 ${props.class}`}
    classList={{
      "border-gray-200 bg-white": !props.active,
      "border-blue-800 bg-blue-800 text-white": props.active,
      ...props.classList,
    }}
  />
);
