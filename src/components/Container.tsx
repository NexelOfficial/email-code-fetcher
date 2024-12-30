import { JSX } from "solid-js";

type ContainerProps = JSX.HTMLAttributes<HTMLDivElement> & {
  active?: boolean;
};

export const Container = (props: ContainerProps) => (
  <div
    {...props}
    class={`flex items-center border-2 py-2 px-4 gap-2 rounded ${props.class}`}
    classList={{
      "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white":
        !props.active,
      "border-blue-700 bg-blue-700 text-white": props.active,
      ...props.classList,
    }}
  />
);
