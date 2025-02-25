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
import { Layout } from "@/components/layout";
import InboundTransactionDetail from "@/pages/InboundTransactionDetail/InboundTransactionDetail";
import { Page } from "@/components/ui/page";
import { Companies } from "@/pages/Companies";
import { Users } from "@/pages/Users";
import { useAuth } from "@/hooks/use-auth";
import EditPayload from "@/pages/Edit Payload/EditPayload";

function App() {
  const { isSuperUser } = useAuth();

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
            <Route path="/transactions" element={renderPage("transactions")} />
            <Route
              path="/transaction/:id"
              element={renderPage("transactions-detail")}
            />
            <Route path="/companies" element={renderPage("companies")} />

            <Route
              path="/transaction/:id/editPayload"
              element={renderPage("EditPayload")}
            />

            {isSuperUser && (
              <>
                <Route path="/users" element={renderPage("users")} />
              </>
            )}
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
    pageTitle: "Dashboard",
    routeElement: <Dashboard />,
  },
  transactions: {
    pageTitle: "Transactions",
    routeElement: <InboundTransactions />,
  },
  "transactions-detail": {
    pageTitle: "Inbound Transaction",
    routeElement: <InboundTransactionDetail />,
  },
  companies: {
    pageTitle: "Companies",
    routeElement: <Companies />,
  },
  users: {
    pageTitle: "Users",
    routeElement: <Users />,
  },
  EditPayload: {
    pageTitle: "Edit Invoice",
    routeElement: <EditPayload />,
  },
};
