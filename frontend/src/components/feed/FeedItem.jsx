import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, CheckCircle, Clock } from 'lucide-react';

const FeedItem = ({ donation, index }) => {
    const { donor, amount, currency, ngo, message, status, txHash, timestamp, avatar } = donation;
    const isConfirmed = status === 'confirmed';

    return (
        <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, type: "spring", stiffness: 120 }}
            className="
                relative p-5 rounded-2xl cursor-pointer
                bg-white/20 backdrop-blur-2xl
                border border-white/40 shadow-glass
                transition-all duration-300
                hover:shadow-glassDeep hover:-translate-y-1.5
                overflow-hidden
            "
        >

            {/* Shine sweep effect */}
            <div className="
                absolute inset-0 opacity-0 group-hover:opacity-40
                bg-gradient-to-r from-transparent via-white/40 to-transparent
                animate-shine pointer-events-none
            " />

            <div className="flex items-start gap-4 relative z-10">

                {/* Avatar */}
                <div
                    className={`
                        w-12 h-12 rounded-full flex items-center justify-center
                        font-bold text-white shadow-lg
                        backdrop-blur-xl
                        ${isConfirmed
                            ? "bg-gradient-to-br from-primary to-indigo-600"
                            : "bg-amber-400"
                        }
                    `}
                >
                    {avatar || donor.charAt(0)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-[0]">

                    <div className="flex justify-between items-start">
                        {/* Donor & NGO */}
                        <div>
                            <h4 className="font-bold text-slate-900 text-sm">
                                {donor}{" "}
                                <span className="font-normal text-slate-500">donated</span>
                            </h4>
                            <p className="text-xs text-slate-600 mt-0.5">
                                to <span className="font-semibold text-primary">{ngo}</span>
                            </p>
                        </div>

                        {/* Amount */}
                        <div className="text-right">
                            <span className="block text-lg font-extrabold text-emerald-600 drop-shadow-sm">
                                {currency} {amount.toLocaleString()}
                            </span>
                            <span className="text-[10px] text-slate-400">{timestamp}</span>
                        </div>
                    </div>

                    {/* Message (glass) */}
                    {message && (
                        <div
                            className="
                                mt-3 px-3 py-2 rounded-xl text-xs italic
                                bg-white/30 backdrop-blur-md border border-white/40
                                text-slate-700 shadow-inner
                            "
                        >
                            “{message}”
                        </div>
                    )}

                    {/* Footer */}
                    <div className="mt-3 flex items-center justify-between">

                        {/* Status */}
                        <div
                            className={`
                                flex items-center gap-2 px-2.5 py-1 rounded-full text-[11px] font-medium
                                ${isConfirmed
                                    ? "bg-emerald-100 text-emerald-700 border border-emerald-300/50"
                                    : "bg-amber-100 text-amber-700 border border-amber-300/50"
                                }
                            `}
                        >
                            {isConfirmed ? (
                                <>
                                    <CheckCircle className="w-3 h-3" /> Confirmed
                                </>
                            ) : (
                                <>
                                    <Clock className="w-3 h-3 animate-spin-slow" /> Pending
                                </>
                            )}
                        </div>

                        {/* Blockchain Link */}
                        <a
                            href={`https://cardanoscan.io/transaction/${txHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="
                                flex items-center gap-1 text-[11px] text-slate-500
                                hover:text-primary transition-colors
                            "
                        >
                            View on chain <ExternalLink className="w-3 h-3" />
                        </a>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default FeedItem;
