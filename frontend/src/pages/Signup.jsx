import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, Heart, Building2 } from 'lucide-react';
import ParallaxBackground from '../components/common/ParallaxBackground';

const Signup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("donor");

  // Autofill Fix — SAME AS LOGIN
  useEffect(() => {
    const css = `
      input:-webkit-autofill,
      input:-webkit-autofill:hover,
      input:-webkit-autofill:focus {
        -webkit-text-fill-color: #0f172a !important;
        -webkit-box-shadow: 0 0 0px 1000px rgba(255,255,255,0.6) inset !important;
        box-shadow: 0 0 0px 1000px rgba(255,255,255,0.6) inset !important;
        transition: background-color 5000s ease-in-out 0s !important;
      }
    `;
    const style = document.createElement("style");
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const handleSignup = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate("/explore");
    }, 1200);
  };

  return (
    <ParallaxBackground>
      <div
        className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden"
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
        }}
      >

        {/* Noise layer */}
        <div
          className="pointer-events-none absolute inset-0 opacity-30 mix-blend-soft-light"
          style={{
            background: "url('https://grainy-gradients.vercel.app/noise.png')",
            backgroundSize: "300px",
          }}
        />

        {/* Blobs */}
        <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
          <div className="absolute -left-40 top-10 w-[560px] h-[560px] rounded-full bg-[#bcd8f1] opacity-50 blur-3xl" />
          <div className="absolute right-0 bottom-[-120px] w-[640px] h-[640px] rounded-full bg-[#a7cee9] opacity-40 blur-3xl" />
        </div>

        {/* GLASS SIGNUP CARD */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          whileHover={{
            scale: 1.01,
            y: -2,
            boxShadow: "0 22px 60px rgba(0,0,0,0.18)",
          }}
          transition={{
            duration: 0.10,
            ease: "easeOut",
          }}
          className="
            w-full max-w-md rounded-3xl relative overflow-hidden
            backdrop-blur-2xl bg-white/15 border border-white/30
            shadow-[0_8px_40px_rgba(0,0,0,0.12)]
          "
        >
          <div className="p-10 relative z-10">

            {/* TITLE */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-extrabold text-slate-900">
                Create Account
              </h2>
              <p className="text-slate-600 mt-2">
                Join the transparent donation movement
              </p>
            </div>

            {/* ROLE SELECTOR */} 
            <div className="grid grid-cols-2 gap-4 mb-8">
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => setRole("donor")}
                className={`
                  p-4 rounded-xl border flex flex-col items-center gap-2
                  backdrop-blur-xl transition-all
                  ${
                    role === "donor"
                      ? "bg-primary/20 border-primary text-primary shadow-md shadow-primary/30"
                      : "bg-white/20 border-white/30 text-slate-600 hover:bg-white/30"
                  }
                `}
              >
                <Heart className="w-6 h-6" />
                <span className="font-bold text-sm">Donor</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => setRole("ngo")}
                className={`
                  p-4 rounded-xl border flex flex-col items-center gap-2
                  backdrop-blur-xl transition-all
                  ${
                    role === "ngo"
                      ? "bg-primary/20 border-primary text-primary shadow-md shadow-primary/30"
                      : "bg-white/20 border-white/30 text-slate-600 hover:bg-white/30"
                  }
                `}
              >
                <Building2 className="w-6 h-6" />
                <span className="font-bold text-sm">NGO</span>
              </motion.button>
            </div>

            {/* FORM */}
            <form onSubmit={handleSignup} className="space-y-6">

              {/* Full Name */}
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 z-20 text-slate-700 w-5 h-5" />

                <input
                  required
                  type="text"
                  autoComplete="off"
                  className="
                    peer w-full pl-14 pr-4 py-3.5 bg-white/60
                    border border-slate-300 rounded-xl text-slate-900
                    backdrop-blur-xl shadow-inner
                    focus:ring-2 focus:ring-primary/40 focus:border-primary
                    transition-all
                  "
                />

                <label
                  className="
                    absolute left-14 top-1/2 -translate-y-1/2 text-slate-500
                    pointer-events-none transition-all
                    group-focus-within:opacity-0 group-focus-within:translate-y-2
                    peer-valid:opacity-0 peer-valid:translate-y-2
                  "
                >
                  Full Name
                </label>
              </div>

              {/* Email */}
<div className="relative group">
  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 z-20 text-slate-700 w-5 h-5" />

  <input
    required
    type="email"
    autoComplete="email"
    placeholder=""
    className="
      peer w-full pl-14 pr-4 py-3.5 
      bg-white/60 border border-slate-300 
      rounded-3xl text-slate-900 shadow-inner 
      backdrop-blur-xl
      focus:ring-2 focus:ring-primary/40 
      focus:border-primary transition-all
    "
    style={{ WebkitTextFillColor: "#0f172a" }}
  />

  <label
    className="
      absolute left-14 top-1/2 -translate-y-1/2 text-slate-500
      pointer-events-none transition-all
      group-focus-within:opacity-0 group-focus-within:translate-y-2
      peer-valid:opacity-0 peer-valid:translate-y-2
    "
  >
    Email Address
  </label>
</div>

              {/* Password */}
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 z-20 text-slate-700 w-5 h-5" />

                <input
                  required
                  type="password"
                  autoComplete="off"
                  className="
                    peer w-full pl-14 pr-4 py-3.5 bg-white/60
                    border border-slate-300 rounded-xl text-slate-900
                    backdrop-blur-xl shadow-inner
                    focus:ring-2 focus:ring-primary/40 focus:border-primary
                    transition-all
                  "
                />

                <label
                  className="
                    absolute left-14 top-1/2 -translate-y-1/2 text-slate-500
                    transition-all pointer-events-none
                    group-focus-within:opacity-0 group-focus-within:translate-y-2
                    peer-valid:opacity-0 peer-valid:translate-y-2
                  "
                >
                  Password
                </label>
              </div>

              {/* SIGNUP BUTTON */}
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                disabled={loading}
                className="
                  w-full py-3.5 bg-primary text-white font-bold rounded-xl
                  shadow-xl shadow-primary/30 hover:bg-primary-hover
                  flex items-center justify-center gap-2 transition-all
                "
              >
                {loading ? (
                  <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>Create Account <ArrowRight className="w-5 h-5" /></>
                )}
              </motion.button>
            </form>

            {/* Divider */}
            <div className="my-8 relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/40"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-white/40 backdrop-blur-xl text-slate-600">
                  Or continue with
                </span>
              </div>
            </div>

            {/* GOOGLE SIGNUP BUTTON */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="
                w-full flex items-center gap-2 px-10 py-3
                bg-white/50 backdrop-blur-xl border border-white/50
                rounded-3xl shadow-[0_8px_20px_rgba(0,0,0,0.06)]
                transition-all hover:bg-white/70
              "
            >
              <img
                src="public/google.png"
                className="w-8 h-8"
                alt="Google"
              />
              <span className="font-semibold text-slate-800">
                Create account using Google
              </span>
            </motion.button>

            {/* Footer */}
            <p className="mt-8 text-center text-sm text-slate-700">
              Already have an account?{" "}
              <Link to="/login" className="font-bold text-primary hover:underline">
                Sign in
              </Link>
            </p>

          </div>
        </motion.div>
      </div>
    </ParallaxBackground>
  );
};

export default Signup;
