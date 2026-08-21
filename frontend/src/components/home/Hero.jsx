import FadeIn from "./FadeIn.jsx";



import React from 'react';
import { ArrowRight, ShieldCheck, Globe } from 'lucide-react';
import { useDonate } from '../../context/DonateContext';

const Hero = () => {
    const { openDonate } = useDonate();

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
            
            {/* Left: Hero Card */}
            <div className="lg:col-span-7 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
                
                {/* Background Pattern */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full blur-2xl -ml-10 -mb-10" />

                <div className="relative z-10 overflow-visible">

                    <FadeIn>
                        <div className="flex gap-3 mb-6">
                            <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium flex items-center gap-1">
                                <ShieldCheck className="w-3 h-3" /> Verified NGOs
                            </span>
                            <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium flex items-center gap-1">
                                <Globe className="w-3 h-3" /> 100% Transparent
                            </span>
                        </div>
                    </FadeIn>

                    <FadeIn>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 leading-tight">
                            Donate with <br />
                            <span className="text-emerald-300">Absolute Trust</span>
                        </h1>
                    </FadeIn>

                    <FadeIn>
                        <p className="text-indigo-100 text-lg mb-8 max-w-lg">
                            Every donation is tracked on-chain. See exactly when your funds reach the NGO and how they are spent.
                        </p>
                    </FadeIn>

                    <FadeIn>
                        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                            <p className="text-sm text-indigo-100 mb-3">Quick Donate</p>

                            <div className="flex flex-wrap gap-3 mb-4">
                                {[10, 50, 100].map((amount) => (
                                    <button
                                        key={amount}
                                        onClick={() => openDonate({ amount })}
                                        className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg font-medium transition-colors border border-white/10"
                                    >
                                        ₳ {amount}
                                    </button>
                                ))}

                                <input
                                    type="number"
                                    placeholder="Custom"
                                    className="w-24 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-indigo-300 focus:outline-none focus:bg-white/10"
                                />
                            </div>

                            <button
                                onClick={() => openDonate()}
                                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-lg shadow-lg shadow-emerald-900/20 transition-all flex items-center justify-center gap-2 group"
                            >
                                Donate Now <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </FadeIn>

                </div>
            </div>

            {/* Right: Live Snapshot */}
            <div className="lg:col-span-5 flex flex-col gap-4">

                <FadeIn>
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 h-full flex flex-col">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                <span className="relative flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                                </span>
                                Live Activity
                            </h3>
                            <button className="text-primary text-sm font-medium hover:underline">View all</button>
                        </div>

                        <div className="flex-1 space-y-3">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors border border-slate-100">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-xs font-bold">
                                        {i % 2 === 0 ? 'AN' : 'JD'}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-baseline">
                                            <p className="text-sm font-medium text-slate-900 truncate">
                                                {i % 2 === 0 ? 'Anonymous' : 'John Doe'}
                                            </p>
                                            <span className="text-sm font-bold text-emerald-600">+ ₳{i * 25}</span>
                                        </div>

                                        <p className="text-xs text-slate-500 truncate">
                                            donated to <span className="text-primary">Clean Water Initiative</span>
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-4 pt-4 border-t border-slate-100 text-center">
                            <p className="text-xs text-slate-400">Last block confirmed 1m ago</p>
                        </div>
                    </div>
                </FadeIn>

            </div>

        </div>
    );
};

export default Hero;
