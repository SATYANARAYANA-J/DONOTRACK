import React, { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { Upload, File, X, Check, AlertCircle } from 'lucide-react';

const UploadProof = () => {
    const [dragActive, setDragActive] = useState(false);
    const [files, setFiles] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFiles(e.dataTransfer.files);
        }
    };

    const handleChange = (e) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleFiles(e.target.files);
        }
    };

    const handleFiles = (fileList) => {
        setFiles([...files, ...Array.from(fileList)]);
    };

    const removeFile = (index) => {
        const newFiles = [...files];
        newFiles.splice(index, 1);
        setFiles(newFiles);
    };

    const handleUpload = () => {
        setUploading(true);
        // Simulate upload
        setTimeout(() => {
            setUploading(false);
            setSuccess(true);
            setFiles([]);
            setTimeout(() => setSuccess(false), 3000);
        }, 2000);
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Upload Proof of Impact</h1>
                <p className="text-slate-500">Upload invoices, photos, or reports to verify your campaign activities on-chain.</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-8">
                {/* Drag & Drop Zone */}
                <div
                    className={`
            relative border-2 border-dashed rounded-xl p-10 text-center transition-all
            ${dragActive ? 'border-primary bg-primary/5' : 'border-slate-200 hover:border-primary/50'}
          `}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                >
                    <input
                        type="file"
                        multiple
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={handleChange}
                    />

                    <div className="flex flex-col items-center gap-4 pointer-events-none">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-400">
                            <Upload className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="text-lg font-bold text-slate-700">Click to upload or drag and drop</p>
                            <p className="text-sm text-slate-500 mt-1">PDF, JPG, PNG (max 10MB)</p>
                        </div>
                    </div>
                </div>

                {/* File List */}
                {files.length > 0 && (
                    <div className="mt-8 space-y-3">
                        <h3 className="font-bold text-slate-900">Selected Files</h3>
                        {files.map((file, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white rounded-lg border border-slate-100">
                                        <File className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-900">{file.name}</p>
                                        <p className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => removeFile(index)}
                                    className="p-1 hover:bg-slate-200 rounded-full text-slate-400 hover:text-rose-500 transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Metadata Form */}
                <div className="mt-8 space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Description</label>
                        <textarea
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            rows="3"
                            placeholder="Describe what these files prove..."
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Related Campaign</label>
                        <select className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all">
                            <option>Select a campaign...</option>
                            <option>Clean Water for All</option>
                            <option>School Supplies 2024</option>
                        </select>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="mt-8">
                    <button
                        onClick={handleUpload}
                        disabled={files.length === 0 || uploading}
                        className={`
              w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2
              ${success
                                ? 'bg-emerald-500 shadow-emerald-900/20'
                                : files.length === 0
                                    ? 'bg-slate-300 cursor-not-allowed'
                                    : 'bg-primary hover:bg-primary-hover shadow-primary/20'
                            }
            `}
                    >
                        {uploading ? (
                            <>Uploading <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /></>
                        ) : success ? (
                            <>Upload Complete <Check className="w-5 h-5" /></>
                        ) : (
                            <>Upload to IPFS & Verify <Upload className="w-5 h-5" /></>
                        )}
                    </button>
                </div>

            </div>
        </div>
    );
};

export default UploadProof;
