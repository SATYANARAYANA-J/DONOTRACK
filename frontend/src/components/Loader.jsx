import React, { useEffect, useRef, useState } from "react";

const Loader = ({ src = "/loading.gif", duration = 2500, onFinish = () => {} }) => {
  const [fade, setFade] = useState(false);
  const videoRef = useRef(null);

  const fadeDuration = 600;

  useEffect(() => {
    let timeout;

    const finishLoader = () => {
      setFade(true);
      timeout = setTimeout(onFinish, fadeDuration);
    };

    const isVideo = src.match(/\.(mp4|webm|ogg)$/i);

    if (isVideo && videoRef.current) {
      const vid = videoRef.current;
      vid.play().catch(() => setTimeout(finishLoader, duration));
      vid.onended = finishLoader;
      return () => clearTimeout(timeout);
    }

    timeout = setTimeout(finishLoader, duration);
    return () => clearTimeout(timeout);

  }, [src, duration, onFinish]);

  const isVideo = src.match(/\.(mp4|webm|ogg)$/i);

  return (
    <div
      className={`
        fixed inset-0 z-[99999] flex items-center justify-center
        transition-opacity duration-[600ms]
        ${fade ? "opacity-0 pointer-events-none" : "opacity-100"}
      `}
      style={{
        // SOLID BACKGROUND → stops LandingPage from showing
        background: "#BDE8FF",  
        // Gradient overlay on top of solid color
        backgroundImage: `
            radial-gradient(60% 45% at 25% 20%, #F9FDFF 0%, rgba(189,232,255,0) 70%),
            radial-gradient(50% 40% at 80% 15%, #8CD6FF 0%, rgba(140,214,255,0) 75%),
            radial-gradient(55% 50% at 70% 55%, #BDE8FF 0%, rgba(189,232,255,0) 70%),
            radial-gradient(60% 50% at 50% 90%, #4DA6FF 0%, rgba(77,166,255,0) 70%),
            radial-gradient(70% 55% at 10% 85%, #0060DE 0%, rgba(0,96,222,0) 80%)
        `,
        backgroundBlendMode: "normal",
      }}
    >
      {/* LOADING MEDIA */}
      <div className="flex flex-col items-center">
        {isVideo ? (
          <video
            ref={videoRef}
            src={src}
            autoPlay
            muted
            playsInline
            className="w-40 h-40 object-contain"
          />
        ) : (
          <img src={src} className="w-40 h-40 object-contain" />
        )}
      </div>
    </div>
  );
};

export default Loader;
