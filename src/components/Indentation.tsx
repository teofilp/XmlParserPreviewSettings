import { PropsWithChildren } from "react";

export const Indentation = ({
  depth,
  isInline,
  children,
  style,
  className,
}: PropsWithChildren<any>) => {
  var paddingInlineStart = isInline ? 0 : depth * 4 + "px";
  var Component = isInline
    ? ({ children, ...props }: any) => <span {...props}>{children}</span>
    : ({ children, ...props }: any) => <div {...props}>{children}</div>;

  return (
    <Component
      style={{
        paddingInlineStart,
        ...style,
      }}
      className={className}
    >
      {children}
    </Component>
  );
};
