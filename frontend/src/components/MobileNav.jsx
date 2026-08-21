import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Heart, Activity, User } from 'lucide-react';

const MobileNav = () => {
    const navItems = [
        { icon: Home, label: 'Home', path: '/' },
        { icon: Heart, label: 'Donate', path: '/campaigns' },
        { icon: Activity, label: 'Activity', path: '/feed' },
        { icon: User, label: 'Profile', path: '/donations' },
    ];

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 pb-safe z-50">
            <div className="flex justify-around items-center h-16">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => `
              flex flex-col items-center justify-center w-full h-full gap-1
              ${isActive ? 'text-primary' : 'text-slate-400'}
            `}
                    >
                        <item.icon className="w-6 h-6" />
                        <span className="text-[10px] font-medium">{item.label}</span>
                    </NavLink>
                ))}
            </div>
        </nav>
    );
};

export default MobileNav;
