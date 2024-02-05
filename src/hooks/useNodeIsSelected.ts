import { useMemo } from "react";
import { useActiveNodesContext } from "../context/ActiveNodesContext";

export const useNodeIsSelected = (nodeId: string) => {
  const {
    state: { nodeIds },
  } = useActiveNodesContext();

  const isSelected = useMemo(() => {
    return nodeIds.includes(nodeId);
  }, [nodeIds, nodeId]);

  return isSelected;
};
