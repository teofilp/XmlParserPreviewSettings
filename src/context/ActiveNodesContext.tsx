import { PropsWithChildren, createContext, useContext, useState } from "react";

interface ActiveNodesState {
  nodeIds: string[];
  xpathSelector: string;
}

const getDefaultActiveNodesState = (): ActiveNodesState => ({
  nodeIds: [],
  xpathSelector: "",
});

const ActiveNodesContext = createContext({
  state: getDefaultActiveNodesState(),
  setXPathSelector: (_: string) => {},
  setNodeIds: (_: string[]) => {},
});

export const ActiveNodesContextProvider = ({
  children,
}: PropsWithChildren<any>) => {
  const [nodeIds, setNodeIds] = useState<string[]>([]);
  const [xpathSelector, setXPathSelector] = useState<string>("");

  const value = {
    state: {
      nodeIds,
      xpathSelector,
    },
    setXPathSelector,
    setNodeIds,
  };

  return (
    <ActiveNodesContext.Provider value={value}>
      {children}
    </ActiveNodesContext.Provider>
  );
};

export const useActiveNodesContext = () => useContext(ActiveNodesContext);
