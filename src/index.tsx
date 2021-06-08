import { configureStore } from "@reduxjs/toolkit";
import { AuthProvider } from "auth/contexts/AuthContext";
import { FetchProvider } from "auth/contexts/FetchContext";
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./assets/tailwind.generated.css";
import "./index.css";
import * as serviceWorker from "./serviceWorker";
import { appReducer, featureKey as appFeature } from "./state/reducer";

const store = configureStore({
  reducer: {
    [appFeature]: appReducer,
  },
});
ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <AuthProvider>
          <FetchProvider>
            <App />
          </FetchProvider>
        </AuthProvider>
      </Provider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
