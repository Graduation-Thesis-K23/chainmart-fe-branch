import React from "react";
import { createBrowserRouter } from "react-router-dom";

import {
  Batch,
  Login,
  Employees,
  NotFound,
  ChangePassword,
} from "~/components/pages";
import MainLayout from "~/components/layouts/MainLayout";
import ErrorBoundary from "~/components/pages/ErrorBoundary";

const baseRouter = [
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
];
const routerList = [
  {
    path: "/",
    element: <Batch />,
  },
  {
    path: "/employees",
    element: <Employees />,
  },
  {
    path: "/change-password",
    element: <ChangePassword />,
  },
];

const devRouter = routerList.map((router) => {
  return {
    ...router,
    element: <MainLayout>{router.element}</MainLayout>,
  };
});

const prodRouter = routerList.map((router) => {
  return {
    ...router,
    element: (
      <ErrorBoundary>
        <MainLayout>{router.element}</MainLayout>
      </ErrorBoundary>
    ),
  };
});

const routers =
  process.env.NODE_ENV === "development"
    ? [...baseRouter, ...devRouter]
    : [...baseRouter, ...prodRouter];

export default createBrowserRouter(routers);
