import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import parserSettings from "./parserSettings/parserSettingsSlice";

const store = configureStore({
    reducer: {
        parserSettings
    }
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();