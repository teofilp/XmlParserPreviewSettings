import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Provider as ReduxProvider } from "react-redux";
import store from "./store/index.ts";
import { AppContextProvider } from "./context/AppContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ReduxProvider store={store}>
      <AppContextProvider>
        <App />
      </AppContextProvider>
    </ReduxProvider>
  </React.StrictMode>
);
