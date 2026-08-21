import React, { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { Image, Calendar, Target, Type, Save, Eye } from 'lucide-react';

const CreateCampaign = () => {
    const [preview, setPreview] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        goal: '',
        duration: '30',
        image: '',
        category: 'Education'
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Create New Campaign</h1>
                    <p className="text-slate-500">Launch a fundraising campaign on the blockchain.</p>
                </div>
                <button
                    onClick={() => setPreview(!preview)}
                    className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-slate-600 font-medium hover:bg-slate-50 transition-colors"
                >
                    <Eye className="w-4 h-4" /> {preview ? 'Edit Mode' : 'Preview'}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Form Section */}
                <div className={`space-y-6 ${preview ? 'hidden lg:block opacity-50 pointer-events-none' : ''}`}>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Campaign Title</label>
                            <div className="relative">
                                <Type className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="e.g., Clean Water for Village X"
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="5"
                                placeholder="Tell your story..."
                                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Goal Amount (₳)</label>
                                <div className="relative">
                                    <Target className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                    <input
                                        type="number"
                                        name="goal"
                                        value={formData.goal}
                                        onChange={handleChange}
                                        placeholder="5000"
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Duration (Days)</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                    <select
                                        name="duration"
                                        value={formData.duration}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none"
                                    >
                                        <option value="15">15 Days</option>
                                        <option value="30">30 Days</option>
                                        <option value="60">60 Days</option>
                                        <option value="90">90 Days</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Cover Image URL</label>
                            <div className="relative">
                                <Image className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                <input
                                    type="url"
                                    name="image"
                                    value={formData.image}
                                    onChange={handleChange}
                                    placeholder="https://..."
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    <button className="w-full py-4 bg-primary hover:bg-primary-hover text-white font-bold rounded-xl shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2">
                        <Save className="w-5 h-5" /> Publish Campaign
                    </button>
                </div>

                {/* Preview Section */}
                <div className={`sticky top-24 h-fit ${!preview ? 'hidden lg:block' : ''}`}>
                    <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-slate-100">
                        <div className="h-48 bg-slate-200 relative">
                            {formData.image ? (
                                <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                                    <Image className="w-12 h-12 opacity-50" />
                                </div>
                            )}
                            <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full">
                                {formData.category}
                            </div>
                        </div>
                        <div className="p-6">
                            <h3 className="text-xl font-bold text-slate-900 mb-2">
                                {formData.title || 'Campaign Title'}
                            </h3>
                            <p className="text-slate-500 text-sm mb-4 line-clamp-3">
                                {formData.description || 'Campaign description will appear here...'}
                            </p>

                            <div className="space-y-2 mb-4">
                                <div className="flex justify-between text-sm font-medium">
                                    <span className="text-slate-900">₳ 0 raised</span>
                                    <span className="text-slate-500">of ₳ {formData.goal || '0'}</span>
                                </div>
                                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-primary w-0"></div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs">
                                        NGO
                                    </div>
                                    <span className="text-sm font-medium text-slate-700">Your Org</span>
                                </div>
                                <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                                    <Calendar className="w-3 h-3" /> {formData.duration} days left
                                </span>
                            </div>
                        </div>
                    </div>
                    <p className="text-center text-xs text-slate-400 mt-4">
                        This is how your campaign will appear to donors.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CreateCampaign;
