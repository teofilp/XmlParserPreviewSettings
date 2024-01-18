import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import parserSettings from "./parserSettings/parserSettingsSlice";
import activeNodes from "./activeNodesSlice";

const store = configureStore({
    reducer: {
        parserSettings,
        activeNodes
    }
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();