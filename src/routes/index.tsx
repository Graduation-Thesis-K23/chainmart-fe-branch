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

const router = createBrowserRouter([
  {
    path: "/",
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
