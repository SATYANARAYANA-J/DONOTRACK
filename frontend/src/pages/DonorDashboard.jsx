import React from "react";
import { motion } from "framer-motion";
import {
    Heart,
    TrendingUp,
    FileText,
    ExternalLink,
    Calendar,
    ArrowUpRight,
} from "lucide-react";

const DonorDashboard = () => {
    // Mock Data
    const stats = [
        {
            label: "Total Donated",
            value: "₳ 1,250",
            icon: Heart,
            glow: "from-rose-400/30 to-transparent",
        },
        {
            label: "Projects Supported",
            value: "12",
            icon: TrendingUp,
            glow: "from-emerald-400/30 to-transparent",
        },
        {
            label: "Tax Deductible",
            value: "₳ 1,250",
            icon: FileText,
            glow: "from-blue-400/30 to-transparent",
        },
    ];

    const history = [
        {
            id: 1,
            ngo: "Clean Water Initiative",
            amount: 500,
            date: "2023-10-24",
            status: "Confirmed",
            tx: "0x123...abc",
        },
        {
            id: 2,
            ngo: "EduCare Foundation",
            amount: 250,
            date: "2023-10-15",
            status: "Confirmed",
            tx: "0x456...def",
        },
        {
            id: 3,
            ngo: "Save the Rainforest",
            amount: 500,
            date: "2023-09-28",
            status: "Confirmed",
            tx: "0x789...ghi",
        },
    ];

    return (
        <div className="relative max-w-7xl mx-auto space-y-12 px-4 md:px-0">

            {/* Mesh Gradient Background */}
            <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
                <div className="absolute top-[10%] right-[10%] w-[500px] h-[500px] bg-indigo-300/40 blur-[140px] rounded-full" />
                <div className="absolute bottom-[15%] left-[15%] w-[500px] h-[500px] bg-emerald-300/40 blur-[150px] rounded-full" />
                <div className="absolute top-[40%] left-[40%] w-[600px] h-[600px] bg-blue-200/40 blur-[180px] rounded-full" />
            </div>

            {/* Header */}
            <div>
                <h1 className="text-3xl font-extrabold text-slate-900">My Impact</h1>
                <p className="text-slate-600">
                    Track your donations & download tax reports.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {stats.map((stat, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.03 }}
                        className="
                            p-6 rounded-2xl relative overflow-hidden
                            bg-white/25 backdrop-blur-2xl
                            border border-white/40 shadow-glass
                        "
                    >
                        <div
                            className={`absolute inset-0 bg-gradient-to-br ${stat.glow} blur-2xl opacity-60`}
                        />

                        <div className="relative z-10 flex items-center gap-4">
                            <div
                                className="
                                    p-3 rounded-xl 
                                    bg-white/40 backdrop-blur-xl 
                                    border border-white/50 shadow-inner
                                "
                            >
                                <stat.icon className="w-6 h-6 text-slate-900" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-600">{stat.label}</p>
                                <p className="text-2xl font-extrabold text-slate-900">
                                    {stat.value}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Main Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                {/* Left: Donation History */}
                <div className="lg:col-span-2 space-y-6">

                    <div
                        className="
                            bg-white/20 backdrop-blur-2xl
                            border border-white/40 shadow-glass
                            rounded-2xl overflow-hidden
                        "
                    >
                        <div className="p-6 border-b border-white/20 flex justify-between items-center">
                            <h2 className="text-lg font-extrabold text-slate-900">
                                Donation History
                            </h2>
                            <button className="text-primary text-sm font-semibold hover:underline">
                                Download CSV
                            </button>
                        </div>

                        <div className="divide-y divide-white/20">
                            {history.map((item) => (
                                <div
                                    key={item.id}
                                    className="
                                        p-6 flex items-center justify-between
                                        hover:bg-white/10 transition-all
                                    "
                                >
                                    <div className="flex items-center gap-4">
                                        <div
                                            className="
                                                w-12 h-12 rounded-full bg-white/40 
                                                backdrop-blur-xl border border-white/50
                                                flex items-center justify-center shadow-inner
                                            "
                                        >
                                            <Heart className="w-5 h-5 text-rose-500" />
                                        </div>

                                        <div>
                                            <h3 className="font-bold text-slate-900">
                                                {item.ngo}
                                            </h3>
                                            <div className="flex items-center gap-2 text-xs text-slate-600">
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" /> {item.date}
                                                </span>
                                                <span>•</span>
                                                <span className="text-emerald-600 font-semibold">
                                                    {item.status}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <p className="font-extrabold text-slate-900">
                                            ₳ {item.amount}
                                        </p>

                                        <a
                                            href="#"
                                            className="
                                                text-xs text-primary 
                                                flex items-center justify-end gap-1
                                                hover:underline
                                            "
                                        >
                                            View <ExternalLink className="w-3 h-3" />
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right: Impact Summary + Tax */}
                <div className="space-y-6">

                    {/* Impact Summary */}
                    <div
                        className="
                            bg-gradient-to-br from-indigo-600 to-violet-700 
                            p-6 rounded-2xl shadow-xl text-white
                        "
                    >
                        <h3 className="font-bold text-lg mb-4">Your Real-world Impact</h3>

                        <div className="space-y-5">
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                                    💧
                                </div>
                                <div>
                                    <p className="font-bold text-white">500 Liters</p>
                                    <p className="text-indigo-100 text-sm">
                                        Clean water provided to families in need.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                                    📚
                                </div>
                                <div>
                                    <p className="font-bold text-white">2 Semesters</p>
                                    <p className="text-indigo-100 text-sm">
                                        Of education sponsored for underprivileged students.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <button
                            className="
                                w-full mt-6 py-3 rounded-xl
                                bg-white text-indigo-600 
                                font-bold flex items-center justify-center gap-2
                                hover:bg-indigo-50 transition-all
                            "
                        >
                            Share Impact <ArrowUpRight className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Tax Documents */}
                    <div
                        className="
                            p-6 rounded-2xl
                            bg-white/20 backdrop-blur-2xl 
                            border border-white/40 shadow-glass
                        "
                    >
                        <h3 className="font-bold text-slate-900 mb-2">Tax Documents</h3>
                        <p className="text-sm text-slate-600 mb-5">
                            Download your annual donation summary for tax deductions.
                        </p>

                        <button
                            className="
                                w-full py-3 rounded-xl
                                bg-white/40 backdrop-blur-xl 
                                border border-white/50 shadow-inner
                                text-slate-700 font-semibold
                                hover:bg-white/60 transition-all 
                                flex items-center justify-center gap-2
                            "
                        >
                            <FileText className="w-4 h-4" /> 2023 Summary.pdf
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DonorDashboard;
