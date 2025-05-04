import { ComponentProps } from "react";
import Copy from "./copy";

export default function Pre({
  children,
  raw,
  ...rest
}: ComponentProps<"pre"> & { raw?: string }) {
  return (
    <div className=" relative bg-muted/20 rounded w-[550px]  border  ">
      <div className="absolute top-2 right-2.5 z-10 bg-black rounded sm:block hidden">
        <Copy content={raw!} />
      </div>
      <div className="overflow-x-auto p-2">
        <pre {...rest}>{children}</pre>
      </div>
    </div>
  );
}
