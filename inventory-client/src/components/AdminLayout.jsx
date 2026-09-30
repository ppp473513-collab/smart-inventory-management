import { useState } from "react";

import AdminSidebar from "./AdminSidebar";

import AdminDashboard from "../pages/AdminDashboard";
import AdminInventory from "../pages/AdminInventory";
import Users from "../pages/Users";
import AdminAlerts from "../pages/AdminAlerts";
import AdminAnalytics from "../pages/AdminAnalytics";
import AdminTransactions from "../pages/AdminTransactions";
import AdminAudit from "../pages/AdminAudit";
import AdminSettings from "../pages/AdminSettings";

import Profile from "../pages/Profile";
import ChangePassword from "../pages/ChangePassword";

function AdminLayout() {
  const [activeSection, setActiveSection] =
    useState("overview");

  const renderSection = () => {
    switch (activeSection) {
      case "overview":
        return <AdminDashboard />;

      case "users":
        return <Users />;

      case "inventory":
        return <AdminInventory />;

      case "alerts":
        return <AdminAlerts />;

      case "analytics":
        return <AdminAnalytics />;

      case "transactions":
        return <AdminTransactions />;

      case "audit":
        return <AdminAudit />;

      case "settings":
        return <AdminSettings />;

      case "profile":
        return <Profile />;

      case "change-password":
        return (
          <ChangePassword
            isAdmin={true}
            onSuccess={() =>
              setActiveSection("profile")
            }
            onCancel={() =>
              setActiveSection("profile")
            }
          />
        );

      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div className="min-h-screen w-full bg-white overflow-x-hidden">

      {/* =================================================
          SIDEBAR
      ================================================= */}

      <AdminSidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      {/* =================================================
          CONTENT AREA
      ================================================= */}

      <main
        className="
          min-h-screen
          ml-64
          xl:ml-72
          w-[calc(100%-16rem)]
          xl:w-[calc(100%-18rem)]
          min-w-0
          bg-white
          overflow-x-hidden
        "
      >

        <div
          className="
            w-full
            max-w-full
            min-w-0
            overflow-x-hidden
            bg-white
          "
        >
          {renderSection()}
        </div>

      </main>

    </div>
  );
}

export default AdminLayout;