import React, { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { FileText, DollarSign, Send, Paperclip } from 'lucide-react';

const SpendingUpdate = () => {
    const [selectedCampaign, setSelectedCampaign] = useState('');

    return (
        <div className="max-w-3xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900">Post Spending Update</h1>
                <p className="text-slate-500">Keep your donors informed about how funds are being used.</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-8 space-y-6">

                {/* Campaign Select */}
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Select Campaign</label>
                    <select
                        value={selectedCampaign}
                        onChange={(e) => setSelectedCampaign(e.target.value)}
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    >
                        <option value="">Choose a campaign...</option>
                        <option value="1">Clean Water for All</option>
                        <option value="2">School Supplies 2024</option>
                    </select>
                </div>

                {/* Update Details */}
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Update Title</label>
                    <input
                        type="text"
                        placeholder="e.g., Phase 1 Complete: Materials Purchased"
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Amount Spent (₳)</label>
                    <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input
                            type="number"
                            placeholder="1000"
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Details</label>
                    <textarea
                        rows="5"
                        placeholder="Describe what was purchased or achieved..."
                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                </div>

                {/* Attachments */}
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:bg-slate-50 transition-colors cursor-pointer">
                    <Paperclip className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-sm font-medium text-slate-600">Attach Invoices or Photos</p>
                    <p className="text-xs text-slate-400">Supports JPG, PNG, PDF</p>
                </div>

                <button className="w-full py-4 bg-primary hover:bg-primary-hover text-white font-bold rounded-xl shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2">
                    <Send className="w-5 h-5" /> Post Update
                </button>

            </div>
        </div>
    );
};

export default SpendingUpdate;
