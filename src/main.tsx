import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import App from "./app/app";
import "./index.css";
import store from "./redux/store";

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <App />
  </Provider>
);
