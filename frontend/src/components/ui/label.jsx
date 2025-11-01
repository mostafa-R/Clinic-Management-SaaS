import { cn } from "@/lib/utils";
import * as React from "react";

const Label = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <label
      ref={ref}
      className={cn("mb-2 block text-sm font-medium text-gray-700", className)}
      {...props}
    />
  );
});
Label.displayName = "Label";

export { Label };
