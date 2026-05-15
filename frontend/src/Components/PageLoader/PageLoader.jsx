import React from "react";

const PageLoader = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#050505] relative overflow-hidden">
      {/* Ambient Glow Effects */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="absolute w-64 h-64 bg-red-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute w-48 h-48 bg-red-600/5 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      </div>

      {/* Film Strip Loader */}
      <div className="relative mb-10">
        <div className="flex items-center gap-1">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="w-3 h-16 bg-gradient-to-b from-red-600 to-red-700 rounded-sm"
              style={{
                animation: `filmStrip 1.5s ease-in-out infinite`,
                animationDelay: `${i * 0.1}s`,
                opacity: 0.6 + (i % 3) * 0.2
              }}
            />
          ))}
        </div>

        {/* Film reels */}
        <div className="absolute -left-8 top-1/2 -translate-y-1/2 w-10 h-10 border-4 border-red-500/30 rounded-full animate-spin" style={{ animationDuration: '3s' }}>
          <div className="w-full h-full border-2 border-red-500/50 rounded-full border-dashed"></div>
        </div>
        <div className="absolute -right-8 top-1/2 -translate-y-1/2 w-10 h-10 border-4 border-red-500/30 rounded-full animate-spin" style={{ animationDuration: '3s', animationDirection: 'reverse' }}>
          <div className="w-full h-full border-2 border-red-500/50 rounded-full border-dashed"></div>
        </div>
      </div>

      {/* Cinema Icon */}
      <div className="relative mb-8">
        <div className="w-20 h-16 bg-gradient-to-br from-red-600 to-red-700 rounded-t-lg rounded-b-sm shadow-lg shadow-red-500/40 relative overflow-hidden">
          {/* Projector light effect */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent"></div>
          {/* Screen lines */}
          <div className="absolute inset-0 flex flex-col justify-evenly py-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-0.5 bg-black/20 mx-1 rounded-full"></div>
            ))}
          </div>
        </div>
        {/* Spotlight effect */}
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-16 h-8 bg-gradient-to-b from-red-500/30 to-transparent blur-md"></div>
      </div>

      {/* Loading dots with cinema theme */}
      <div className="flex items-center gap-2 mb-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="w-2.5 h-2.5 bg-red-500 rounded-full"
            style={{
              animation: `loadingDot 1.4s ease-in-out infinite`,
              animationDelay: `${i * 0.2}s`
            }}
          />
        ))}
      </div>

      {/* Loading text */}
      <p className="text-gray-400 text-sm font-medium tracking-wider uppercase">
        <span className="inline-block animate-loadingText">P</span>
        <span className="inline-block animate-loadingText" style={{ animationDelay: '0.1s' }}>r</span>
        <span className="inline-block animate-loadingText" style={{ animationDelay: '0.2s' }}>e</span>
        <span className="inline-block animate-loadingText" style={{ animationDelay: '0.3s' }}>p</span>
        <span className="inline-block animate-loadingText" style={{ animationDelay: '0.4s' }}>a</span>
        <span className="inline-block animate-loadingText" style={{ animationDelay: '0.5s' }}>r</span>
        <span className="inline-block animate-loadingText" style={{ animationDelay: '0.6s' }}>i</span>
        <span className="inline-block animate-loadingText" style={{ animationDelay: '0.7s' }}>n</span>
        <span className="inline-block animate-loadingText" style={{ animationDelay: '0.8s' }}>g</span>
        <span className="mx-1"></span>
        <span className="inline-block animate-loadingText" style={{ animationDelay: '0.9s' }}>S</span>
        <span className="inline-block animate-loadingText" style={{ animationDelay: '1s' }}>h</span>
        <span className="inline-block animate-loadingText" style={{ animationDelay: '1.1s' }}>o</span>
        <span className="inline-block animate-loadingText" style={{ animationDelay: '1.2s' }}>w</span>
      </p>

      {/* Custom CSS animations injected via style tag */}
      <style>{`
        @keyframes filmStrip {
          0%, 100% { transform: scaleY(1); }
          50% { transform: scaleY(0.5); }
        }

        @keyframes loadingDot {
          0%, 80%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          40% {
            transform: scale(1.3);
            opacity: 0.7;
          }
        }

        @keyframes loadingText {
          0%, 100% {
            transform: translateY(0);
            opacity: 1;
          }
          50% {
            transform: translateY(-3px);
            opacity: 0.6;
          }
        }

        .animate-loadingText {
          animation: loadingText 1.4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default PageLoader;