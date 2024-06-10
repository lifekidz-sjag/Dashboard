import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";

import { AuthProvider } from "./contexts/auth";
import useSJAG from "./hooks/useSJAG";
import AdminLayout from "./layouts/AdminLayout";
import ReportsLayout from "./layouts/ReportsLayout";
import RootLayout from "./layouts/RootLayout";
import UserLayout from "./layouts/UserLayout";
import AdminLayoutLanding from "./pages/AdminLayoutLanding";
import Dashboard from "./pages/Dashboard";
import Error404 from "./pages/Error404";
import ReportsLayoutLanding from "./pages/ReportsLayoutLanding";
import RootLayoutLanding from "./pages/RootLayoutLanding";
import UserLogin from "./pages/user/UserLogin";
import UserLogout from "./pages/user/UserLogout";
import UserLayoutLanding from "./pages/UserLayoutLanding";

import "./App.css";

const AuthLayout = () => {
  const { sharedComponents, sharedState } = useSJAG();

  return (
    <AuthProvider sharedState={sharedState}>
      <Outlet
        context={{
          ...sharedState,
        }}
      />
      {sharedComponents}
    </AuthProvider>
  );
};
const router = createBrowserRouter(
  [
    {
      element: <AuthLayout />,
      errorElement: <Error404 />,
      children: [
        {
          path: "user",
          element: <UserLayout />,
          errorElement: <Error404 />,
          children: [
            {
              index: true,
              element: <UserLayoutLanding />,
            },
            {
              path: "login",
              element: <UserLogin />,
            },
            {
              path: "logout",
              element: <UserLogout />,
            },
          ],
        },
        {
          path: "/",
          element: <RootLayout />,
          errorElement: <Error404 />,
          children: [
            {
              index: true,
              element: <RootLayoutLanding />,
            },
            {
              path: "dashboard",
              element: <Dashboard />,
            },
            {
              path: "manage",
              element: <Dashboard />,
            },
            {
              path: "admin",
              element: <AdminLayout />,
              children: [
                {
                  index: true,
                  element: <AdminLayoutLanding />,
                },
                {
                  index: true,
                  path: "teachers",
                  element: <Dashboard />,
                },
                {
                  index: true,
                  path: "classes",
                  element: <Dashboard />,
                },
                {
                  index: true,
                  path: "students",
                  element: <Dashboard />,
                },
              ],
            },
            {
              path: "reports",
              element: <ReportsLayout />,
              children: [
                {
                  index: true,
                  element: <ReportsLayoutLanding />,
                },
                {
                  index: true,
                  path: "students",
                  element: <Dashboard />,
                },
                {
                  index: true,
                  path: "classes",
                  element: <Dashboard />,
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  { basename: "/Dashboard" },
);

const App = () => <RouterProvider router={router} />;

export default App;
