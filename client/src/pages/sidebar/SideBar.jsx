import React from "react";
import { NavLink, Link } from "react-router-dom";

export default function Sidebar({ isOpen }) {
  return (
    <aside
     className={`
  h-full w-full flex flex-col
  bg-gradient-to-b from-green-950 to-green-700
  
  backdrop-blur-xl
  shadow-glass
`}

    >
      {/* ======================
          BRAND
      ====================== */}
      <div className="
        px-6 py-6
        flex items-center gap-3
      ">
        <div className="
          h-11 w-11
          rounded-xl
          bg-accent-gradient
          text-white
          flex items-center justify-center
          font-bold text-lg
          shadow-medium
        ">
          CE
        </div>

        <div>
          <h1 className="text-lg font-semibold leading-tight">
            ClassEye
          </h1>
          <p className="text-xs dark:text-light-textMuted text-dark-textMuted">
            Finance Dashboard
          </p>
        </div>
      </div>

      {/* ======================
          NAVIGATION
      ====================== */}
      <nav className="flex-1 px-4 py-2 space-y-1">
        <SidebarItem label="Dashboard" to="/dashboard" />
        <SidebarItem label="Add Student" to="/addstudent" />
        <SidebarItem label="Classes" to="/addclass" />
        <SidebarItem label="Attendance" to="/attendance" />
        <SidebarItem label="Reports" to="/reports" />
        <SidebarItem label="Search Students" to="/searchstudents" />
      </nav>

      {/* ======================
          FOOTER ACTIONS
      ====================== */}
      <div className="
        px-4 py-4
        space-y-2
      ">
        <SidebarItem label="Settings" to="/settings" />

        <Link
          to="/login"
          className="
            block px-4 py-3 rounded-xl
            text-sm font-medium
            dark:text-light-textSecondary text-dark-textSecondary
            dark:hover:bg-light-accentSoft hover:bg-dark-accentSoft
            dark:hover:text-light-textPrimary hover:text-dark-textPrimary
            transition
          "
        >
          Login
        </Link>
      </div>
    </aside>
  );
}

/* ======================
   SIDEBAR ITEM
====================== */
function SidebarItem({ label, to }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => `
        group flex items-center
        px-4 py-3 rounded-xl
        text-sm font-medium
        transition-all duration-200
        ${
          isActive
            ? `
              dark:bg-light-accentSoft bg-dark-accentSoft
              dark:text-light-primary text-dark-accent
              shadow-soft
            `
            : `
              dark:text-light-textSecondary text-dark-textSecondary
              dark:hover:bg-light-glass hover:bg-dark-glass
              dark:hover:text-light-textPrimary hover:text-dark-textPrimary
            `
        }
      `}
    >
      <span className="relative z-10">{label}</span>
    </NavLink>
  );
}
