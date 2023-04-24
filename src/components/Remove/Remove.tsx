import Action, { ActionProps } from "../Action/Action";
import { XMarkIcon } from "@heroicons/react/24/outline";

export default function Remove(props: ActionProps) {
  return (
    <Action
      {...props}
      active={{
        fill: 'rgba(255, 70, 70, 0.95)',
        background: 'rgba(255, 70, 70, 0.1)',
      }}
    >
      <XMarkIcon />
    </Action>
  );
}
