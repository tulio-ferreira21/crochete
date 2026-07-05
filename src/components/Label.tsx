import type React from "react";
import type { LabelProps } from "../assets/types";

export function Label({ children, ...props }: LabelProps): React.JSX.Element {
  return (
    <label {...props} className="p-1 font-body font-semibold text-sm">
      {children}
    </label>
  );
}
