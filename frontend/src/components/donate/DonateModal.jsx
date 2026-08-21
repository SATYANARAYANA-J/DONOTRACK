import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Wallet, ArrowRight, Check, Shield, AlertCircle, Download, ExternalLink, ChevronLeft } from 'lucide-react';
import { useDonate } from '../../context/DonateContext';

const STEPS = {
    AMOUNT: 0,
    WALLET: 1,
    CONFIRM: 2,
    SUCCESS: 3,
};

const DonateModal = () => {
    const { isOpen, closeDonate, initialData } = useDonate();
    const [step, setStep] = useState(STEPS.AMOUNT);
    const [amount, setAmount] = useState(50);
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [isWalletConnected, setIsWalletConnected] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    // Reset state when opening
    useEffect(() => {
        if (isOpen) {
            setStep(STEPS.AMOUNT);
            setAmount(initialData?.amount || 50);
            setIsWalletConnected(false);
            setIsProcessing(false);
        }
    }, [isOpen, initialData]);

    if (!isOpen) return null;

    const handleNext = () => {
        if (step === STEPS.WALLET && !isWalletConnected) return;
        setStep((prev) => prev + 1);
    };

    const handleBack = () => {
        setStep((prev) => prev - 1);
    };

    const handleConnect = () => {
        setIsProcessing(true);
        setTimeout(() => {
            setIsWalletConnected(true);
            setIsProcessing(false);
            handleNext();
        }, 1500);
    };

    const handleDonate = () => {
        setIsProcessing(true);
        setTimeout(() => {
            setIsProcessing(false);
            setStep(STEPS.SUCCESS);
        }, 2000);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeDonate}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden"
                    >
                        {/* Header */}
                        <div className="flex justify-between items-center p-6 border-b border-slate-100">
                            <div className="flex items-center gap-2">
                                {step > STEPS.AMOUNT && step < STEPS.SUCCESS && (
                                    <button onClick={handleBack} className="p-1 hover:bg-slate-100 rounded-full mr-1">
                                        <ChevronLeft className="w-5 h-5 text-slate-500" />
                                    </button>
                                )}
                                <h2 className="text-xl font-bold text-slate-800">
                                    {step === STEPS.AMOUNT && "Select Amount"}
                                    {step === STEPS.WALLET && "Connect Wallet"}
                                    {step === STEPS.CONFIRM && "Confirm Donation"}
                                    {step === STEPS.SUCCESS && "Donation Sent!"}
                                </h2>
                            </div>
                            <button onClick={closeDonate} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                                <X className="w-5 h-5 text-slate-500" />
                            </button>
                        </div>

                        {/* Progress Bar */}
                        {step < STEPS.SUCCESS && (
                            <div className="w-full h-1 bg-slate-100">
                                <div
                                    className="h-full bg-primary transition-all duration-300"
                                    style={{ width: `${((step + 1) / 3) * 100}%` }}
                                />
                            </div>
                        )}

                        {/* Content */}
                        <div className="p-6 min-h-[300px]">
                            <AnimatePresence mode="wait">
                                {step === STEPS.AMOUNT && (
                                    <motion.div
                                        key="amount"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="space-y-6"
                                    >
                                        <div className="text-center mb-8">
                                            <p className="text-slate-500 mb-2">You are donating to</p>
                                            <h3 className="text-xl font-bold text-primary">{initialData?.campaignTitle || "General Fund"}</h3>
                                        </div>

                                        <div className="grid grid-cols-3 gap-3">
                                            {[10, 50, 100, 250, 500].map((val) => (
                                                <button
                                                    key={val}
                                                    onClick={() => setAmount(val)}
                                                    className={`
                            py-3 rounded-xl font-bold transition-all
                            ${amount === val
                                                            ? 'bg-primary text-white shadow-lg shadow-primary/30 scale-105'
                                                            : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                                                        }
                          `}
                                                >
                                                    ₳ {val}
                                                </button>
                                            ))}
                                            <div className="relative">
                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₳</span>
                                                <input
                                                    type="number"
                                                    value={amount}
                                                    onChange={(e) => setAmount(Number(e.target.value))}
                                                    className="w-full h-full pl-8 pr-4 bg-slate-50 rounded-xl font-bold text-slate-800 focus:ring-2 focus:ring-primary/20 focus:outline-none"
                                                />
                                            </div>
                                        </div>

                                        <button
                                            onClick={handleNext}
                                            className="w-full py-4 bg-primary hover:bg-primary-hover text-white font-bold rounded-xl shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2"
                                        >
                                            Continue <ArrowRight className="w-5 h-5" />
                                        </button>
                                    </motion.div>
                                )}

                                {step === STEPS.WALLET && (
                                    <motion.div
                                        key="wallet"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="space-y-4"
                                    >
                                        <p className="text-slate-600 text-center mb-6">Select a wallet to connect</p>

                                        {['Nami', 'Eternl', 'Flint', 'GeroWallet'].map((wallet) => (
                                            <button
                                                key={wallet}
                                                onClick={handleConnect}
                                                disabled={isProcessing}
                                                className="w-full p-4 flex items-center justify-between bg-white border border-slate-200 rounded-xl hover:border-primary hover:shadow-md transition-all group"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                                                        <Wallet className="w-5 h-5 text-slate-500 group-hover:text-primary" />
                                                    </div>
                                                    <span className="font-bold text-slate-800">{wallet}</span>
                                                </div>
                                                {isProcessing ? (
                                                    <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                                ) : (
                                                    <div className="w-2 h-2 bg-slate-300 rounded-full group-hover:bg-primary" />
                                                )}
                                            </button>
                                        ))}
                                    </motion.div>
                                )}

                                {step === STEPS.CONFIRM && (
                                    <motion.div
                                        key="confirm"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="space-y-6"
                                    >
                                        <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 space-y-4">
                                            <div className="flex justify-between items-center">
                                                <span className="text-slate-500">Amount</span>
                                                <span className="text-xl font-bold text-slate-900">₳ {amount}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-slate-500">Network Fee</span>
                                                <span className="text-sm font-medium text-slate-900">~ ₳ 0.17</span>
                                            </div>
                                            <div className="h-px bg-slate-200" />
                                            <div className="flex justify-between items-center">
                                                <span className="font-bold text-slate-800">Total</span>
                                                <span className="text-2xl font-bold text-primary">₳ {amount + 0.17}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-slate-100 rounded-lg">
                                                    <Shield className="w-5 h-5 text-slate-600" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-800">Donate Anonymously</p>
                                                    <p className="text-xs text-slate-500">Hide your identity on the feed</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => setIsAnonymous(!isAnonymous)}
                                                className={`
                          w-12 h-6 rounded-full transition-colors relative
                          ${isAnonymous ? 'bg-primary' : 'bg-slate-200'}
                        `}
                                            >
                                                <div className={`
                          absolute top-1 w-4 h-4 bg-white rounded-full transition-transform
                          ${isAnonymous ? 'left-7' : 'left-1'}
                        `} />
                                            </button>
                                        </div>

                                        <button
                                            onClick={handleDonate}
                                            disabled={isProcessing}
                                            className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-900/20 transition-all flex items-center justify-center gap-2"
                                        >
                                            {isProcessing ? (
                                                <>Processing <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /></>
                                            ) : (
                                                <>Confirm Donation <Check className="w-5 h-5" /></>
                                            )}
                                        </button>
                                    </motion.div>
                                )}

                                {step === STEPS.SUCCESS && (
                                    <motion.div
                                        key="success"
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="text-center py-8"
                                    >
                                        <div className="w-20 h-20 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                            <Check className="w-10 h-10" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-slate-900 mb-2">Thank You!</h3>
                                        <p className="text-slate-500 mb-8">Your donation has been recorded on the blockchain.</p>

                                        <div className="flex flex-col gap-3">
                                            <button className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors flex items-center justify-center gap-2">
                                                <Download className="w-4 h-4" /> Download Receipt
                                            </button>
                                            <button className="w-full py-3 border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
                                                View on Explorer <ExternalLink className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default DonateModal;
