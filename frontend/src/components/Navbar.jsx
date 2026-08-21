import React from 'react';
import { Search, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';
import WalletConnect from './wallet/WalletConnect';

const Navbar = () => {
    return (
        <nav className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-slate-200">
            <div className="flex items-center justify-between px-4 md:px-6 h-16">
                {/* Left: Logo */}
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-xl">D</span>
                    </div>
                    <span className="text-xl font-bold text-slate-900 hidden sm:block">Dono</span>
                </div>

                {/* Center: Search */}
                <div className="hidden md:flex flex-1 max-w-md mx-8 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search campaigns, NGOs..."
                        className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-full text-sm focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all"
                    />
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-4">
                    <SignedIn>
                        <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
                        </button>
                        <UserButton afterSignOutUrl="/" />
                    </SignedIn>

                    <SignedOut>
                        <Link to="/login" className="text-sm font-semibold text-slate-600 hover:text-primary transition-colors">
                            Sign In
                        </Link>
                        <Link to="/signup" className="px-4 py-2 bg-primary text-white text-sm font-bold rounded-full hover:bg-primary-hover transition-colors shadow-lg shadow-primary/20">
                            Get Started
                        </Link>
                    </SignedOut>

                    <div className="h-6 w-px bg-slate-200 mx-1" />

                    <WalletConnect />
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
