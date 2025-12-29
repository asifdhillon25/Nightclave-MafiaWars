import "./App.css";
import React from "react";
import Login from "../src/pages/Login";
import Dashboard from "../src/pages/Dashboard";
import AddStudent from "../src/pages/AddStudent";
import StudentReports from "./pages/StudentReports";
import SearchStudents from "./pages/SearchStudents";
import AddClass from "../src/pages/AddClass.jsx";
import Attendance from "../src/pages/Attendance.jsx";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Home from "./pages/Home";

import MainLayout from "./layout/MainLayout";

export default function App() {
  const router = createBrowserRouter([
    // Standalone login route (no layout)
    {
      path: "/login",
      element: <Login />,
    },

    // Routes wrapped with MainLayout
    {
      path: "/",
      element: <MainLayout />,
      children: [
        {
          path: "/", // Home page
          element: <Home />,
        },
        { path: "dashboard", element: <Dashboard /> },
        { path: "addstudent", element: <AddStudent /> },
        {path: "searchstudents", element: <SearchStudents />},
        {path: "reports", element: <StudentReports />},
        { path: "addclass", element: <AddClass /> },
        { path: "attendance", element: <Attendance /> },

        // Add more pages here as children to use MainLayout
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}
