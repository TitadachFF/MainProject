import * as React from "react";
import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import Main from "../layout/Main";
import StudentMenu from "../Student/StudentMenu";
import AdminMenu from "../Admin/AdminMenu";
import StudentInfo from "../Student/StudentInfo";
import AdviceMenu from "../Advice/AdviceMenu";
import CourseMenu from "../Course/CourseMenu";
import AddStudent from "../Advice/AddStudent";
import AdviceInfo from "../Advice/AdviceInfo";
import AllStudent from "../Advice/AllStudent";
import AddCourse from "../Course/AddCourse";
import CourseInfo from "../Course/CourseInfo";
import Fillgrade from "../Student/Fillgrade";

const Router = createBrowserRouter([
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
        path: "/fillgrade",
        element: <Fillgrade />,
      },
      {
        path: "/studentinfo",
        element: <StudentInfo />,
      },
      {
        path: "/admin",
        element: <AdminMenu />,
      },
      {
        path: "/advice",
        element: <AdviceMenu />,
      },
      {
        path: "/course",
        element: <CourseMenu />,
      },
      {
        path: "/addstudent",
        element: <AddStudent />,
      },
      {
        path: "/addviceinfo",
        element: <AdviceInfo />,
      },
      {
        path: "/allstudent",
        element: <AllStudent />,
      },
      {
        path: "/addcourse",
        element: <AddCourse />,
      },
      {
        path: "/courseinfo",
        element: <CourseInfo />,
      },
    ],
  },
]);

export default Router;
