import { Popover, PopoverProps } from "antd";

interface ActionPopoverProps extends PopoverProps {}

export const ActionPopover = ({ children, ...props }: ActionPopoverProps) => {
  return (
    <Popover {...props}>
      <span style={{ cursor: "pointer" }}>{children}</span>
    </Popover>
  );
};
