import {
  PropsWithChildren,
  ReactNode,
  useEffect,
  useState,
} from "react";
import { styled } from "styled-components";

const PopoverComp = styled.div<{ isActive: boolean }>`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: calc(100% + 8px);
  display: ${(props) => (props.isActive ? "block" : "none")};
`;

const PopoverContainer = styled.span`
  position: relative;

  &:hover {
    & > .popover-title {
        display: block;
    }
  }
`;

const PopoverTitle = styled.span`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: calc(100% + 8px);
  background-color: white;
  font-size: 12px;
  text-align: center;
  width: max-content;
  display: none;
  padding: 2px;
  border-radius: 4px;
  border: 1px solid #eeeeee9a;
`;

const defaultContainerStyle = {
  background: "#b0ddff",
  borderRadius: 4,
  padding: "4px 6px",
  boxShadow: "2px 2px 2px 2px #cccccc58",
};

interface PopoverProps {
  content?: ReactNode;
  containerStyle?: any;
  title?: string;
}

export const Popover = ({
  content,
  containerStyle = defaultContainerStyle,
  children,
  title,
}: PropsWithChildren<PopoverProps>) => {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    var hidePopover = () => setIsActive(false);

    document.addEventListener("click", hidePopover);

    return () => {
      document.removeEventListener("click", hidePopover);
    };
  }, []);

  return (
    <PopoverContainer
      onClick={(e) => {
        setIsActive(true);
        e.stopPropagation();
      }}
    >
      <PopoverComp style={containerStyle} isActive={isActive}>
        {content}
      </PopoverComp>
      {title && <PopoverTitle className="popover-title">{title}</PopoverTitle>}
      <span>{children}</span>
    </PopoverContainer>
  );
};
