import React, { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, ChevronDown, LogOut, Copy, ExternalLink } from 'lucide-react';

const WalletConnect = () => {
    const [isConnected, setIsConnected] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [balance, setBalance] = useState(null);
    const [address, setAddress] = useState(null);

    const connectWallet = () => {
        // Simulate connection
        setTimeout(() => {
            setIsConnected(true);
            setBalance(1250.50);
            setAddress('addr1...9a2b');
        }, 500);
    };

    const disconnectWallet = () => {
        setIsConnected(false);
        setBalance(null);
        setAddress(null);
        setIsDropdownOpen(false);
    };

    return (
        <div className="relative">
            {!isConnected ? (
                <button
                    onClick={connectWallet}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg font-bold hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20"
                >
                    <Wallet className="w-4 h-4" />
                    Connect Wallet
                </button>
            ) : (
                <div className="relative">
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="flex items-center gap-3 px-4 py-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                        <div className="flex flex-col items-end leading-none">
                            <span className="text-sm font-bold text-slate-900">₳ {balance.toLocaleString()}</span>
                            <span className="text-[10px] text-slate-500 font-mono">{address}</span>
                        </div>
                        <div className="w-8 h-8 bg-gradient-to-br from-primary to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
                            JD
                        </div>
                        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                        {isDropdownOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-100 p-2 z-50"
                            >
                                <div className="p-3 border-b border-slate-50 mb-2">
                                    <p className="text-xs text-slate-500 font-bold uppercase mb-1">Connected Wallet</p>
                                    <div className="flex items-center justify-between">
                                        <span className="font-bold text-slate-900">Nami Wallet</span>
                                        <span className="w-2 h-2 bg-emerald-500 rounded-full" />
                                    </div>
                                </div>

                                <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
                                    <Copy className="w-4 h-4" /> Copy Address
                                </button>
                                <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
                                    <ExternalLink className="w-4 h-4" /> View on Explorer
                                </button>

                                <div className="h-px bg-slate-100 my-2" />

                                <button
                                    onClick={disconnectWallet}
                                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-rose-600 hover:bg-rose-50 rounded-lg transition-colors font-medium"
                                >
                                    <LogOut className="w-4 h-4" /> Disconnect
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
};

export default WalletConnect;
