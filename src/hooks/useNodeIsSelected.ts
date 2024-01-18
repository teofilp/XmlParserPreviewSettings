import { useSelector } from "react-redux"
import { getSelectedNodesIds } from "../store/activeNodesSlice"
import { useMemo } from "react";

export const useNodeIsSelected = (nodeId: string) => {
    const nodesIds = useSelector(getSelectedNodesIds);

    const isSelected = useMemo(() => {
        return nodesIds.includes(nodeId);
    }, [nodesIds, nodeId]);

    return isSelected;
}