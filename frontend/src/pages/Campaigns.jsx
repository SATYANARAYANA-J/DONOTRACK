import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter } from 'lucide-react';
import CampaignCard from '../components/campaigns/CampaignCard';
import CampaignDrawer from '../components/campaigns/CampaignDrawer';

// Mock Data
const CAMPAIGNS = [
    {
        id: 1,
        title: "Clean Water for Rural Villages",
        organization: "Water For All",
        image: "https://images.unsplash.com/photo-1538300342682-cf57afb97285?auto=format&fit=crop&q=80&w=800",
        raised: 12500,
        goal: 20000,
        donors: 145,
        daysLeft: 12,
        category: "Environment"
    },
    {
        id: 2,
        title: "Tech Education for Kids",
        organization: "Future Coders",
        image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=800",
        raised: 5000,
        goal: 15000,
        donors: 42,
        daysLeft: 25,
        category: "Education"
    },
    {
        id: 3,
        title: "Emergency Relief Fund",
        organization: "Global Aid",
        image: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&q=80&w=800",
        raised: 45000,
        goal: 50000,
        donors: 890,
        daysLeft: 3,
        category: "Disaster Relief"
    },
    {
        id: 4,
        title: "Save the Rainforest",
        organization: "EcoWarriors",
        image: "https://images.unsplash.com/photo-1516937941348-c09639cd42c1?auto=format&fit=crop&q=80&w=800",
        raised: 8200,
        goal: 30000,
        donors: 76,
        daysLeft: 18,
        category: "Environment"
    },
    {
        id: 5,
        title: "Medical Supplies for Clinics",
        organization: "Health First",
        image: "https://images.unsplash.com/photo-1584515933487-9bdb0936e8bf?auto=format&fit=crop&q=80&w=800",
        raised: 18000,
        goal: 25000,
        donors: 210,
        daysLeft: 7,
        category: "Healthcare"
    }
];

const Campaigns = () => {
    const [selectedCampaign, setSelectedCampaign] = useState(null);

    return (
        <div className="min-h-screen px-6 py-10 relative animate-fadesoft overflow-hidden">

            {/* 🔵 Mesh Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#DCEAF7] via-[#bedcf6] to-[#9dceff] opacity-60 -z-10" />

            {/* Soft blurred blobs */}
            <div className="absolute -top-28 -left-16 w-[480px] h-[480px] bg-white/30 blur-[120px] rounded-full -z-10"></div>
            <div className="absolute bottom-0 right-0 w-[420px] h-[420px] bg-blue-300/40 blur-[150px] rounded-full -z-10"></div>

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
                <div>
                    <h1 className="text-4xl font-extrabold text-slate-900 drop-shadow-sm">Explore Campaigns</h1>
                    <p className="text-slate-600">
                        Support transparent, verified projects around the world.
                    </p>
                </div>

                {/* 🔍 Search + Filter */}
                <div className="flex gap-3 w-full md:w-auto">

                    {/* Search Bar */}
                    <div className="relative flex-1 md:w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Search campaigns..."
                            className="
                                w-full pl-10 pr-4 py-2.5
                                bg-white/30 backdrop-blur-xl
                                border border-white/50 rounded-xl
                                text-sm text-slate-700
                                shadow-glass focus:ring-2 focus:ring-primary/20
                                transition-all 
                            "
                        />
                    </div>

                    {/* Filter Button */}
                    <button
                        className="
                            p-2.5 rounded-xl
                            bg-white/30 backdrop-blur-xl
                            border border-white/50 shadow-glass
                            hover:bg-white/50 hover:shadow-glassDeep
                            transition-all active:scale-95
                        "
                    >
                        <Filter className="w-5 h-5 text-slate-700" />
                    </button>
                </div>
            </div>

            {/* Grid */}
            <motion.div
                layout
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
            >
                {CAMPAIGNS.map((campaign) => (
                    <CampaignCard
                        key={campaign.id}
                        campaign={campaign}
                        onClick={setSelectedCampaign}
                    />
                ))}
            </motion.div>

            {/* Drawer */}
            <CampaignDrawer
                campaign={selectedCampaign}
                isOpen={!!selectedCampaign}
                onClose={() => setSelectedCampaign(null)}
            />
        </div>
    );
};

export default Campaigns;
