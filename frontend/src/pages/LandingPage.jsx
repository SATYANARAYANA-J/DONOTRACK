import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Link } from 'react-router-dom';
import {
    ShieldCheck, Globe, Search, Wallet, FileText,
    Database, CheckCircle, ArrowRight
} from 'lucide-react';
import { motion, useScroll, useTransform } from "framer-motion";
import AOS from "aos";
import "aos/dist/aos.css";

const LandingPage = () => {
    const [backendStatus, setBackendStatus] = useState('checking');

    useEffect(() => {
        const checkBackend = async () => {
            try {
                const response = await api.get('/');
                console.log('Backend response:', response.data);
                setBackendStatus('connected');
            } catch (error) {
                console.error('Backend error:', error);
                setBackendStatus('disconnected');
            }
        };
        checkBackend();
    }, []);


    useEffect(() => {
        AOS.init({
            duration: 900,
            easing: "ease-out-cubic",
            once: true,
        });
    }, []);
    const { scrollYProgress } = useScroll();
    return (

        <div
            className="min-h-screen text-slate-900 font-sans relative overflow-hidden"
            style={{
                background: `
      radial-gradient(60% 45% at 25% 20%, #F9FDFF 0%, #BDE8FF 35%, transparent 70%),
      radial-gradient(50% 40% at 80% 15%, #8CD6FF 0%, transparent 75%),
      radial-gradient(55% 50% at 70% 55%, #BDE8FF 0%, transparent 70%),
      radial-gradient(60% 50% at 50% 90%, #4DA6FF 0%, transparent 70%),
      radial-gradient(70% 55% at 10% 85%, #0060DE 0%, transparent 80%),
      radial-gradient(80% 60% at 50% 0%, #0C3B97 0%, transparent 85%)
    `,
                backgroundColor: "#BDE8FF",
                backgroundBlendMode: "normal"
            }}
        >


            <div className="pointer-events-none absolute inset-0 opacity-30 mix-blend-soft-light"
                style={{
                    background: "url('https://grainy-gradients.vercel.app/noise.png')",
                    backgroundSize: "300px"
                }}>
            </div>

            {/* BG blobs */}
            <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
                <div className="absolute -left-40 top-10 w-[560px] h-[560px] rounded-full bg-[#bcd8f1] opacity-50 blur-3xl" />
                <div className="absolute right-0 bottom-[-120px] w-[640px] h-[640px] rounded-full bg-[#a7cee9] opacity-40 blur-3xl" />
            </div>
            {/* NAV WRAPPER — Prevent AOS Animation */}
            {/* FIXED NAVBAR – ORIGINAL DESIGN RESTORED */}
            {/* FIXED NAVBAR – ORIGINAL DESIGN RESTORED */}
            <nav
                className="
    fixed top-4 left-1/2 -translate-x-1/2
    bg-white/10 backdrop-blur-[100px]
    border border-white/30 rounded-[40px]
    shadow-[0_8px_30px_rgba(0,0,0,0.08)]
    w-[92%] max-w-6xl
    px-8 py-4
    flex items-center justify-between
    z-[9999]
  "
                style={{
                    position: "fixed",
                    transform: "translate(-50%, 0)",
                    animation: "none",
                }}
            >

                {/* LEFT — LOGO */}
                <div className="flex items-center gap-3" style={{ animation: "none" }}>

                    {/* YOUR LOGO IMAGE */}
                    <img
                        src="src/assets/logo.gif"
                        alt="Dono Logo"
                        className="w-8 h-8 rounded-lg object-cover scale-150"
                        style={{ transformOrigin: "left center" }}
                    />


                    {/* TEXT */}
                    <span className="text-lg font-semibold">Dono</span>

                </div>


                {/* CENTER — NAV LINKS */}
                <div
                    className="hidden md:flex items-center gap-10"
                    style={{
                        position: "absolute",
                        left: "50%",
                        transform: "translateX(-50%)",
                        animation: "none",
                    }}
                >

                    {/* HOME (scroll to top) */}
                    <Link
                        to="/"
                        onClick={(e) => {
                            e.preventDefault();
                            window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className="text-slate-700 font-medium hover:text-slate-900 transition"
                    >
                        Home
                    </Link>

                    {/* ABOUT (scroll to section 3) */}
                    <Link
                        to="/about"
                        onClick={(e) => {
                            e.preventDefault();
                            const aboutSection = document.getElementById("about-section");
                            if (aboutSection) {
                                aboutSection.scrollIntoView({ behavior: "smooth" });
                            }
                        }}
                        className="text-slate-700 font-medium hover:text-slate-900 transition"
                    >
                        About
                    </Link>

                    {/* BLOG (scroll to section 4) */}
                    <Link
                        to="/blog"
                        onClick={(e) => {
                            e.preventDefault();
                            const blogSection = document.getElementById("blog-section");
                            if (blogSection) {
                                blogSection.scrollIntoView({ behavior: "smooth" });
                            }
                        }}
                        className="text-slate-700 font-medium hover:text-slate-900 transition"
                    >
                        Blog
                    </Link>

                </div>

                {/* RIGHT — LOGIN + GET STARTED */}
                <div className="flex items-center gap-4" style={{ animation: "none" }}>
                    <Link
                        to="/login"
                        className="hidden md:block text-slate-700 font-medium hover:text-slate-900 transition"
                    >
                        Login
                    </Link>

                    <Link
                        to="/signup"
                        className="
        px-4 py-2 rounded-lg font-semibold text-white
        bg-gradient-to-r from-[#6554f0] to-[#6d28d9]
        shadow-[0_12px_30px_rgba(101,81,240,0.18)]
        hover:translate-y-[-1px] transition
      "
                    >
                        Get Started
                    </Link>
                </div>

            </nav>


            {/* HERO */}
            <header className="relative pt-[140px] pb-28">
                <div className="w-full flex flex-col items-center justify-center px-0 relative">

                    {/* HERO HEADING */}
                    <div className="text-center" data-aos="fade-up" data-aos-anchor-placement="top-bottom">
                        <h1 className="text-4xl md:text-6xl lg:text-5xl font-extrabold text-slate-900 -mt-5 leading-tight">
                            Transparent Blockchain <br />
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#4338ca] to-[#7c3aed]">
                                Donation Platform
                            </span>
                        </h1>

                        <p
                            className="text-xs mt-2 md:text-sm text-slate-600 mb-6 max-w-2xl mx-auto opacity-70 tracking-wide"
                            data-aos="fade-up"
                            data-aos-delay="8000"
                            data-aos-anchor-placement="top-bottom"
                        >
                            See where your money goes. Verify every transaction. <br />
                            Full transparency powered by <strong>Cardano</strong>.
                        </p>

                        {/* BUTTONS */}
                        <div
                            className="-mt-1 mb-0 flex flex-col sm:flex-row items-center justify-center gap-4"
                            data-aos="zoom-in"
                            data-aos-delay="8000"
                            data-aos-anchor-placement="top-bottom"
                        >
                            <Link
                                to="/signup"
                                className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl text-white font-bold bg-gradient-to-r from-[#6d28d9] to-[#4338ca] hover:-translate-y-1 transition"
                            >
                                Start Donating <ArrowRight className="w-5 h-5" />
                            </Link>

                            <Link
                                to="/login"
                                className="px-8 py-4 rounded-2xl bg-white/50 backdrop-blur-xl border border-white/30 text-slate-800 font-semibold hover:scale-[1.02] transition"
                            >
                                NGO Login
                            </Link>
                        </div>
                    </div>

                    {/* ============================ 7 CARD GRID ============================ */}
                    <div className="-mt-10 w-full overflow-visible pb-20">
                        <div className="max-w-[2000px] mx-auto px-[15px]">

                            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

                                {/* COLUMN 1 */}
                                <div className="flex flex-col gap-6">
                                    <div
                                        className="w-full h-[280px] rounded-[56px] overflow-hidden"
                                        data-aos="zoom-in"
                                        data-aos-anchor-placement="top-bottom"
                                    >
                                        <img src="src/assets/img3.jpg"
                                            className="w-full h-full object-cover hover:scale-105 duration-500" />
                                    </div>

                                    <div
                                        className="w-full h-[120px] rounded-[36px] overflow-hidden"
                                        data-aos="zoom-in"
                                        data-aos-delay="8000"
                                        data-aos-anchor-placement="top-bottom"
                                    >
                                        <img src="src/assets/img2.png"
                                            className="w-full h-full object-cover hover:scale-105 duration-500" />
                                    </div>
                                </div>

                                {/* COLUMN 2 */}
                                <div className="lg:pt-16 mt-20">
                                    <div
                                        className="w-full h-[280px] rounded-[36px] overflow-hidden"
                                        data-aos="zoom-in"
                                        data-aos-delay="8000"
                                        data-aos-anchor-placement="top-bottom"
                                    >
                                        <img src="src/assets/img1.jpg"
                                            className="w-full h-full object-cover hover:scale-105 duration-500" />
                                    </div>
                                </div>

                                {/* CENTER CARD */}
                                <div className="lg:pt-28 mt-40 flex justify-center">
                                    <div
                                        className="-mt-16 max-w-[450px] w-full h-[215px] rounded-[36px] overflow-hidden"
                                        data-aos="zoom-in"
                                        data-aos-delay="8000"
                                        data-aos-anchor-placement="top-bottom"
                                    >
                                        <img src="src/assets/img7.jpg"
                                            className="w-full h-full object-cover hover:scale-105 duration-500" />
                                    </div>
                                </div>

                                {/* COLUMN 4 */}
                                <div className="lg:pt-16 mt-20">
                                    <div
                                        className="w-full h-[280px] rounded-[36px] overflow-hidden"
                                        data-aos="zoom-in"
                                        data-aos-delay="8000"
                                        data-aos-anchor-placement="top-bottom"
                                    >
                                        <img src="src/assets/img6.jpg"
                                            className="w-full h-full object-cover hover:scale-105 duration-500" />
                                    </div>
                                </div>

                                {/* COLUMN 5 */}
                                <div className="flex flex-col gap-6">
                                    <div
                                        className="w-full h-[280px] rounded-[36px] overflow-hidden"
                                        data-aos="zoom-in"
                                        data-aos-delay="8000"
                                        data-aos-anchor-placement="top-bottom"
                                    >
                                        <img src="src/assets/img4.jpg"
                                            className="w-full h-full object-cover hover:scale-105 duration-500" />
                                    </div>

                                    <div
                                        className="w-full h-[120px] rounded-[36px] overflow-hidden"
                                        data-aos="zoom-in"
                                        data-aos-delay="8000"
                                        data-aos-anchor-placement="top-bottom"
                                    >
                                        <img src="src/assets/img.jpeg"
                                            className="w-full h-full object-cover hover:scale-105 duration-500" />
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>



                    {/* ONLY SCROLLING HAND IMAGE */}
                    <div className="relative w-full mt-[-10%] mb-20">
                        <motion.img
                            src="src/assets/hand.png"
                            className="pointer-events-none select-none h-[600px] w-[900px] md:w-[2000px] absolute top-[-60px] left-[65%] opacity-100"
                            style={{
                                x: useTransform(scrollYProgress, [0, 1], ["-200%", "100%"])
                            }}
                        />
                    </div>



                </div>
            </header>




            {/* ============================ SECTION 2 ============================ */}
            <section id="about-section" className="py-20 mt-[200px]">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                    <div data-aos="fade-right" data-aos-anchor-placement="top-bottom">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Why It Matters</h2>
                        <p className="text-slate-700 text-lg mb-6">
                            Traditional donation systems lack transparency. Donors cannot verify how funds are used.
                        </p>

                        <ul className="space-y-4">
                            {[
                                "Recording donations on-chain",
                                "Showing spending breakdowns",
                                "Publishing receipts/photos publicly",
                                "Giving donors verifiable audit trails"
                            ].map((text, i) => (
                                <li key={i} className="flex items-start gap-3"
                                    data-aos="fade-up" data-aos-delay={i * 400}>
                                    <div className="w-7 h-7 rounded-full bg-emerald-50 flex items-center justify-center mt-1">
                                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                                    </div>
                                    <span className="font-medium text-slate-700">{text}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div
                        className="rounded-[22px] p-6 bg-slate-800/80 text-white backdrop-blur-xl border border-white/10"
                        data-aos="fade-left"
                        data-aos-anchor-placement="top-bottom"
                    >
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-full bg-emerald-400 flex items-center justify-center font-bold text-white">
                                ✓
                            </div>
                            <div>
                                <h3 className="font-bold text-xl">The Solution</h3>
                                <p className="text-slate-300 text-sm">Trust through technology</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="p-4 rounded-xl bg-white/10 border border-white/20 flex justify-between">
                                <span>Transparency</span>
                                <span className="text-emerald-400 font-bold">100%</span>
                            </div>

                            <div className="p-4 rounded-xl bg-white/10 border border-white/20 flex justify-between">
                                <span>Trust</span>
                                <span className="text-emerald-400 font-bold">Verified</span>
                            </div>

                            <div className="p-4 rounded-xl bg-white/10 border border-white/20 flex justify-between">
                                <span>Impact</span>
                                <span className="text-emerald-400 font-bold">Measurable</span>
                            </div>
                        </div>
                    </div>

                </div>
            </section>


            {/* ============================ SECTION 3 ============================ */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-6">

                    <div className="text-center mb-12" data-aos="fade-up" data-aos-delay="400" data-aos-anchor-placement="top-bottom">
                        <h2 className="text-3xl font-bold">How It Works</h2>
                        <p className="text-slate-600">Simple steps to make a verified impact.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { step: "01", title: "Connect & Select", desc: "Login and choose a campaign." },
                            { step: "02", title: "Donate ADA", desc: "Send funds securely via Cardano." },
                            { step: "03", title: "Verify Impact", desc: "Track spending and proofs." }
                        ].map((item, i) => (
                            <div
                                key={i}
                                className="bg-white/40 p-8 rounded-[20px] border border-white/60 backdrop-blur-xl transition hover:-translate-y-2"
                                data-aos="fade-up"
                                data-aos-delay={i * 400}
                            >
                                <div className="w-16 h-16 mx-auto rounded-2xl bg-white border flex items-center justify-center mb-6">
                                    <span className="text-indigo-700 text-2xl font-bold">{item.step}</span>
                                </div>

                                <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                                <p className="text-slate-600">{item.desc}</p>
                            </div>
                        ))}
                    </div>

                </div>
            </section>


            {/* SECOND SCROLLING IMAGE — RIGHT TO LEFT (STOPS AT CENTER) */}
            <div className="relative w-full mt-[-10%] mb-20">
                <motion.img
                    src="src/assets/coin.png"
                    className="pointer-events-none select-none h-[500px] w-[900px] md:w-[2000px] absolute top-[-60px] right-[35%] opacity-100"
                    style={{
                        x: useTransform(
                            scrollYProgress,
                            [, 0.5, 1],           // scroll stages
                            ["500%", "150%", "50%"]   // move → stop at center
                        )
                    }}
                />
            </div>



            {/* ============================ SECTION 4 ============================ */}
            <section id="blog-section" className="py-20 ">
                <div className="max-w-7xl mx-auto px-6 mt-[100px]">

                    <div className="text-center mb-12" data-aos-delay="400" data-aos="fade-up">
                        <h2 className="text-3xl font-bold">Key Features</h2>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[
                            "Real-time tracking",
                            "Secure ADA transactions",
                            "NGO spending transparency",
                            "IPFS proof storage",
                            "Donor dashboard",
                            "NGO dashboard",
                            "Immutable audit trail",
                            "Metadata verification"
                        ].map((feature, i) => (
                            <div
                                key={i}
                                className="bg-white/40 p-5 rounded-xl backdrop-blur-xl border border-white/50 transition hover:-translate-y-2"
                                data-aos="fade-up"
                                data-aos-delay={i * 120}
                            >
                                <div className="flex items-start gap-3">
                                    <div className="w-3 h-3 bg-[#4338ca] rounded-full mt-2" />
                                    <span className="font-medium text-slate-700">{feature}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </section>



            {/* ============================ CTA ============================ */}
            <section
                className="py-10 text-center"
                data-aos-delay="400"
                data-aos="fade-up"
                data-aos-anchor-placement="top-bottom"

            >
                <div className="max-w-3xl mx-auto px-6 overflow-visible">

                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                        Ready to make a difference?
                    </h2>

                    <p className="text-slate-700 text-lg mb-6">
                        Get started by creating an account or logging in to donate with full transparency.
                    </p>

                    <Link
                        to="/signup"
                        className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-[#6d28d9] to-[#4338ca] text-white font-bold shadow-xl hover:-translate-y-1 transition"
                    >
                        Get Started Now <ArrowRight className="w-5 h-5" />
                    </Link>

                </div>
            </section>




            {/* FOOTER */}
            <footer
                className="bg-white/30 backdrop-blur-xl border-t border-white/40 py-12 "
                data-aos-delay="0"
                data-aos="fade-up"
            >
                <div className="max-w-7xl mx-auto px-6 flex flex-col justify-center items-center gap-1 h-[30px]">

                    <span className="text-lg font-semibold text-slate-900">
                        Dono Platform
                    </span>

                    <p className="text-sm text-slate-700">
                        © 2024 Dono Platform. Built on Cardano.
                    </p>

                </div>
            </footer>





            {/* Backend Status Indicator */}
            <div className={`fixed bottom-4 right-4 px-4 py-2 rounded-full text-sm font-bold shadow-lg z-[10000] ${backendStatus === 'connected' ? 'bg-green-500 text-white' :
                    backendStatus === 'disconnected' ? 'bg-red-500 text-white' :
                        'bg-yellow-500 text-black'
                }`}>
                Backend: {backendStatus.toUpperCase()}
            </div>
        </div>
    );
};

export default LandingPage;
