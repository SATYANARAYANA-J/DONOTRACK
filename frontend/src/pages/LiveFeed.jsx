import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, TrendingUp, Filter } from 'lucide-react';
import FeedItem from '../components/feed/FeedItem';

// Mock Data Generator
const generateMockDonation = (id) => {
    const donors = ["Alice", "Bob", "Charlie", "Anonymous", "David", "Eve"];
    const ngos = ["Clean Water Initiative", "EduCare", "Save the Rainforest", "Global Aid", "Tech for Kids"];
    const messages = ["Keep up the good work!", "Happy to help.", "For a better future.", "", "Sending love."];

    return {
        id,
        donor: donors[Math.floor(Math.random() * donors.length)],
        amount: Math.floor(Math.random() * 500) + 10,
        currency: "₳",
        ngo: ngos[Math.floor(Math.random() * ngos.length)],
        message: messages[Math.floor(Math.random() * messages.length)],
        status: Math.random() > 0.2 ? 'confirmed' : 'pending',
        txHash: "0x" + Math.random().toString(16).substr(2, 40),
        timestamp: "Just now",
        avatar: null
    };
};

const LiveFeed = () => {
    const [donations, setDonations] = useState([]);

    // Simulate incoming donations
    useEffect(() => {
        const initialData = Array.from({ length: 10 }).map((_, i) => generateMockDonation(i));
        setDonations(initialData);

        const interval = setInterval(() => {
            setDonations(prev => {
                const newDonation = generateMockDonation(Date.now());
                return [newDonation, ...prev].slice(0, 50);
            });
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div
            className="
                max-w-7xl mx-auto 
                relative
                px-4 md:px-0
                pt-6 pb-20
            "
        >
            {/* Background Mesh */}
            <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
                <div className="absolute top-[10%] right-[5%] w-[500px] h-[500px] bg-indigo-300/30 blur-[120px] rounded-full" />
                <div className="absolute bottom-[15%] left-[10%] w-[400px] h-[400px] bg-emerald-300/30 blur-[140px] rounded-full" />
                <div className="absolute top-[40%] left-[30%] w-[600px] h-[600px] bg-blue-200/30 blur-[150px] rounded-full" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                {/* Main Feed Column */}
                <div className="lg:col-span-8">
                    <div className="flex justify-between items-center mb-8">

                        {/* Title + Icon */}
                        <div className="flex items-center gap-4">
                            <div className="
                                p-3 rounded-xl
                                bg-white/30 backdrop-blur-xl
                                border border-white/40 
                                shadow-glass
                            ">
                                <Activity className="w-6 h-6 text-emerald-600" />
                            </div>

                            <div>
                                <h1 className="text-3xl font-extrabold text-slate-900">Live Donations</h1>
                                <p className="text-slate-600 text-sm mt-1">Real-time blockchain activity</p>
                            </div>
                        </div>

                        {/* Filter Button */}
                        <button
                            className="
                                flex items-center gap-2 px-5 py-2.5 text-sm font-semibold
                                bg-white/30 backdrop-blur-xl
                                border border-white/40 rounded-xl
                                hover:bg-white/50 
                                transition-all shadow-glass
                            "
                        >
                            <Filter className="w-4 h-4" /> Filter
                        </button>
                    </div>

                    {/* FEED LIST */}
                    <div className="space-y-5">
                        <AnimatePresence initial={false}>
                            {donations.map((donation, index) => (
                                <FeedItem key={donation.id} donation={donation} index={index} />
                            ))}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Sidebar Column */}
                <div className="hidden lg:flex lg:col-span-4 flex-col gap-8">

                    {/* Stats Card */}
                    <div
                        className="
                            p-6 rounded-2xl
                            bg-white/30 backdrop-blur-2xl
                            border border-white/40
                            shadow-glass
                        "
                    >
                        <h3 className="font-bold text-slate-900 mb-5 text-lg">Feed Stats (24h)</h3>

                        <div className="space-y-4 text-sm">
                            <div className="flex justify-between">
                                <span className="text-slate-600">Total Volume</span>
                                <span className="font-semibold text-slate-900">₳ 45,230</span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-slate-600">Donations</span>
                                <span className="font-semibold text-slate-900">1,245</span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-slate-600">Avg. Amount</span>
                                <span className="font-semibold text-slate-900">₳ 36</span>
                            </div>
                        </div>
                    </div>

                    {/* Trending Card */}
                    <div
                        className="
                            p-6 rounded-2xl
                            bg-white/30 backdrop-blur-2xl
                            border border-white/40
                            shadow-glass
                        "
                    >
                        <div className="flex items-center gap-2 mb-5">
                            <TrendingUp className="w-5 h-5 text-primary" />
                            <h3 className="font-bold text-slate-900 text-lg">Trending Now</h3>
                        </div>

                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <motion.div
                                    key={i}
                                    whileHover={{ scale: 1.03 }}
                                    className="
                                        flex items-center gap-4 p-3 rounded-xl cursor-pointer
                                        bg-white/20 backdrop-blur-xl
                                        border border-white/40
                                        shadow-glass hover:shadow-glassDeep
                                        transition-all
                                    "
                                >
                                    <div className="w-12 h-12 rounded-lg overflow-hidden">
                                        <img
                                            src={`https://picsum.photos/seed/${i}/100`}
                                            alt="Campaign"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    <div>
                                        <p className="text-sm font-bold text-slate-900">Emergency Relief Fund</p>
                                        <p className="text-xs text-emerald-600 font-medium">+12% last hour</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
};

export default LiveFeed;
