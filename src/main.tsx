import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import App from "./app/app";
import "./index.css";
import store from "./redux/store";
import { NotifyProvider } from "./components/ui/Notify";

createRoot(document.getElementById("root")!).render(
  <NotifyProvider>
    <Provider store={store}>
      <App />
    </Provider>
  </NotifyProvider>
);
