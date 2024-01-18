import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from ".";

interface ActiveNodesSliceState {
    nodeIds: string[];
    xpathSelector: string;
};

const getDefaultState = (): ActiveNodesSliceState => ({
    nodeIds: [],
    xpathSelector: ""
})

const slice = createSlice({
    name: "activeNodes",
    initialState: getDefaultState(),
    reducers: {
        setXPathSelector: (state: ActiveNodesSliceState, { payload: xpathSelector }: PayloadAction<string>) => {
            state.xpathSelector = xpathSelector;
            if (state.xpathSelector == "") 
                state.nodeIds = [];
        },
        setNodeIds: (state: ActiveNodesSliceState, { payload: ids }: PayloadAction<string[]>) => {
            state.nodeIds = ids;
        }
    }
});

export default slice.reducer;

export const { setXPathSelector, setNodeIds } = slice.actions;

export const getXPathSelector = (state: RootState) => state.activeNodes.xpathSelector;

export const getSelectedNodesIds = (state: RootState) => state.activeNodes.nodeIds;
