import React from "react";
import { IoSunny } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { MdSettings } from "react-icons/md";

const Navbar = () => {
  return (
    <>
      <div className="nav flex items-center justify-between px-[100px] h-[90px] border-b-[1px] border-gray-800">
        <div className="logo">
            <h3 className="text-[25px] font-[700] special-text">SynthUI</h3>
        </div>
        <div className="icons flex items-center gap-[15px]">
            <div className="icon"><IoSunny /></div>
            <div className="icon"><FaUser /></div>
            <div className="icon"><MdSettings /></div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
