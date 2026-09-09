"use client";

import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { useEffect, useState } from 'react';

interface HeroProps {
  locale: 'en' | 'ar';
  dictionary: {
    headline: string[];
    sub: string;
    cta: string;
    scrollLabel: string;
  };
}

export default function Hero({ locale, dictionary }: HeroProps) {
  const isRtl = locale === 'ar';
  const prefersReducedMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const headlineVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.2 + 0.5,
        duration: 0.8,
        ease: [0.21, 0.47, 0.32, 0.98] as [number, number, number, number]
      }
    })
  };

  const nodes = [
    { id: 1, label: 'Strategy', cx: 20, cy: 30, color: '#0454FF' },
    { id: 2, label: 'Brand', cx: 70, cy: 20, color: '#60A5FA' },
    { id: 3, label: 'Marketing', cx: 80, cy: 70, color: '#0B0F19' },
    { id: 4, label: 'Digital', cx: 30, cy: 80, color: '#0454FF' },
    { id: 5, label: 'Technology', cx: 50, cy: 50, color: '#93C5FD' },
  ];

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-white flex items-center pt-24 pb-12">
      {/* Background Visual System */}
      <div className="absolute inset-0 pointer-events-none opacity-30 lg:opacity-100 overflow-hidden" aria-hidden="true">
        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice" viewBox="0 0 100 100">
          <defs>
            <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0454FF" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#0B0F19" stopOpacity="0.6" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Connections */}
          {mounted && nodes.map((node, i) => {
            const nextNode = nodes[(i + 1) % nodes.length];
            return (
              <motion.path
                key={`path-${i}`}
                d={`M ${node.cx} ${node.cy} Q 50 50 ${nextNode.cx} ${nextNode.cy}`}
                fill="none"
                stroke="url(#line-gradient)"
                strokeWidth="0.2"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ 
                  pathLength: 1, 
                  opacity: 1,
                  d: [
                    `M ${node.cx} ${node.cy} Q 50 50 ${nextNode.cx} ${nextNode.cy}`,
                    `M ${node.cx + (Math.random()*10 - 5)} ${node.cy + (Math.random()*10 - 5)} Q 50 50 ${nextNode.cx + (Math.random()*10 - 5)} ${nextNode.cy + (Math.random()*10 - 5)}`,
                    `M ${node.cx} ${node.cy} Q 50 50 ${nextNode.cx} ${nextNode.cy}`,
                  ]
                }}
                transition={{ 
                  pathLength: { duration: 2, delay: i * 0.3 },
                  opacity: { duration: 1, delay: i * 0.3 },
                  d: { 
                    duration: prefersReducedMotion ? 0 : 20 + i * 2, 
                    repeat: Infinity, 
                    repeatType: "reverse",
                    ease: "easeInOut"
                  }
                }}
              />
            );
          })}

          {/* Nodes */}
          {mounted && nodes.map((node, i) => (
            <motion.g 
              key={`node-${node.id}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 + i * 0.2, duration: 1 }}
            >
              <motion.circle
                cx={node.cx}
                cy={node.cy}
                r="1"
                fill={node.color}
                filter="url(#glow)"
                animate={prefersReducedMotion ? {} : {
                  cx: [node.cx, node.cx + (Math.random() * 8 - 4), node.cx],
                  cy: [node.cy, node.cy + (Math.random() * 8 - 4), node.cy],
                }}
                transition={{
                  duration: 15 + i * 3,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut"
                }}
              />
              <motion.text
                x={node.cx}
                y={node.cy + 3}
                fontSize="2"
                fill="#0B0F19"
                textAnchor="middle"
                className="font-mono"
                animate={prefersReducedMotion ? {} : {
                  x: [node.cx, node.cx + (Math.random() * 8 - 4), node.cx],
                  y: [node.cy + 3, node.cy + 3 + (Math.random() * 8 - 4), node.cy + 3],
                }}
                transition={{
                  duration: 15 + i * 3,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut"
                }}
              >
                {node.label}
              </motion.text>
            </motion.g>
          ))}
        </svg>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 relative z-10">
        <div className={`max-w-3xl ${isRtl ? 'mr-auto' : 'ml-auto lg:ml-0'}`}>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-[#0B0F19] mb-8 leading-[1.1]">
            {dictionary.headline.map((word, i) => (
              <motion.span
                key={i}
                custom={i}
                variants={headlineVariants}
                initial="hidden"
                animate="visible"
                className={`block ${i === dictionary.headline.length - 1 ? 'text-[#0454FF]' : ''}`}
              >
                {word}
              </motion.span>
            ))}
          </h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="text-lg md:text-xl text-gray-600 mb-12 max-w-xl leading-relaxed"
          >
            {dictionary.sub}
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.8 }}
          >
            <button className="group flex items-center gap-3 bg-[#0454FF] text-white px-8 py-4 rounded-full font-medium transition-all hover:bg-[#0B0F19] hover:shadow-lg hover:shadow-blue-500/20">
              <span>{dictionary.cta}</span>
              <ArrowRight className={`w-5 h-5 transition-transform group-hover:translate-x-1 ${isRtl ? 'rotate-180 group-hover:-translate-x-1 group-hover:translate-x-0' : ''}`} />
            </button>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-400"
      >
        <span className="text-sm font-mono uppercase tracking-widest">{dictionary.scrollLabel}</span>
        <motion.div
          animate={prefersReducedMotion ? {} : { y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </motion.div>
    </section>
  );
}
