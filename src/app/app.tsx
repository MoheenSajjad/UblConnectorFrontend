import { useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import Login from "@/pages/Login";
import { Dashboard, InboundTransactions } from "@/pages";
import ProtectedRoute from "@/components/layout/ProtectedRoute";
import { getCurrentUser } from "@/redux/reducers/authSlice";
import { useTDispatch } from "@/hooks/use-redux";
import { Layout } from "@/components/layout";
import InboundTransactionDetail from "@/pages/InboundTransactionDetail/InboundTransactionDetail";
import { Page } from "@/components/ui/page";

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
            element={
              <Layout>
                <Outlet />
              </Layout>
            }
          >
            <Route path="/" element={renderPage("dashboard")} />
            <Route
              path="/inbound-transactions"
              element={renderPage("inbound-transactions")}
            />
            <Route
              path="/inbound-transactions/:id"
              element={<InboundTransactionDetail />}
            />
          </Route>
        </Route>

        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

const renderPage = (pageKey: string): JSX.Element | null => {
  const { pageTitle, routeElement } = pagesData[pageKey];

  return <Page title={pageTitle}>{routeElement}</Page>;
};

type DashboardPageData = {
  pageTitle: string;
  routeElement: JSX.Element;
};

const pagesData: { [key: string]: DashboardPageData } = {
  dashboard: {
    pageTitle: "Ubl Connector",
    routeElement: <Dashboard />,
  },
  "inbound-transactions": {
    pageTitle: "Inbound Transaction",
    routeElement: <InboundTransactions />,
  },
  "inbound-transactions-detail": {
    pageTitle: "Inbound Transaction",
    routeElement: <InboundTransactionDetail />,
  },
};
