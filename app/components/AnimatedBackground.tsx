"use client";

"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Generate an array of particle positions once on the client.
const generateParticles = () =>
  Array.from({ length: 30 }).map(() => ({
    top: Math.random() * 100,
    left: Math.random() * 100,
  }));

export default function AnimatedBackground() {
  const [particles, setParticles] = useState<{ top: number; left: number }[]>([]);

  useEffect(() => {
    setParticles(generateParticles());
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Floating particles */}
      {particles.map((p, i) => (
        <motion.span
          key={i}
          className="absolute block w-2 h-2 rounded-full bg-purple-600 opacity-30"
          style={{ top: `${p.top}%`, left: `${p.left}%` }}
          animate={{
            y: [0, -20, 20, 0],
            x: [0, 20, -20, 0],
            opacity: [0.2, 0.8, 0.2],
          }}
          transition={{
            repeat: Infinity,
            duration: 8 + Math.random() * 4,
            ease: 'linear',
            delay: Math.random() * 2,
          }}
        />
      ))}

      {/* Pulsing orbs */}
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={"orb-" + i}
          className="absolute rounded-full bg-purple-700 opacity-20"
          style={{
            width: `${200 + i * 150}px`,
            height: `${200 + i * 150}px`,
            top: '50%',
            left: '50%',
            marginTop: `-${(200 + i * 150) / 2}px`,
            marginLeft: `-${(200 + i * 150) / 2}px`,
          }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.05, 0.15] }}
          transition={{ repeat: Infinity, duration: 12 + i * 4, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}
