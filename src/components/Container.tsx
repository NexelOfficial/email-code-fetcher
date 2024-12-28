import { JSX } from "solid-js";

type ContainerProps = JSX.HTMLAttributes<HTMLDivElement> & {
  active?: boolean;
};

export const Container = (props: ContainerProps) => (
  <div
    {...props}
    class={`flex items-center gap-x-2 rounded py-2 px-4 ${props.class}`}
    classList={{
      "border-2 border-gray-200 bg-white": !props.active,
      "bg-blue-800 text-white": props.active,
      ...props.classList,
    }}
  />
);
