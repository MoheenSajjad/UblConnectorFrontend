import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "@/pages/Login";
import { Dashboard, InboundTransactions } from "./pages";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import { getCurrentUser } from "./redux/reducers/authSlice";
import { useTDispatch } from "./hooks/use-redux";
import { Layout } from "@/components/layout";
import InboundTransactionDetail from "./pages/InboundTransactionDetail/InboundTransactionDetail";

function App() {
  const dispatch = useTDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      dispatch(getCurrentUser());
    }
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoute />}>
          <Route
            path="/"
            element={
              <Layout>
                <Dashboard />
              </Layout>
            }
          />
          <Route
            path="/inbound-transactions"
            element={
              <Layout>
                <InboundTransactions />
              </Layout>
            }
          />
          <Route
            path="/inbound-transactions/:id"
            element={
              <Layout>
                <InboundTransactionDetail />
              </Layout>
            }
          />

          {/* Add more protected routes here */}
        </Route>

        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
