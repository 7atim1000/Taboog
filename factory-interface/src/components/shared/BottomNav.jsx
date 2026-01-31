import React from 'react';
import { FaRegCopyright, FaHeart } from "react-icons/fa";

const BottomNav = () => {
    const currentYear = new Date().getFullYear();

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50">
            {/* Main Footer Bar */}
            <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 shadow-lg border-t border-blue-500">
                <div className="container mx-auto">
                    {/* Desktop/Tablet View */}
                    <div className="hidden sm:flex items-center justify-between px-4 md:px-6 lg:px-8 h-14">
                        {/* Left Section */}
                        <div className="flex items-center gap-2 text-sm md:text-base">
                            <FaRegCopyright className="h-4 w-4 text-blue-200" />
                            <span className="text-blue-100 font-medium">
                                Copyright {currentYear}
                                <span className="text-white font-semibold mx-1">@microcode.com</span>
                                - All Right Reserved.
                            </span>
                        </div>
                        
                        {/* Center Section - Made with love */}
                        <div className="flex items-center gap-2 text-blue-200 text-sm">
                            <span>Made with</span>
                            <FaHeart className="h-3 w-3 text-red-300 animate-pulse" />
                            <span>by MicroCode Team</span>
                        </div>
                        
                        {/* Right Section - Version */}
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-blue-300 bg-blue-900/30 px-3 py-1 rounded-full">
                                v2.5.1
                            </span>
                            <span className="text-xs text-blue-200 hidden md:inline">
                                Enterprise ERP System
                            </span>
                        </div>
                    </div>

                    {/* Mobile View */}
                    <div className="sm:hidden flex flex-col items-center justify-center py-3 px-4">
                        {/* Main Copyright */}
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <FaRegCopyright className="h-3 w-3 text-blue-200" />
                            <p className="text-blue-100 text-sm font-medium text-center">
                                Copyright {currentYear}@microcode.com
                            </p>
                        </div>
                        
                        {/* Bottom Row */}
                        <div className="flex items-center justify-between w-full">
                            {/* Made with love */}
                            <div className="flex items-center gap-1 text-xs text-blue-200">
                                <FaHeart className="h-2 w-2 text-red-300" />
                                <span>MicroCode</span>
                            </div>
                            
                            {/* All rights reserved */}
                            <span className="text-xs text-blue-300 font-medium">
                                All Rights Reserved
                            </span>
                            
                            {/* Version */}
                            <span className="text-xs text-blue-200 bg-blue-900/30 px-2 py-1 rounded-full">
                                v2.5.1
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Decorative bottom border */}
            <div className="h-1 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600"></div>
        </div>
    );
};

export default BottomNav;

