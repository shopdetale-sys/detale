"use client";

"use client";

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import AnimatedBackground from './components/AnimatedBackground';

export default function Home() {
  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden bg-black">
      {/* Animated background */}
      <AnimatedBackground />

      {/* Center content */}
      <motion.div
        className="relative z-10 flex flex-col items-center text-center px-4"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
      >
        <Image src="/logo.png" alt="Detale Logo" width={200} height={200} priority />
        <motion.h1
          className="mt-6 text-4xl font-bold accent-text"
          style={{ color: 'var(--accent)' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          COMING SOON
        </motion.h1>
        <motion.p
          className="mt-4 text-lg max-w-md"
          style={{ color: 'var(--accent-light)' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
        >
          Something beautiful is taking shape.
        </motion.p>
        <motion.p
          className="mt-2 text-base max-w-md"
          style={{ color: '#a0a0a0' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
        >
          We're working on something special. Stay tuned for the launch.
        </motion.p>
        {/* Loading line */}
        <motion.div
          className="mt-8 w-48 h-1 bg-purple-800 overflow-hidden rounded"
          initial={{ width: 0 }}
          animate={{ width: '12rem' }}
          transition={{ repeat: Infinity, duration: 2, repeatType: 'reverse' }}
        >
          <motion.span
            className="block h-full accent-bg"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
