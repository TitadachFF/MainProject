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
import RegistePlan from "../Student/RegistePlan";

import AddCourse from "../Course/AddCourse";
import AddCourseCategory from "../Course/AddCourseCategory";
import AddCourseGroup from "../Course/AddCourseGroup";
import AddTeacher from "../Course/AddTeacher";

import CourseInfo from "../Course/CourseInfo";
import Fillgrade from "../Student/Fillgrade";
import Documents from "../Student/Documents";
import Documentres from "../Student/Documentres";
import Adduser from "../Admin/Adduser";
import Alluser from "../Admin/Alluser";
import AllCourse from "../Course/AllCourse";

import CourseCategory from "../Course/CourseCategory";

import ViewMajor from "../Course/ViewMajor";
import EditCategory from "../Course/EditCategory";

import DocumentStudent from "../Advice/DocumentStudent";
import StudentPlan from "../Advice/StudentPlan";
import AddStudentplan from "../Advice/AddStudentplan";
import AdminInfo from "../Admin/AdminInfo";
import EditMajor from "../Course/EditMajor";
import NavigateMenu from "../components/NavigateMenu";
import EditStudentPlan from "../Advice/EditStudentPlan";

import AddAdvisor from "../Course/AddAdvisor";
import AddClasses from "../Course/AddClasses";
import AllTeacher from "../Course/AllTeacher";
import AddListplan from "../Advice/AddListplan";

import EditGroup from "../Course/EditGroup";
import EditCourse from "../Course/EditCourse";
import RegistePlan from "../Student/RegistePlan";
import GraduateCheck from "../Student/GraduateCheck";

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
        path: "/editgroup",
        element: <EditGroup />,
      },
      {
        path: "/fillgrade",
        element: <Fillgrade />,
      },
      { path: "/editcourse", element: <EditCourse /> },

      {
        path: "/registerplan",
        element: <RegistePlan />,
      },
      {
        path: "/viewmajor",
        element: <ViewMajor />,
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
        path: "/admininfo",
        element: <AdminInfo />,
      },
      {
        path: "/alluser",
        element: <Alluser />,
      },
      {
        path: "/editcategory",
        element: <EditCategory />,
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
        path: "/editmajor",
        element: <EditMajor />,
      },
      {
        path: "/coursecategory",
        element: <CourseCategory />,
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
        element: <AddStudentplan />,
      },
      {
        path: "/navigate",
        element: <NavigateMenu />,
      },
      {
        path: "/editstudentplan",
        element: <EditStudentPlan />,
      },
      {
        path: "/addadvisor",
        element: <AddAdvisor />,
      },
      {
        path: "/addclass",
        element: <AddClasses />,
      },
      {
        path: "/addteachername",
        element: <AddTeacherName />,
      },
      {
        path: "/allteacher",
        element: <AllTeacher />,
      },
      {
        path: "/addlistplan",
        element: <AddListplan />,
      },
      {
        path: "/registerplan",
        element: <RegistePlan />

        path: "/graduate_check",
        element: <GraduateCheck/>,
      },
    ],
  },
]);

export default Router;
