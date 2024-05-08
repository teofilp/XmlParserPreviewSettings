import { PropsWithChildren, useState } from "react";
import { styled } from "styled-components";

const PopoverComp = styled.div<{ isActive: boolean }>`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: 100%;
  display: ${(props) => (props.isActive ? "block" : "none")};
`;

const PopoverContainer = styled.span`
  position: relative;
`;

export const Popover = ({ content, children }: PropsWithChildren<any>) => {
  const [isActive, setIsActive] = useState(false);

  return (
    <PopoverContainer onClick={() => setIsActive((old) => !old)}>
      <PopoverComp isActive={isActive}>{content}</PopoverComp>
      <span>{children}</span>
    </PopoverContainer>
  );
};
