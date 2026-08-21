import React, { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { FileText, Search, Filter, ExternalLink, Box, ArrowRightLeft, CheckCircle } from 'lucide-react';

const AuditTrail = () => {
    const [searchTerm, setSearchTerm] = useState('');

    // Mock Audit Data
    const transactions = [
        {
            id: 'tx_1',
            hash: '0x8f2...3a1',
            type: 'Donation',
            from: 'Anonymous',
            to: 'Clean Water Initiative',
            amount: '₳ 500',
            timestamp: '2023-10-24 14:30:00',
            block: 9482103,
            status: 'Confirmed',
            metadata: {
                campaignId: 'cmp_123',
                message: 'For the kids',
            }
        },
        {
            id: 'tx_2',
            hash: '0x7b1...9c2',
            type: 'Disbursement',
            from: 'Clean Water Initiative',
            to: 'Supplier: AquaTech',
            amount: '₳ 2,000',
            timestamp: '2023-10-23 09:15:00',
            block: 9481500,
            status: 'Confirmed',
            metadata: {
                invoiceId: 'inv_999',
                item: 'Water Filters x50',
            }
        },
        {
            id: 'tx_3',
            hash: '0x3c4...5d6',
            type: 'Proof Upload',
            from: 'Save the Rainforest',
            to: 'IPFS',
            amount: '-',
            timestamp: '2023-10-22 16:45:00',
            block: 9480123,
            status: 'Confirmed',
            metadata: {
                cid: 'QmXyZ...abc',
                fileType: 'image/jpeg',
                description: 'Tree planting verification',
            }
        },
    ];

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Audit Trail</h1>
                <p className="text-slate-500">Immutable record of all transactions and activities on the platform.</p>
            </div>

            {/* Search & Filter */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search by transaction hash, block, or entity..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                </div>
                <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-xl font-medium hover:bg-slate-50 transition-colors">
                    <Filter className="w-5 h-5 text-slate-500" /> Filters
                </button>
            </div>

            {/* Transactions List */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="divide-y divide-slate-100">
                    {transactions.map((tx, index) => (
                        <motion.div
                            key={tx.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="p-6 hover:bg-slate-50 transition-colors group"
                        >
                            <div className="flex flex-col lg:flex-row gap-6">

                                {/* Icon & Basic Info */}
                                <div className="flex items-start gap-4 lg:w-1/4">
                                    <div className={`
                    w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0
                    ${tx.type === 'Donation' ? 'bg-emerald-100 text-emerald-600' :
                                            tx.type === 'Disbursement' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'}
                  `}>
                                        {tx.type === 'Donation' && <ArrowRightLeft className="w-6 h-6" />}
                                        {tx.type === 'Disbursement' && <Box className="w-6 h-6" />}
                                        {tx.type === 'Proof Upload' && <FileText className="w-6 h-6" />}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900">{tx.type}</h3>
                                        <p className="text-xs text-slate-500 font-mono mt-1">{tx.timestamp}</p>
                                        <div className="flex items-center gap-1 mt-2">
                                            <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs font-bold flex items-center gap-1">
                                                <Box className="w-3 h-3" /> {tx.block}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Flow Details */}
                                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-xs text-slate-400 uppercase font-bold mb-1">From</p>
                                        <p className="font-medium text-slate-800">{tx.from}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-400 uppercase font-bold mb-1">To</p>
                                        <p className="font-medium text-slate-800">{tx.to}</p>
                                    </div>
                                    <div className="md:col-span-2 bg-slate-50 p-3 rounded-lg border border-slate-100">
                                        <p className="text-xs text-slate-400 uppercase font-bold mb-1">Metadata</p>
                                        <pre className="text-xs text-slate-600 font-mono overflow-x-auto">
                                            {JSON.stringify(tx.metadata, null, 2)}
                                        </pre>
                                    </div>
                                </div>

                                {/* Status & Action */}
                                <div className="lg:w-1/6 flex flex-col items-end justify-between gap-4">
                                    <div className="text-right">
                                        <p className="text-xl font-bold text-slate-900">{tx.amount}</p>
                                        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full mt-1">
                                            <CheckCircle className="w-3 h-3" /> {tx.status}
                                        </span>
                                    </div>
                                    <a
                                        href={`https://cardanoscan.io/transaction/${tx.hash}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm text-primary font-medium hover:underline flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        View on Chain <ExternalLink className="w-3 h-3" />
                                    </a>
                                </div>

                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AuditTrail;
