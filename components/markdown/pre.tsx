import { ComponentProps } from "react";
import Copy from "./copy";

export default function Pre({
  children,
  raw,
  filename,
  ...rest
}: ComponentProps<"pre"> & { raw?: string; filename?: string }) {
  return (
    <div className=" relative bg-muted/20 rounded w-[550px]  border  ">
      <div className="text-sm px-3 py-1 border-b bg-muted/20 rounded-t flex items-center justify-between">
        {filename}
        <div className="ml-auto">
          <Copy content={raw!} fileName={filename} />
        </div>
      </div>
      <div className="overflow-x-auto p-2">
        <pre {...rest}>{children}</pre>
      </div>
    </div>
  );
}
