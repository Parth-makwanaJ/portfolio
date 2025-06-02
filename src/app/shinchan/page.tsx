'use client';

import Image from "next/image";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function ShinchanHug() {
  const [isHugging, setIsHugging] = useState(false);
  const [showHearts, setShowHearts] = useState(false);
  const [hugCount, setHugCount] = useState(0);

  const handleHug = () => {
    setIsHugging(true);
    setShowHearts(true);
    setHugCount(prev => prev + 1);
    
    // Reset after animation
    setTimeout(() => {
      setIsHugging(false);
    }, 2000);
    
    setTimeout(() => {
      setShowHearts(false);
    }, 3000);
  };

  // Generate random hearts
  const hearts = Array.from({ length: 8 }, (_, i) => (
    <motion.div
      key={i}
      initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
      animate={showHearts ? {
        opacity: [0, 1, 1, 0],
        scale: [0, 1, 1.2, 0],
        x: Math.random() * 200 - 100,
        y: Math.random() * -150 - 50,
        rotate: Math.random() * 360
      } : {}}
      transition={{
        duration: 3,
        delay: i * 0.2,
        ease: "easeOut"
      }}
      className="absolute text-2xl pointer-events-none"
      style={{
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)'
      }}
    >
      ❤️
    </motion.div>
  ));

  return (
<div className="h-screen overflow-hidden relative flex flex-col items-center justify-center bg-gradient-to-br from-pink-100 via-blue-50 to-yellow-100 p-2 sm:p-4">

      
      {/* Floating background elements */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-2xl sm:text-3xl opacity-20"
            animate={{
              y: [0, -20, 0],
              rotate: [0, 360],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              delay: i * 0.5
            }}
            style={{
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 20}%`
            }}
          >
            {['🌸', '⭐', '🎈', '🌈', '✨', '🦋'][i]}
          </motion.div>
        ))}
      </div>

      {/* Main Shinchan Container */}
      <div className="relative flex-1 flex items-center justify-center w-full max-w-4xl">
        {/* Hearts container */}
        <div className="absolute inset-0 pointer-events-none">
          {hearts}
        </div>

        {/* Shinchan Image */}
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{
            scale: isHugging ? [1, 1.2, 1.1] : [1, 1.05, 1],
            rotate: isHugging ? [0, -2, 2, 0] : [0, 1, -1, 0]
          }}
          transition={{
            duration: isHugging ? 0.5 : 1.5,
            repeat: isHugging ? 3 : Infinity,
            ease: "easeInOut"
          }}
          className="rounded-2xl overflow-hidden shadow-2xl bg-white p-2 sm:p-4 lg:p-6 cursor-pointer hover:shadow-3xl transition-shadow duration-300 w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl"
          onClick={handleHug}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="relative w-full">
            <Image
              src="/shin-chan.png"
              alt="Shinchan wants a hug"
              width={600}
              height={600}
              className="rounded transition-all duration-300 w-full h-auto object-contain"
              style={{
                filter: isHugging ? 'brightness(1.2) contrast(1.1)' : 'none',
                maxHeight: '60vh'
              }}
              priority
            />
            
            {/* Hug overlay effect */}
            {isHugging && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.3, 0] }}
                transition={{ duration: 2 }}
                className="absolute inset-0 bg-pink-200 rounded mix-blend-overlay"
              />
            )}

            {/* Sparkle effects around image */}
            {isHugging && (
              <>
                {[...Array(12)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{
                      opacity: [0, 1, 0],
                      scale: [0, 1, 0],
                      x: Math.cos(i * 30 * Math.PI / 180) * (window.innerWidth < 640 ? 60 : 100),
                      y: Math.sin(i * 30 * Math.PI / 180) * (window.innerWidth < 640 ? 60 : 100),
                    }}
                    transition={{
                      duration: 1.5,
                      delay: i * 0.1,
                      ease: "easeOut"
                    }}
                    className="absolute text-yellow-400 text-lg sm:text-xl pointer-events-none"
                    style={{
                      left: '50%',
                      top: '50%',
                      transform: 'translate(-50%, -50%)'
                    }}
                  >
                    ✨
                  </motion.div>
                ))}
              </>
            )}
          </div>
        </motion.div>
      </div>

      {/* Interactive Text */}
      <motion.p 
        animate={{
          color: isHugging ? '#e11d48' : '#374151',
          scale: isHugging ? 1.1 : 1
        }}
        className="text-sm sm:text-base md:text-lg font-medium mt-2 sm:mt-4 text-center max-w-xs sm:max-w-md px-4"
      >
        {isHugging 
          ? "Yay! Shinchan loves hugs! 🥰" 
          : "Click on Shinchan to give him a big hug! 🤗"
        }
      </motion.p>

      {/* Hug Counter */}
      {hugCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 sm:mt-4 bg-white rounded-full px-4 sm:px-6 py-1 sm:py-2 shadow-lg border-2 border-pink-200"
        >
          <p className="text-pink-600 font-bold text-sm sm:text-base">
            Hugs given: {hugCount} 🤗
          </p>
        </motion.div>
      )}

      {/* Fun Messages */}
      {hugCount >= 5 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-2 sm:mt-4 bg-yellow-100 rounded-lg p-2 sm:p-4 border-2 border-yellow-300 max-w-xs sm:max-w-sm text-center mx-4"
        >
          <p className="text-orange-600 font-bold text-xs sm:text-sm">
            🎉 Wow! You're such a good hugger! Shinchan is super happy! 🎉
          </p>
        </motion.div>
      )}

      {hugCount >= 10 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-1 sm:mt-2 text-center"
        >
          <p className="text-xl sm:text-2xl">🏆 Hug Champion! 🏆</p>
        </motion.div>
      )}

      {/* Instructions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-4 sm:mt-8 text-center text-gray-600 text-xs sm:text-sm max-w-xs sm:max-w-md px-4"
      >
        <p>💡 Tap or click on Shinchan to see the magic happen!</p>
      </motion.div>
    </div>
  );
}