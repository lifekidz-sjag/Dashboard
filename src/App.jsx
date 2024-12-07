import { useEffect, useRef, useState } from "react";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import { Box, Typography } from "@mui/material";

import AccountsIcon from "./components/GoogleIcons/Account";
import { AuthProvider } from "./contexts/auth";
import useSJAG from "./hooks/useSJAG";
import ReportsLayout from "./layouts/ReportsLayout";
import RootLayout from "./layouts/RootLayout";
import UserLayout from "./layouts/UserLayout";
import Admins from "./pages/Admins";
import Classes from "./pages/Classes";
import ClassAttendances from "./pages/ClassesAttendances";
import ClassEvaluation from "./pages/ClassEvaluation";
import Dashboard from "./pages/Dashboard";
import Error404 from "./pages/Error404";
import Notifications from "./pages/Notifications";
import ReportsClasses from "./pages/ReportsClasses";
import ReportsLayoutLanding from "./pages/ReportsLayoutLanding";
import ReportsStudents from "./pages/ReportsStudents";
import Students from "./pages/Students";
import Teachers from "./pages/Teachers";
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
              element: <Dashboard />,
            },
            {
              path: "admins",
              element: <Admins />,
            },
            {
              path: "notifications",
              element: <Notifications />,
            },
            {
              path: "classes",
              element: <Classes />,
            },
            {
              path: "classes/:id/attendances",
              element: <ClassAttendances />,
            },
            {
              path: "classes/:id/evaluation",
              element: <ClassEvaluation />,
            },
            {
              path: "teachers",
              element: <Teachers />,
            },
            {
              path: "students",
              element: <Students />,
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
                  element: <ReportsStudents />,
                },
                {
                  index: true,
                  path: "classes",
                  element: <ReportsClasses />,
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

const App = () => {
  const [loaded, setLoaded] = useState(false);
  const timeInterval = useRef(null);
  const timeoutRef = useRef(null);
  const loadFonts = () => {
    document.fonts.ready.then(fontFaceSet => {
      // Any operation that needs to be done only after all used fonts
      // have finished loading can go here.
      const fontFaces = [...fontFaceSet];
      // some fonts may still be unloaded if they aren't used on the site
      const allLoaded = fontFaces
        .filter(f => {
          return (
            f.family === "Material Symbols Outlined" ||
            (f.family === "Inter" && f.weight === "100 900")
          );
        })
        .every(s => {
          return s.status === "loaded";
        });

      if (allLoaded) {
        setLoaded(true);
      }
    });
  };

  useEffect(() => {
    timeInterval.current = setInterval(() => {
      loadFonts();
    }, 300);

    timeoutRef.current = setTimeout(() => {
      setLoaded(true);
      clearInterval(timeInterval.current);
    }, 3000);

    // Cleanup the interval when the component unmounts
    return () => {
      clearInterval(timeInterval.current);
      // clearTimeout(timeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (loaded) {
      clearInterval(timeInterval.current);
    }
  }, [loaded]);
  return loaded ? (
    <RouterProvider router={router} />
  ) : (
    <Box sx={{ opacity: 0 }}>
      <Typography>Test</Typography>
      <AccountsIcon />
    </Box>
  );
};

export default App;
