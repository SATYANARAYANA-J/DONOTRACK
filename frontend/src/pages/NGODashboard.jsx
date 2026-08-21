import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
    LayoutDashboard,
    Users,
    Wallet,
    ArrowUpRight,
    Plus,
    Clock,
} from "lucide-react";

const NGODashboard = () => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePosition({
                x: e.clientX / window.innerWidth,
                y: e.clientY / window.innerHeight,
            });
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    return (
        <div className="relative max-w-7xl mx-auto space-y-10 px-4 md:px-0">

            {/* Mesh Background */}
            <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{ x: mousePosition.x * 25, y: mousePosition.y * 25 }}
                    className="absolute top-[10%] right-[5%] w-[600px] h-[600px] bg-indigo-300/40 blur-[140px] rounded-full"
                />
                <motion.div
                    animate={{ x: mousePosition.x * -20, y: mousePosition.y * -20 }}
                    className="absolute bottom-[15%] left-[10%] w-[500px] h-[500px] bg-emerald-300/40 blur-[160px] rounded-full"
                />
                <motion.div
                    animate={{ x: mousePosition.x * 15, y: mousePosition.y * -15 }}
                    className="absolute top-[45%] left-[35%] w-[700px] h-[700px] bg-blue-200/40 blur-[180px] rounded-full"
                />
            </div>

            {/* Header */}
            <div className="relative z-10 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900">
                        NGO Dashboard
                    </h1>
                    <p className="text-slate-600">
                        Manage your campaigns & track donor activity
                    </p>
                </div>

                <button
                    className="
                        px-5 py-2.5 rounded-xl font-bold flex items-center gap-2
                        bg-primary text-white shadow-lg shadow-primary/30
                        hover:bg-primary-hover hover:scale-[1.03]
                        transition-all
                    "
                >
                    <Plus className="w-4 h-4" /> New Campaign
                </button>
            </div>

            {/* Stats */}
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    {
                        label: "Total Raised",
                        value: "₳ 45,230",
                        icon: Wallet,
                        glow: "from-emerald-400/30 to-transparent",
                    },
                    {
                        label: "Active Donors",
                        value: "1,245",
                        icon: Users,
                        glow: "from-blue-400/30 to-transparent",
                    },
                    {
                        label: "Active Campaigns",
                        value: "3",
                        icon: LayoutDashboard,
                        glow: "from-indigo-400/30 to-transparent",
                    },
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        whileHover={{ scale: 1.03 }}
                        className="
                            p-6 rounded-2xl
                            bg-white/25 backdrop-blur-2xl
                            border border-white/40 shadow-glass
                            relative overflow-hidden
                        "
                    >
                        <div
                            className={`
                                absolute inset-0 bg-gradient-to-br ${stat.glow}
                                blur-2xl opacity-60 pointer-events-none
                            `}
                        />

                        <div className="relative flex items-center gap-4 z-10">
                            <div
                                className="
                                    p-3 rounded-xl bg-white/40 
                                    backdrop-blur-xl border border-white/50
                                    shadow-inner
                                "
                            >
                                <stat.icon className="w-6 h-6 text-slate-800" />
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

            {/* Active Campaigns Table */}
            <div
                className="
                    relative z-10 rounded-2xl overflow-hidden
                    bg-white/20 backdrop-blur-2xl
                    border border-white/40 shadow-glass
                "
            >
                <div className="p-6 border-b border-white/20">
                    <h2 className="text-lg font-extrabold text-slate-900">
                        Active Campaigns
                    </h2>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead
                            className="
                                bg-white/10 backdrop-blur-xl
                                border-b border-white/20
                                text-slate-700 font-semibold
                            "
                        >
                            <tr>
                                <th className="px-6 py-4">Campaign</th>
                                <th className="px-6 py-4">Raised</th>
                                <th className="px-6 py-4">Goal</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Action</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-white/20">
                            {[
                                {
                                    name: "Clean Water for All",
                                    raised: 12500,
                                    goal: 20000,
                                    status: "Active",
                                },
                                {
                                    name: "School Supplies 2024",
                                    raised: 5400,
                                    goal: 10000,
                                    status: "Active",
                                },
                                {
                                    name: "Emergency Relief",
                                    raised: 27330,
                                    goal: 50000,
                                    status: "Urgent",
                                },
                            ].map((c, i) => (
                                <tr
                                    key={i}
                                    className="
                                        hover:bg-white/10 transition-all cursor-pointer
                                    "
                                >
                                    <td className="px-6 py-4 font-semibold text-slate-900">
                                        {c.name}
                                    </td>

                                    <td className="px-6 py-4 text-emerald-600 font-bold">
                                        ₳ {c.raised.toLocaleString()}
                                    </td>

                                    <td className="px-6 py-4 text-slate-500">
                                        ₳ {c.goal.toLocaleString()}
                                    </td>

                                    <td className="px-6 py-4">
                                        <span
                                            className={`
                                                px-3 py-1 rounded-full text-xs font-bold 
                                                ${
                                                    c.status === "Urgent"
                                                        ? "bg-amber-100 text-amber-700"
                                                        : "bg-emerald-100 text-emerald-700"
                                                }
                                            `}
                                        >
                                            {c.status}
                                        </span>
                                    </td>

                                    <td className="px-6 py-4">
                                        <button
                                            className="
                                                text-primary font-semibold flex items-center gap-1
                                                hover:underline
                                            "
                                        >
                                            Manage{" "}
                                            <ArrowUpRight className="w-3 h-3" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Recent Activity */}
            <div
                className="
                    relative z-10 p-6 rounded-2xl
                    bg-white/20 backdrop-blur-2xl
                    border border-white/40 shadow-glass
                "
            >
                <h2 className="text-lg font-extrabold text-slate-900 mb-5">
                    Recent Activity
                </h2>

                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div
                            key={i}
                            className="
                                flex items-center gap-4 p-3 rounded-xl
                                hover:bg-white/10 transition-all
                            "
                        >
                            <div
                                className="
                                    w-12 h-12 rounded-full bg-white/40 
                                    backdrop-blur-xl border border-white/50
                                    flex items-center justify-center shadow-inner
                                "
                            >
                                <Clock className="w-5 h-5 text-slate-700" />
                            </div>

                            <div>
                                <p className="text-sm font-semibold text-slate-900">
                                    New donation received
                                </p>
                                <p className="text-xs text-slate-600">
                                    2 minutes ago • ₳ 50.00
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
};

export default NGODashboard;
