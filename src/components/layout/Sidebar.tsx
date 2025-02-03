import React from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, Settings, Box } from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: Users, label: "Users", path: "/users" },
  { icon: Box, label: "Products", path: "/products" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

const Sidebar: React.FC = () => {
  const location = useLocation();

  return (
    <aside className="bg-[#233558] text-white w-52 min-h-screen p-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Portal</h1>
      </div>

      <nav>
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 px-4 py-2 rounded-lg transition-colors",
                    location.pathname === item.path
                      ? "bg-[#1362fb] text-white"
                      : "hover:bg-[#1362fb]/10"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
