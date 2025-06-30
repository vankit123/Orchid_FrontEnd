"use client";

import React, { useState } from "react";
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
  Settings,
  X,
  LogOut,
} from "lucide-react";
import DashboardContent from "../components/admin/DashboardContent";
import ProductsManagement from "../components/admin/ProductsManagement";
import { useNavigate } from "react-router";

// Import components

// Add this style tag right after the imports

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  // Sample data
  const token = localStorage.getItem("token");
      const handleLogout = () => {
    if (token) {
      // Logout
      localStorage.removeItem("token")
      navigate("/login")
      // Add any additional logout logic here
    } else {
      // Login - you can redirect to login page or open login modal
      navigate("/login")
    }
  }

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "products", label: "Quản lý sản phẩm", icon: Package },

  ];

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <DashboardContent

          />
        );
      case "products":
        return (
          <ProductsManagement


          />
        );

      default:
        return (
          <DashboardContent
 
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <div
        className={`fixed left-0 top-0 h-full w-70 bg-white/90 backdrop-blur-lg border-r rounded-2xl border-white/20  transform transition-transform duration-300 -translate-x-full lg:translate-x-0`}
      >
        <div className="h-full p-6">
          <div className="flex items-center justify-between mb-10">
            <div className=" text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Admin Panel
            </div>
          </div>

          <nav className="h-full">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3  !rounded-2xl mb-2 ${
                    activeTab === item.id
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white "
                      : "text-gray-600 hover:bg-gray-100 mt-10"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium ">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="absolute bottom-6 left-6 right-6">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-xl transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Đăng xuất</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-64">
        <div className="p-6">{renderContent()}</div>
      </div>
    </div>
  );
}
