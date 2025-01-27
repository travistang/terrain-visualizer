import classNames from "classnames";
import { IconType } from "react-icons";

type Props = {
  icon: IconType;
  activated?: boolean;
  onClick?: () => void;
  className?: string;
};
export const ToolbarItem = ({
  className,
  icon: Icon,
  activated,
  onClick,
}: Props) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={classNames(
        "rounded-lg aspect-square outline-none border-none p-1 flex items-center justify-center",
        "hover:bg-indigo-300 active:bg-indigo-600",
        activated ? "bg-indigo-500 text-white" : "bg-gray-500 text-white",
        className
      )}
    >
      <Icon />
    </button>
  );
};
