import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Radio, Heart, Building2, FileText, History, Settings, LayoutDashboard } from 'lucide-react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

const navItems = [
    { icon: Home, label: 'Explore', path: '/explore' },
    { icon: Radio, label: 'Live Feed', path: '/feed' },
    { icon: Heart, label: 'Campaigns', path: '/campaigns' },
    { icon: Building2, label: 'NGO Updates', path: '/updates' },
    { icon: FileText, label: 'Audit', path: '/audit' },
    { icon: History, label: 'My Donations', path: '/donations' },
    { icon: LayoutDashboard, label: 'NGO Dashboard', path: '/ngo' },
    { icon: Settings, label: 'Settings', path: '/settings' },
];

const Sidebar = () => {
    return (
        <aside className="hidden md:flex flex-col w-64 h-[calc(100vh-4rem)] sticky top-16 border-r border-slate-200 bg-white/50 backdrop-blur-sm p-4">
            <nav className="flex flex-col gap-2">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
              ${isActive
                                ? 'bg-primary/10 text-primary font-medium shadow-sm'
                                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                            }
            `}
                    >
                        <item.icon className="w-5 h-5" />
                        <span>{item.label}</span>
                        {/* Hover indicator */}
                        <motion.div
                            className="absolute left-0 w-1 h-8 bg-primary rounded-r-full opacity-0"
                            initial={false}
                            whileHover={{ opacity: 1 }}
                        />
                    </NavLink>
                ))}
            </nav>

            <div className="mt-auto p-4 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-xs text-slate-500 font-medium mb-2">Your Impact</p>
                <div className="flex items-end gap-1">
                    <span className="text-2xl font-bold text-primary">₳450</span>
                    <span className="text-xs text-slate-400 mb-1">donated</span>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
