/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { TreePine } from 'lucide-react';

export default function SplashScreen({ onComplete }: { onComplete: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      onAnimationComplete={(definition) => {
        // Wait a bit then call complete
        if (definition === 'animate') {
          setTimeout(onComplete, 3500);
        }
      }}
      className="fixed inset-0 z-[100] bg-natural-primary flex flex-col items-center justify-center overflow-hidden"
    >
      <div className="relative">
        <motion.div
          initial={{ scale: 0, rotate: -45 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            type: "spring",
            stiffness: 260,
            damping: 20,
            duration: 1.5
          }}
          className="bg-white p-8 rounded-[40px] shadow-2xl relative z-10"
        >
          <TreePine size={80} className="text-natural-primary" />
        </motion.div>
        
        {/* Background decorative elements */}
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 90, 180, 270, 360],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute -inset-20 border-[40px] border-white/10 rounded-full"
        />
      </div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="text-center mt-12"
      >
        <h1 className="text-white text-5xl font-black tracking-tighter mb-2">GroundPro</h1>
        <p className="text-white/70 text-lg font-medium tracking-widest uppercase">Mastering the Turf</p>
      </motion.div>

      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: 240 }}
        transition={{ delay: 1, duration: 2, ease: "easeInOut" }}
        className="h-1 bg-white/30 rounded-full mt-12 overflow-hidden"
      >
        <motion.div 
          initial={{ x: "-100%" }}
          animate={{ x: "0%" }}
          transition={{ delay: 1, duration: 2, ease: "easeInOut" }}
          className="h-full bg-white w-full"
        />
      </motion.div>
    </motion.div>
  );
}
