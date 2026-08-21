import React from 'react';
import Hero from '../components/home/Hero';
import Metrics from '../components/home/Metrics';

const Home = () => {
    return (
        <div className="min-h-screen px-6 pt-6 animate-fadesoft relative overflow-hidden">

            {/* 🔵 Mesh Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#DCEAF7] via-[#b7d4f5] to-[#8fc8ff] opacity-60 -z-10" />

            {/* Soft blurred blobs */}
            <div className="absolute -top-32 -left-20 w-[500px] h-[500px] bg-white/30 blur-[120px] rounded-full -z-10"></div>
            <div className="absolute bottom-0 right-0 w-[450px] h-[450px] bg-blue-200/40 blur-[130px] rounded-full -z-10"></div>

            {/* HERO + METRICS */}
            <Hero />
            <Metrics />

            {/* Trending Campaigns Section */}
            <div className="mb-16 mt-10">

                {/* Section Header */}
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight drop-shadow-sm">
                            Trending Campaigns
                        </h2>
                        <p className="text-slate-600">
                            Support the most urgent causes right now
                        </p>
                    </div>

                    <button className="
                        px-4 py-2 rounded-xl
                        bg-white/30 backdrop-blur-xl
                        border border-white/40 shadow-glass
                        text-primary font-semibold
                        transition-all hover:bg-white/50 hover:shadow-glassDeep
                    ">
                        View all campaigns
                    </button>
                </div>

                {/* 🔹 Campaign Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">

                    {[1, 2, 3, 4].map((i) => (
                        <div
                            key={i}
                            className="
                                rounded-2xl overflow-hidden
                                bg-white/30 backdrop-blur-xl
                                border border-white/50 shadow-glass
                                transition-all duration-300
                                hover:shadow-glassDeep hover:-translate-y-2
                            "
                        >

                            {/* Campaign Image */}
                            <div className="h-40 bg-gradient-to-br from-slate-200 to-slate-300 relative">

                                {/* Frosted Deadline Badge */}
                                <div className="
                                    absolute top-3 right-3
                                    bg-black/30 backdrop-blur-xl
                                    text-white text-xs px-3 py-1 
                                    rounded-full border border-white/20
                                ">
                                    12 days left
                                </div>
                            </div>

                            {/* CARD CONTENT */}
                            <div className="p-5">

                                {/* Top Row */}
                                <div className="flex justify-between items-start mb-3">
                                    <span className="
                                        text-xs font-bold text-primary 
                                        bg-primary/10 px-3 py-1 rounded-lg 
                                        shadow-sm backdrop-blur-sm
                                    ">
                                        Education
                                    </span>

                                    <span className="text-xs text-slate-500">
                                        by EduCare
                                    </span>
                                </div>

                                {/* Title */}
                                <h3 className="
                                    font-bold text-slate-900 text-lg mb-3 
                                    line-clamp-1
                                ">
                                    Build a School in Rural Area
                                </h3>

                                {/* Progress Bar */}
                                <div className="w-full bg-white/40 backdrop-blur-sm h-2 rounded-full mb-3 overflow-hidden border border-white/50">
                                    <div 
                                        className="bg-emerald-500 h-full rounded-full shadow-sm" 
                                        style={{ width: '65%' }}
                                    ></div>
                                </div>

                                {/* Raised Info */}
                                <div className="flex justify-between text-xs text-slate-600 mb-6">
                                    <span>₳ 6,500 raised</span>
                                    <span>65%</span>
                                </div>

                                {/* Donate Button */}
                                <button className="
                                    w-full py-2 rounded-xl font-semibold
                                    bg-white/30 backdrop-blur-xl
                                    border border-primary/40 text-primary
                                    transition-all 
                                    hover:bg-primary hover:text-white hover:shadow-glassDeep
                                ">
                                    Donate
                                </button>
                            </div>
                        </div>
                    ))}

                </div>
            </div>
        </div>
    );
};

export default Home;
