import React from "react";
import { useTDispatch } from "@/hooks/use-redux";
import { LogOut, HomeIcon } from "lucide-react";
import { logout } from "@/redux/reducers/authSlice";
import Tooltip from "../ui/Tooltip/Tooltip";
import { useNavigate } from "react-router-dom";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useTDispatch();

  const handelLogout = () => {
    dispatch(logout());
  };
  return (
    <nav className="bg-white  border-b border-borderColor px-4 py-2.5 sticky top-0 z-50 ">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Tooltip content="Home Page" position={Tooltip.Position.BottomRight}>
            <div
              className="p-1 border border-black/70 rounded-full"
              onClick={() => navigate("/")}
            >
              <HomeIcon className="text-gray-600" size={22} />
            </div>
          </Tooltip>
          <span className="text-xl font-medium text-textColor font-poppins tracking-wider">
            Management Portal
          </span>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-lg font-medium text-textColor font-poppins tracking-wider">
            Admin
          </span>
          <Tooltip content="Logout" position={Tooltip.Position.BottomLeft}>
            <button
              className="p-2 hover:bg-gray-100 rounded-full"
              onClick={handelLogout}
            >
              <LogOut className="w-5 h-5 text-[#233558]" />
            </button>
          </Tooltip>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
