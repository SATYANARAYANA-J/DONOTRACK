// src/components/Layout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import MobileNav from './MobileNav';

const Layout = () => {
    return (
        <div className="min-h-screen bg-background text-text-primary">
            <Navbar />

            <div className="flex max-w-7xl mx-auto">
                <Sidebar />

                <main className="flex-1 p-4 pb-24 md:pb-8 w-full">
                    <Outlet />
                </main>
            </div>

            <MobileNav />
        </div>
    );
};

export default Layout;   // ← VERY IMPORTANT
