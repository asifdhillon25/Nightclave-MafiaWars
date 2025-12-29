import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../pages/sidebar/Sidebar";
import Header from "../pages/header/Header";
import Footer from "../pages/footer/Footer";
import { FaBars, FaTimes } from "react-icons/fa";

function MainLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-light-background dark:bg-dark-background text-light-textPrimary dark:text-dark-textPrimary">

      {/* =======================
          DESKTOP SIDEBAR (FIXED)
      ======================= */}
      <aside className="
        hidden md:flex
        fixed top-0 left-0 h-screen w-[17rem]
        bg-sidebar-gradient
        backdrop-blur-lg
        border-r border-light-border/40 dark:border-dark-border/40
        z-20
      ">
        <div className="
          w-full h-full
          bg-light-glass dark:bg-dark-glass
          backdrop-blur-lg
          shadow-glass
        ">
          <Sidebar isOpen />
        </div>
      </aside>

      {/* =======================
          MAIN AREA
      ======================= */}
      <div className="flex flex-col flex-1 min-h-screen md:ml-[17rem] relative">

        {/* HEADER */}
        <header className="
          sticky top-0 z-30
          h-24 px-6
          flex items-center
          bg-light-glass dark:bg-dark-glass
          backdrop-blur-md
          shadow-soft
        ">
          {/* Hamburger button for mobile */}
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="
              md:hidden
              mr-4
              p-2 rounded-lg
              hover:bg-light-accentSoft dark:hover:bg-dark-accentSoft
              transition
            "
          >
            <FaBars />
          </button>

          <Header />
        </header>

        {/* CONTENT */}
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto bg-light-background dark:bg-dark-background">
          <div className="max-w-[1600px] mx-auto">
            <Outlet />
          </div>
        </main>

        {/* FOOTER */}
        <footer className="
          h-12
          flex items-center justify-center
          text-sm text-light-textMuted dark:text-dark-textMuted
          bg-transparent
        ">
          <Footer />
        </footer>
      </div>

      {/* =======================
          MOBILE SIDEBAR OVERLAY
      ======================= */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-40 flex">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsSidebarOpen(false)}
          />

          {/* Sidebar */}
          <div className="
            relative w-72
            bg-light-glass dark:bg-dark-glass
            backdrop-blur-xl
            shadow-strong
            animate-slideIn
          ">
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="
                absolute top-4 right-4
                p-2 rounded-lg
                hover:bg-light-accentSoft dark:hover:bg-dark-accentSoft
                transition
              "
            >
              <FaTimes />
            </button>

            <Sidebar isOpen />
          </div>
        </div>
      )}
    </div>
  );
}

export default MainLayout;
