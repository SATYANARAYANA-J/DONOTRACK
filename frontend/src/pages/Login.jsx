import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import ParallaxBackground from '../components/common/ParallaxBackground';

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Inject autofill override CSS
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
    const style = document.createElement('style');
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    localStorage.setItem('token', 'authenticated_user');
    setTimeout(() => {
      setLoading(false);
      navigate('/explore');
    }, 800);
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
          backgroundColor: '#BDE8FF',
        }}
      >
        {/* Noise Layer */}
        <div
          className="pointer-events-none absolute inset-0 opacity-30 mix-blend-soft-light"
          style={{
            background: "url('https://grainy-gradients.vercel.app/noise.png')",
            backgroundSize: '300px',
          }}
        />

        {/* Decorative Blobs */}
        <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
          <div className="absolute -left-40 top-10 w-[560px] h-[560px] rounded-full bg-[#bcd8f1] opacity-50 blur-3xl" />
          <div className="absolute right-0 bottom-[-120px] w-[640px] h-[640px] rounded-full bg-[#a7cee9] opacity-40 blur-3xl" />
        </div>

        {/* MAIN GLASS LOGIN CARD */}
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

            {/* LOGO */}
            <div className="text-center mb-8">
              <motion.div
                whileHover={{
                  scale: 1.12,
                  y: -4,
                  boxShadow: "0 20px 40px rgba(101,81,240,0.35)",
                }}
                transition={{
                  duration: 0.15,
                  ease: "easeOut"
                }}
                className="
                  w-16 h-16 bg-primary rounded-2xl
                  flex items-center justify-center 
                  mx-auto mt-12 shadow-xl shadow-primary/40
                "
              >
                <span className="text-white font-extrabold text-3xl">D</span>
              </motion.div>

              <h2 className="text-3xl font-extrabold text-slate-900 mt-4">
                Welcome Back
              </h2>
              <p className="text-slate-600 mt-2">
                Sign in to continue your impact journey
              </p>
            </div>

            {/* FORM */}
            <form onSubmit={handleLogin} className="space-y-6">
              {/* Fake autofill inputs */}
              <input type="text" autoComplete="username" className="hidden" />
              <input type="password" autoComplete="new-password" className="hidden" />

              {/* EMAIL FIELD */}
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 z-20 text-slate-700 w-5 h-5" />

                <input
                  type="email"
                  required
                  autoComplete="off"
                  className="
                    peer w-full pl-14 pr-4 py-3.5 bg-white/60
                    border border-slate-300 rounded-xl text-slate-900
                    backdrop-blur-xl shadow-inner
                    focus:ring-2 focus:ring-primary/40 focus:border-primary
                    transition-all
                  "
                  style={{ WebkitTextFillColor: '#0f172a' }}
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

              {/* PASSWORD FIELD */}
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 z-20 text-slate-700 w-5 h-5" />

                <input
                  type="password"
                  required
                  autoComplete="off"
                  className="
                    peer w-full pl-14 pr-4 py-3.5 bg-white/60
                    border border-slate-300 rounded-xl text-slate-900
                    shadow-inner backdrop-blur-xl
                    focus:ring-2 focus:ring-primary/40 focus:border-primary
                    transition-all
                  "
                  style={{ WebkitTextFillColor: '#0f172a' }}
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

              {/* REMEMBER + FORGOT */}
              <div className="flex items-center justify-between text-sm mt-1">
                <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                  <input type="checkbox" className="rounded border-slate-300 text-primary" />
                  Remember me
                </label>

                <a href="#" className="text-primary font-semibold hover:underline">
                  Forgot password?
                </a>
              </div>

              {/* SIGN IN BUTTON */}
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                disabled={loading}
                type="submit"
                className="
                  w-full py-3.5 bg-primary text-white font-bold rounded-xl
                  shadow-xl shadow-primary/30 hover:bg-primary-hover
                  flex items-center justify-center gap-2 transition-all
                "
              >
                {loading ? (
                  <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>Sign In <ArrowRight className="w-5 h-5" /></>
                )}
              </motion.button>
            </form>

            {/* DIVIDER */}
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

            {/* GOOGLE LOGIN BUTTON */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="
                w-full flex items-center gap-3 px-20 py-3
                bg-white/50 backdrop-blur-xl border border-white/50
                rounded-xl shadow-[0_8px_20px_rgba(0,0,0,0.06)]
                transition-all hover:bg-white/70
              "
            >
              <img
                src="/google.png"
                className="w-5 h-5"
                alt="Google"
              />
              <span className="font-semibold text-slate-800">
                Login using Google
              </span>
            </motion.button>

            {/* FOOTER */}
            <p className="mt-8 text-center text-sm text-slate-700">
              Don’t have an account?{' '}
              <Link to="/signup" className="font-bold text-primary hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </ParallaxBackground>
  );
};

export default Login;
