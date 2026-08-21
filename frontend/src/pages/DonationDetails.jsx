import React from 'react';
import { useParams, Link } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { CheckCircle, ExternalLink, Download, ArrowLeft, Share2 } from 'lucide-react';

const DonationDetails = () => {
    const { id } = useParams();

    // Mock Data
    const donation = {
        id: id || 'tx_123456789',
        amount: 500,
        currency: '₳',
        campaign: 'Clean Water for All',
        ngo: 'Clean Water Initiative',
        date: 'Oct 24, 2023, 2:30 PM',
        status: 'Confirmed',
        block: 9482103,
        fee: 0.17,
        txHash: '0x8f2d8...3a1b9'
    };

    return (
        <div className="max-w-2xl mx-auto py-8">
            <Link to="/donations" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-6 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back to History
            </Link>

            <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden relative">
                {/* Success Header */}
                <div className="bg-emerald-500 p-8 text-center text-white relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                    <div className="relative z-10 flex flex-col items-center">
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mb-4">
                            <CheckCircle className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold">Donation Successful!</h1>
                        <p className="text-emerald-100 mt-1">Thank you for your contribution.</p>
                    </div>
                </div>

                {/* Receipt Content */}
                <div className="p-8">
                    <div className="flex flex-col items-center mb-8">
                        <span className="text-slate-500 text-sm font-medium uppercase tracking-wider">Total Amount</span>
                        <span className="text-4xl font-bold text-slate-900 mt-2">{donation.currency} {donation.amount}</span>
                    </div>

                    <div className="space-y-4 border-t border-b border-slate-100 py-6">
                        <div className="flex justify-between">
                            <span className="text-slate-500">Campaign</span>
                            <span className="font-bold text-slate-900">{donation.campaign}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-500">Organization</span>
                            <span className="font-bold text-slate-900">{donation.ngo}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-500">Date</span>
                            <span className="font-medium text-slate-900">{donation.date}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-500">Network Fee</span>
                            <span className="font-medium text-slate-900">{donation.currency} {donation.fee}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-slate-500">Transaction Hash</span>
                            <a href="#" className="flex items-center gap-1 text-primary hover:underline font-mono text-sm">
                                {donation.txHash} <ExternalLink className="w-3 h-3" />
                            </a>
                        </div>
                    </div>

                    <div className="mt-8 grid grid-cols-2 gap-4">
                        <button className="flex items-center justify-center gap-2 px-4 py-3 border border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-slate-50 transition-colors">
                            <Download className="w-4 h-4" /> Receipt
                        </button>
                        <button className="flex items-center justify-center gap-2 px-4 py-3 bg-primary hover:bg-primary-hover text-white rounded-xl font-bold shadow-lg shadow-primary/20 transition-all">
                            <Share2 className="w-4 h-4" /> Share
                        </button>
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-slate-50 p-4 text-center">
                    <p className="text-xs text-slate-400">
                        This transaction is immutable and recorded on the Cardano blockchain.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default DonationDetails;
