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
import Documents from "../Student/Documents";
import Documentres from "../Student/Documentres";
import Adduser from "../Admin/Adduser";
import Alluser from "../Admin/Alluser";
import AllCourse from "../Course/AllCourse";
import Course from "../Course/Course";
import AddvicetoCourse from "../Course/AddvicetoCourse";
import CourseCategory from "../Course/CourseCategory";
import CourseGroup from "../Course/CourseGroup";
import AddCoursestocourse from "../Course/AddCoursestocourse";
import DocumentStudent from "../Advice/DocumentStudent";
import StudentPlan from "../Advice/StudentPlan";
import AddStudentplan from "../Advice/AddStudentplan";

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
        path: "/documents",
        element: <Documents />,
      },
      {
        path: "/documentresponse",
        element: <Documentres />,
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
        path: "/alluser",
        element: <Alluser />,
      },
      {
        path: "/adduser",
        element: <Adduser />,
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
        path: "/adviceinfo",
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
      {
        path: "/allcourse",
        element: <AllCourse />,
      },
      {
        path: "/editcourse",
        element: <Course />,
      },
      {
        path: "/advicecourse",
        element: <AddvicetoCourse />,
      },
      {
        path: "/coursecategory",
        element: <CourseCategory />,
      },
      {
        path: "/coursegroup",
        element: <CourseGroup />,
      },
      {
        path: "/coursesincourses",
        element: <AddCoursestocourse />,
      },
      {
        path: "/documentstudent",
        element: <DocumentStudent />,
      },
      {
        path: "/studentplan",
        element: <StudentPlan />,
      },
      {
        path: "/addstudentplan",
        element: <AddStudentplan/>,
      },
    ],
  },
]);

export default Router;
