import React from 'react';
import { motion } from 'framer-motion';
import { Users, Clock, ArrowRight } from 'lucide-react';
import { useDonate } from '../../context/DonateContext';

const CampaignCard = ({ campaign, onClick }) => {
    const { title, organization, image, raised, goal, donors, daysLeft, category } = campaign;
    const progress = Math.min((raised / goal) * 100, 100);
    const { openDonate } = useDonate();

    const handleDonate = (e) => {
        e.stopPropagation();
        openDonate({ campaignTitle: title, amount: 50 });
    };

    return (
        <motion.div
            layoutId={`card-${campaign.id}`}
            onClick={() => onClick(campaign)}
            className="
                group cursor-pointer
                rounded-2xl overflow-hidden 
                bg-white/20 backdrop-blur-2xl 
                border border-white/40 
                shadow-glass transition-all duration-300
                hover:shadow-glassDeep hover:-translate-y-2
                relative
            "
        >

            {/* 🔹 Top Image Section */}
            <div className="relative h-48 overflow-hidden">
                <img
                    src={image}
                    alt={title}
                    className="
                        w-full h-full object-cover 
                        transition-transform duration-700 
                        group-hover:scale-110
                    "
                />

                {/* Shine Overlay */}
                <div
                    className="
                        absolute inset-0 
                        bg-gradient-to-r from-transparent via-white/25 to-transparent 
                        opacity-0 group-hover:opacity-100
                        animate-shine pointer-events-none
                    "
                />

                {/* Days Left Badge (Glass) */}
                <div className="
                    absolute top-3 right-3 px-3 py-1 
                    rounded-full text-white text-xs font-medium
                    bg-black/30 backdrop-blur-xl 
                    border border-white/20 shadow-sm 
                    flex items-center gap-1
                ">
                    <Clock className="w-3 h-3" /> {daysLeft} days left
                </div>

                {/* Category Badge (Glass) */}
                <div className="
                    absolute top-3 left-3 px-3 py-1 
                    rounded-full text-primary text-[10px] font-bold uppercase tracking-wide
                    bg-white/60 backdrop-blur-md border border-white/40 shadow-sm
                ">
                    {category}
                </div>

                {/* Hover Overlay — View Details */}
                <div className="
                    absolute inset-0 bg-primary/60 
                    opacity-0 group-hover:opacity-100 
                    flex items-center justify-center
                    transition-all duration-300
                ">
                    <span className="
                        text-white font-bold text-sm flex items-center gap-2
                        translate-y-3 group-hover:translate-y-0 
                        transition-all duration-300
                    ">
                        View Details <ArrowRight className="w-4 h-4" />
                    </span>
                </div>
            </div>

            {/* 🔹 Content Section */}
            <div className="p-5">
                <h3 className="font-extrabold text-slate-900 text-lg leading-tight line-clamp-2 mb-1">
                    {title}
                </h3>

                <p className="text-xs text-slate-600 mb-4">
                    by <span className="text-primary font-semibold">{organization}</span>
                </p>

                {/* Progress Section */}
                <div className="mb-4">
                    <div className="flex justify-between text-xs mb-1">
                        <span className="font-bold text-slate-900">₳ {raised.toLocaleString()}</span>
                        <span className="text-slate-600">of ₳ {goal.toLocaleString()}</span>
                    </div>

                    {/* Glass Progress bar */}
                    <div className="
                        w-full h-2.5 bg-white/30 
                        backdrop-blur-md border border-white/40 
                        rounded-full overflow-hidden
                    ">
                        <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${progress}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="
                                h-full bg-emerald-500 rounded-full shadow-sm relative
                            "
                        >
                            <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]" />
                        </motion.div>
                    </div>
                </div>

                {/* 🔹 Footer Section */}
                <div className="flex items-center justify-between pt-4 border-t border-white/30">

                    {/* Donor Avatars (Glass) */}
                    <div className="flex items-center gap-2">
                        <div className="flex -space-x-2">
                            {[1, 2, 3].map((i) => (
                                <div
                                    key={i}
                                    className="
                                        w-7 h-7 rounded-full 
                                        bg-white/50 backdrop-blur-md 
                                        border border-white/60 shadow-sm
                                        flex items-center justify-center
                                        text-[9px] font-bold text-slate-700
                                    "
                                >
                                    {String.fromCharCode(64 + i)}
                                </div>
                            ))}
                        </div>

                        <span className="text-[11px] text-slate-600 font-medium">
                            +{donors} donors
                        </span>
                    </div>

                    {/* Donate Button */}
                    <button
                        onClick={handleDonate}
                        className="
                            text-primary text-sm font-bold 
                            hover:underline hover:text-primary-light
                            transition-all
                        "
                    >
                        Donate
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default CampaignCard;
