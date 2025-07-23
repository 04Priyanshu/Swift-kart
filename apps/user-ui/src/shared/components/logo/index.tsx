"use client";
import { motion } from 'framer-motion';
import { ShoppingCart, Zap } from 'lucide-react';

// Import Google Fonts
const FontLoader = () => (
  <>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
    <link 
      href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Exo+2:wght@400;700;800;900&family=Rajdhani:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap" 
      rel="stylesheet" 
    />
  </>
);

const AnimatedSwiftKartLogo = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const letterVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      rotateX: -90
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 200
      }
    }
  };

  const cartVariants = {
    hidden: { 
      x: -50, 
      opacity: 0,
      rotate: -45
    },
    visible: {
      x: 0,
      opacity: 1,
      rotate: 0,
      transition: {
        type: "spring",
        damping: 10,
        stiffness: 150,
        delay: 0.5
      }
    }
  };

  const zapVariants = {
    hidden: { 
      scale: 0,
      rotate: 180,
      opacity: 0
    },
    visible: {
      scale: 1,
      rotate: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 8,
        stiffness: 200,
        delay: 0.7
      }
    }
  };

  const glowVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: [0, 0.8, 0],
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut"
      }
    }
  };

  const text = "Swift Kart";
  
  return (
    <>
      <FontLoader />
      <motion.div 
        className="flex items-center gap-3 cursor-pointer group relative"
        variants={containerVariants as any}
        initial="hidden"
        animate="visible"
        whileHover="hover"
      >
      {/* Animated Shopping Cart */}
      <motion.div 
        className="relative"
        variants={cartVariants as any}
      >
        {/* Glow effect */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(52, 137, 255, 0.3) 0%, transparent 70%)',
            filter: 'blur(8px)',
          }}
          variants={glowVariants as any}
        />
        
        <motion.div
          className="relative z-10 w-10 h-10 bg-gradient-to-br from-[#3489FF] to-[#1e40af] rounded-full flex items-center justify-center shadow-lg"
          whileHover={{ 
            scale: 1.1,
            rotate: [0, -10, 10, 0],
            transition: { duration: 0.6 }
          }}
        >
          <ShoppingCart className="w-5 h-5 text-white" />
        </motion.div>

        {/* Lightning bolt for "Swift" */}
        <motion.div
          className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center"
          variants={zapVariants as any}
          whileHover={{ 
            scale: 1.2,
            rotate: 360,
            transition: { duration: 0.8 }
          }}
        >
          <Zap className="w-2 h-2 text-yellow-800" fill="currentColor" />
        </motion.div>
      </motion.div>

      {/* Animated Text */}
      <div className="flex items-baseline">
        {text.split('').map((letter, index) => (
          <motion.span
            key={index}
            className={`text-3xl font-black tracking-wide ${
              letter === 'S' || letter === 'K' 
                ? 'bg-gradient-to-r from-[#3489FF] to-[#1e40af] bg-clip-text text-transparent' 
                : 'text-gray-800'
            }`}
            style={{
              fontFamily: '"Orbitron", "Exo 2", "Rajdhani", "Space Grotesk", monospace',
              textShadow: '0 2px 4px rgba(0,0,0,0.1)',
              letterSpacing: '0.05em',
              display: letter === ' ' ? 'inline' : 'inline-block',
              marginRight: letter === ' ' ? '0.5rem' : '0'
            }}
            variants={letterVariants as any}
            whileHover={{ 
              scale: 1.1,
              color: '#3489FF',
              transition: { duration: 0.2 }
            }}
          >
            {letter === ' ' ? '\u00A0' : letter}
          </motion.span>
        ))}
      </div>

      {/* Subtle background glow on hover */}
      <motion.div
        className="absolute inset-0 rounded-lg"
        style={{
          background: 'linear-gradient(45deg, rgba(52, 137, 255, 0.05) 0%, rgba(30, 64, 175, 0.05) 100%)',
          filter: 'blur(20px)',
        }}
        initial={{ opacity: 0, scale: 0.8 }}
        whileHover={{ 
          opacity: 1, 
          scale: 1.1,
          transition: { duration: 0.3 }
        }}
      />
    </motion.div>
    </>
  );
};

export default AnimatedSwiftKartLogo;