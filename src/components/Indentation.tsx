import { PropsWithChildren } from "react";

export const Indentation = ({
  depth,
  isInline,
  children,
  style,
  className,
}: PropsWithChildren<any>) => {
  var paddingInlineStart = isInline ? 0 : depth * 4 + "px";

  return (
    <div
      style={{
        paddingInlineStart,
        ...style,
      }}
      className={className}
    >
      {children}
    </div>
  );
};
