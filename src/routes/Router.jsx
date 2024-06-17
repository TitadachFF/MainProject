import * as React from "react";
import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import Main from "../layout/Main";
import StudentMenu from "../Student/StudentMenu";
import AdminMenu from "../Admin/AdminMenu";

const Router = createBrowserRouter ([
  {
    path: "/",
    element: <Main />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/student",
        element: <StudentMenu />,
      },
      {
        path: "/admin",
        element: <AdminMenu />,
      },
    ],
  },
]);

export default Router;
