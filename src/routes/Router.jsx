import * as React from "react";
import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import Main from "../layout/Main";

const Router = createBrowserRouter ([
  {
    path: "/",
    element: <Main />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
    ],
  },
]);

export default Router;
