'use client';

import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export default function ShinchanHug() {
  const [isHugging, setIsHugging] = useState(false);
  const [showHearts, setShowHearts] = useState(false);
  const [hugCount, setHugCount] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [showLetter, setShowLetter] = useState(false);
  const [typedText, setTypedText] = useState("");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [timeTogether, setTimeTogether] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const anniversaryDate = new Date("2025-03-03T11:30:00");

  const loveMessage = `Hello Rainy

We have completed 3 months now! This month had its share of fights and ups and downs — but we made it through together.

I know I’m not the best boyfriend, but I promise I will keep trying until you see the best version of me. I love you, Rainy, so much.

Maybe this hug button seems silly, but my feelings are not. I love you more than words could ever say. And I’ll keep trying forever.

Yours,
Parth 💖`;

  useEffect(() => {
    setIsMobile(window.innerWidth < 640);

    const updateTime = () => {
      const now = new Date();
      const diff = now.getTime() - anniversaryDate.getTime();
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      setTimeTogether({ days, hours, minutes, seconds });
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // 👇 Handle audio autoplay after first user interaction
  useEffect(() => {
    const enableAudio = () => {
      if (audioRef.current) {
        audioRef.current.muted = false;
        audioRef.current.play().catch(err => console.log("Autoplay failed:", err));
      }
    };

    window.addEventListener("click", enableAudio, { once: true });
    window.addEventListener("touchstart", enableAudio, { once: true });

    return () => {
      window.removeEventListener("click", enableAudio);
      window.removeEventListener("touchstart", enableAudio);
    };
  }, []);

  const openLetter = () => {
    setShowLetter(true);
    setTypedText("");
    let i = 0;
    const speed = 30;
    const interval = setInterval(() => {
      setTypedText((prev) => prev + loveMessage[i]);
      i++;
      if (i >= loveMessage.length) clearInterval(interval);
    }, speed);
  };

  const handleHug = () => {
    setIsHugging(true);
    setShowHearts(true);
    setHugCount((prev) => prev + 1);

    setTimeout(() => setIsHugging(false), 2000);
    setTimeout(() => setShowHearts(false), 3000);
  };

  const loveNotes = [
    "You're my sunshine ☀️",
    "Your hug is my favorite place 🤗",
    "I’ll always be here 💕",
    "Love you endlessly 💌",
    "With you, everything’s magic ✨",
    "Forever yours 🫶",
    "You’re my whole universe 🌍",
    "I loves you Rainy forever 💖"
  ];

  const hearts = Array.from({ length: 10 }, (_, i) => (
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
        delay: i * 0.15,
        ease: "easeOut"
      }}
      className="absolute text-2xl pointer-events-none"
      style={{
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)'
      }}
    >
      💖
    </motion.div>
  ));

  return (
    <div className="h-screen overflow-hidden relative flex flex-col items-center justify-center bg-gradient-to-br from-rose-100 via-indigo-100 to-yellow-50 p-3 sm:p-5">

      {/* Audio tag controlled by ref */}
      <audio
        ref={audioRef}
        src="/background-music.mp3"
        autoPlay
        loop
        muted
        className="hidden"
      />

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="absolute top-6 text-center px-4"
      >
        <p className="text-xl sm:text-2xl font-bold text-rose-600 drop-shadow-sm">
          Hey Rainy 🌧️❤️
        </p>
      </motion.div>

      <div className="absolute inset-0 pointer-events-none z-0">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-3xl opacity-20"
            animate={{ y: [0, -30, 0], rotate: [0, 360] }}
            transition={{ duration: 5 + i, repeat: Infinity, delay: i * 0.3 }}
            style={{
              left: `${10 + i * 15}%`,
              top: `${15 + (i % 3) * 25}%`
            }}
          >
            {['🌸', '💫', '🎈', '🫶', '✨', '🦋'][i]}
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 flex-1 flex items-center justify-center w-full max-w-4xl">
        <div className="absolute inset-0 pointer-events-none">{hearts}</div>

        <motion.div
          initial={{ scale: 0.9 }}
          animate={{
            scale: isHugging ? [1, 1.2, 1.05] : [1, 1.02, 1],
            rotate: isHugging ? [0, -3, 3, 0] : [0, 1, -1, 0]
          }}
          transition={{
            duration: isHugging ? 0.5 : 1.2,
            repeat: isHugging ? 3 : Infinity,
            ease: "easeInOut"
          }}
          onClick={handleHug}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.95 }}
          className="bg-white rounded-3xl shadow-xl p-4 cursor-pointer max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg"
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

            {isHugging && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.2, 0] }}
                transition={{ duration: 2 }}
                className="absolute inset-0 bg-pink-200 rounded mix-blend-lighten"
              />
            )}

            {isHugging && loveNotes.map((text, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1.1, 0],
                  x: Math.cos((i * 40 * Math.PI) / 180) * (isMobile ? 50 : 90),
                  y: Math.sin((i * 40 * Math.PI) / 180) * (isMobile ? 50 : 90),
                }}
                transition={{
                  duration: 1.8,
                  delay: i * 0.1,
                  ease: "easeOut"
                }}
                className="absolute text-rose-600 font-semibold text-xs sm:text-sm pointer-events-none"
                style={{
                  left: '48%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)'
                }}
              >
                {text}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.p
        animate={{
          color: isHugging ? '#db2777' : '#374151',
          scale: isHugging ? 1.1 : 1
        }}
        className="text-sm sm:text-base md:text-lg font-medium mt-4 text-center max-w-xs sm:max-w-md px-4"
      >
        {isHugging
          ? "Awww... your hugs mean the world to Me! 💞"
          : "Click on Shinchan to send your love, Rainy! 🤗"}
      </motion.p>

      {hugCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 sm:mt-4 bg-white rounded-full px-4 sm:px-6 py-1 sm:py-2 shadow-lg border-2 border-rose-200"
        >
          <p className="text-pink-600 font-bold text-sm sm:text-base">
            Hugs sent: {hugCount} 💕
          </p>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-3 bg-indigo-50 border border-indigo-200 px-4 py-2 rounded-full text-center shadow-sm"
      >
        <p className="text-indigo-600 text-sm sm:text-base font-medium">
          We've been together for <strong>{timeTogether.days}</strong> days, <strong>{timeTogether.hours}</strong> hours, <strong>{timeTogether.minutes}</strong> minutes, and <strong>{timeTogether.seconds}</strong> seconds 💑
        </p>
      </motion.div>

      <button
        onClick={openLetter}
        className="mt-4 px-5 py-2 bg-pink-500 text-white rounded-full shadow hover:bg-pink-600 transition"
      >
        💌 Read My Letter to You
      </button>

      {hugCount >= 10 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-6 text-center"
        >
          <p className="text-2xl font-bold text-rose-700 drop-shadow">
            I Love You Rainy... Forever and Always 🌹
          </p>
        </motion.div>
      )}

      {showLetter && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl relative">
            <button
              onClick={() => setShowLetter(false)}
              className="absolute top-2 right-3 text-gray-500 hover:text-gray-800 text-xl"
            >
              ✖
            </button>
            <h2 className="text-xl font-bold text-pink-600 mb-4">To Rainy 💖</h2>
            <p className="whitespace-pre-wrap font-mono text-sm text-gray-700 leading-relaxed">{typedText}</p>
          </div>
        </div>
      )}
    </div>
  );
}
