import React from "react";
import { createBrowserRouter } from "react-router-dom";

import {
  Dashboard,
  Batch,
  Login,
  Employees,
  Orders,
  NotFound,
  ChangePassword,
} from "~/components/pages";
import MainLayout from "~/components/layouts/MainLayout";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <MainLayout>
        <Dashboard />
      </MainLayout>
    ),
  },
  {
    path: "/batch",
    element: (
      <MainLayout>
        <Batch />
      </MainLayout>
    ),
  },
  {
    path: "/employees",
    element: (
      <MainLayout>
        <Employees />
      </MainLayout>
    ),
  },
  {
    path: "/orders",
    element: (
      <MainLayout>
        <Orders />
      </MainLayout>
    ),
  },
  {
    path: "/change-password",
    element: <ChangePassword />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
