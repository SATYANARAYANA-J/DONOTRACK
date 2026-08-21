import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Share2, ExternalLink, ShieldCheck } from 'lucide-react';
import { useDonate } from '../../context/DonateContext';

const CampaignDrawer = ({ campaign, isOpen, onClose }) => {
    const { openDonate } = useDonate();
    if (!campaign) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Blur Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="
                            fixed inset-0 
                            bg-black/20 backdrop-blur-xl 
                            z-50
                        "
                    />

                    {/* GLASS DRAWER */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 22, stiffness: 220 }}
                        className="
                            fixed inset-y-0 right-0 
                            w-full md:w-[480px] 
                            bg-white/20 backdrop-blur-2xl 
                            border-l border-white/30
                            shadow-[0_0_40px_rgba(0,0,0,0.15)]
                            z-50 overflow-y-auto 
                            relative
                        "
                    >
                        {/* Floating Close Button - Glass */}
                        <button
                            onClick={onClose}
                            className="
                                absolute top-4 right-4 z-50 
                                p-3 rounded-full
                                bg-white/40 backdrop-blur-xl 
                                border border-white/50
                                shadow-glass
                                transition-all
                                hover:bg-white/60
                            "
                        >
                            <X className="w-5 h-5 text-slate-700" />
                        </button>

                        {/* IMAGE SECTION */}
                        <div className="relative h-64 w-full overflow-hidden rounded-b-3xl">
                            <img
                                src={campaign.image}
                                alt={campaign.title}
                                className="w-full h-full object-cover"
                            />

                            {/* Top Shine Overlay */}
                            <div
                                className="
                                    absolute inset-0 bg-gradient-to-b 
                                    from-white/30 to-transparent
                                "
                            />
                        </div>

                        {/* CONTENT */}
                        <div className="p-6">

                            {/* GLASS BADGES */}
                            <div className="flex gap-3 mb-4">

                                <span className="
                                    px-4 py-1.5 rounded-full text-xs font-bold uppercase
                                    bg-white/40 backdrop-blur-xl 
                                    border border-white/40 text-emerald-700
                                ">
                                    {campaign.category}
                                </span>

                                <span className="
                                    px-4 py-1.5 rounded-full text-xs font-bold uppercase flex items-center gap-1
                                    bg-white/40 backdrop-blur-xl 
                                    border border-white/40 text-slate-700
                                ">
                                    <ShieldCheck className="w-3 h-3 text-emerald-500" />
                                    Verified
                                </span>
                            </div>

                            {/* TITLE */}
                            <h2 className="text-3xl font-extrabold text-slate-900 mb-1">
                                {campaign.title}
                            </h2>
                            <p className="text-slate-600 font-medium mb-6">
                                by <span className="text-primary font-semibold">{campaign.organization}</span>
                            </p>

                            {/* GLASS PROGRESS SECTION */}
                            <div className="
                                bg-white/40 backdrop-blur-xl 
                                border border-white/40 
                                shadow-inner rounded-2xl 
                                p-5 mb-8
                            ">
                                <div className="flex justify-between mb-3">
                                    <div>
                                        <p className="text-3xl font-extrabold text-slate-900 leading-tight">
                                            ₳ {campaign.raised.toLocaleString()}
                                        </p>
                                        <p className="text-xs text-slate-600">
                                            raised of ₳ {campaign.goal.toLocaleString()} goal
                                        </p>
                                    </div>

                                    <div className="text-right">
                                        <p className="text-2xl font-bold text-slate-900">
                                            {campaign.donors}
                                        </p>
                                        <p className="text-xs text-slate-600">donors</p>
                                    </div>
                                </div>

                                {/* Progress Bar */}
                                <div className="
                                    w-full h-3 bg-white/30 backdrop-blur-md 
                                    border border-white/40 
                                    rounded-full overflow-hidden
                                ">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${Math.min((campaign.raised / campaign.goal) * 100, 100)}%` }}
                                        transition={{ duration: 1.1, ease: "easeOut" }}
                                        className="
                                            h-full bg-emerald-500 rounded-full 
                                            shadow-[0_0_10px_rgba(16,185,129,0.5)]
                                            relative
                                        "
                                    >
                                        <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]" />
                                    </motion.div>
                                </div>
                            </div>

                            {/* BUTTONS */}
                            <div className="flex gap-3 mb-10">
                                <button
                                    onClick={() =>
                                        openDonate({ campaignTitle: campaign.title, amount: 50 })
                                    }
                                    className="
                                        flex-1 py-3 text-white font-bold rounded-xl
                                        bg-primary hover:bg-primary-hover 
                                        shadow-lg shadow-primary/30
                                        transition-all duration-200
                                        hover:scale-[1.03]
                                    "
                                >
                                    Donate Now
                                </button>

                                <button className="
                                    p-3 rounded-xl
                                    bg-white/40 backdrop-blur-xl 
                                    border border-white/50
                                    hover:bg-white/70 
                                    shadow-glass
                                    transition-all
                                ">
                                    <Share2 className="w-5 h-5 text-slate-700" />
                                </button>
                            </div>

                            {/* DESCRIPTION */}
                            <div className="mb-10">
                                <h3 className="text-lg font-bold text-slate-900 mb-2">About this campaign</h3>
                                <p className="text-slate-700 leading-relaxed">
                                    {campaign.description ||
                                        "This campaign uses blockchain-powered transparency to ensure your contributions make real, measurable impact."}
                                </p>
                            </div>

                            {/* UPDATES */}
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 mb-4">Latest Updates</h3>

                                <div className="border-l-2 border-white/40 pl-5 space-y-6">

                                    <div className="relative">
                                        <div className="
                                            absolute -left-[23px] top-1 
                                            w-4 h-4 rounded-full 
                                            bg-white/60 backdrop-blur-xl 
                                            border border-white shadow-sm
                                        " />

                                        <p className="text-xs text-slate-500 mb-1">2 days ago</p>

                                        <p className="text-slate-800 font-medium">
                                            First batch of supplies delivered
                                        </p>

                                        <button className="
                                            text-primary text-xs font-semibold mt-1 flex items-center gap-1 
                                            hover:underline
                                        ">
                                            View Proof <ExternalLink className="w-3 h-3" />
                                        </button>
                                    </div>

                                </div>
                            </div>

                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default CampaignDrawer;
