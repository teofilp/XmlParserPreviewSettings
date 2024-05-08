import { PropsWithChildren } from "react";
import styled from "styled-components";

const FlexDiv = styled.div<{
  vertical?: boolean;
  justifyContent?: string;
  gap?: number;
}>`
  display: flex;
  flex-direction: ${(props) => (props.vertical ? "column" : "row")};
  justify-content: ${(props) => props.justifyContent ?? "default"};
  gap: ${(props) => props.gap ?? 0}px;
  position: relative;
`;

export const Flex = ({ children, ...rest }: PropsWithChildren<any>) => (
  <FlexDiv {...rest}>{children}</FlexDiv>
);
