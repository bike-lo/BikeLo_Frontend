import { useEffect } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoadingScreenProps {
  isVisible: boolean;
}

export default function LoadingScreen({ isVisible }: LoadingScreenProps) {
  useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isVisible]);

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          key="loading-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.43, 0.13, 0.23, 0.96] }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-transparent"
        >
          <div className="w-72 h-72 relative">
             {/* Atmospheric ambient glow */}
             <motion.div 
               animate={{ 
                 scale: [1, 1.15, 1],
                 opacity: [0.15, 0.25, 0.15] 
               }}
               transition={{ 
                 duration: 4, 
                 repeat: Infinity, 
                 ease: "easeInOut" 
               }}
               className="absolute inset-0 bg-[#f7931e] blur-[120px] rounded-full" 
             />
             
             <div className="relative z-10 w-full h-full">
               <DotLottieReact
                 src="https://lottie.host/4daf9033-bbf9-4eb1-bc25-ce359ea28858/5XDeFySVVK.lottie"
                 autoplay
                 loop
               />
             </div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mt-12 flex flex-col items-center gap-5"
          >
            <div className="flex flex-col items-center gap-1">
              <h2 className="text-white text-[10px] font-black uppercase tracking-[0.8em] ml-[0.8em]">
                Bike-Lo
              </h2>
              <p className="text-[#f7931e] text-[7px] font-black uppercase tracking-[0.4em] ml-[0.4em] opacity-80">
                Premium Pre-Owned
              </p>
            </div>

            <div className="w-40 h-[1px] bg-white/5 relative overflow-hidden">
               <motion.div 
                 className="absolute inset-0 bg-gradient-to-r from-transparent via-[#f7931e] to-transparent w-full"
                 animate={{ x: ["-100%", "100%"] }}
                 transition={{ 
                   repeat: Infinity, 
                   duration: 2.5, 
                   ease: "easeInOut" 
                 }}
               />
            </div>
            
            <motion.span 
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-white/30 text-[8px] font-medium uppercase tracking-[0.2em]"
            >
              Initializing Experience
            </motion.span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
