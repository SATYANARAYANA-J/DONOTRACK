import React from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

const MetricCard = ({ label, value, subtext, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay }}
        className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 text-center"
    >
        <h3 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-1">{value}</h3>
        <p className="text-sm font-medium text-slate-500 uppercase tracking-wide mb-2">{label}</p>
        <p className="text-xs text-emerald-600 font-medium bg-emerald-50 inline-block px-2 py-1 rounded-full">
            {subtext}
        </p>
    </motion.div>
);

const Metrics = () => {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
            <MetricCard
                label="Total Donated"
                value="₳ 1.2M+"
                subtext="▲ 12% this month"
                delay={0}
            />
            <MetricCard
                label="Active Campaigns"
                value="142"
                subtext="Across 12 countries"
                delay={0.1}
            />
            <MetricCard
                label="Avg Confirmation"
                value="24s"
                subtext="Lightning fast"
                delay={0.2}
            />
        </div>
    );
};

export default Metrics;
