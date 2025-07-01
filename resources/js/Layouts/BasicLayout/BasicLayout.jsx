// MainLayout.js
import React from "react";
import Navbar from "../MainLayout/Navbar";
import Body from "../MainLayout/Body";

function BasicLayout({ children, sideBarData }) {
    return (
        <div className="flex flex-col h-screen">
            <div className="w-full z-30 shadow-md">
                <Navbar />
            </div>
            <div className="flex-grow overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <Body children={children} />
                </div>
            </div>
            <footer className="bg-gray-100 shadow-lg mt-6 py-4">
                <div className="flex justify-between items-center px-6">
                    <div className="text-gray-600">
                        &copy; {new Date().getFullYear()} NBM International Limited
                    </div>
                    <div
                        className="text-gray-600"
                        style={{ marginLeft: "auto" }}
                    >
                        Developed by <strong>SourceExpert</strong>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default BasicLayout;
