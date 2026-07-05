import React from 'react';
import { motion } from 'framer-motion';

const LoadingScreen = () => {
  const orbitVariants = {
    animate: {
      rotate: 360,
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: 'linear'
      }
    }
  };

  const pulseVariants = {
    animate: {
      scale: [1, 1.2, 1],
      opacity: [0.5, 1, 0.5],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut'
      }
    }
  };

  const floatVariants = {
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: 'easeInOut'
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-space-gradient flex items-center justify-center z-50">
      {/* Background Stars */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Main Loading Content */}
      <div className="relative flex flex-col items-center">
        {/* Orbital System */}
        <div className="relative w-32 h-32 mb-8">
          {/* Central Planet */}
          <motion.div
            variants={pulseVariants}
            animate="animate"
            className="absolute inset-0 w-16 h-16 m-auto bg-gradient-to-br from-neon-blue to-neon-purple rounded-full shadow-lg shadow-neon-blue/50"
          />

          {/* Orbit Ring 1 */}
          <motion.div
            variants={orbitVariants}
            animate="animate"
            className="absolute inset-0 border-2 border-neon-blue/30 rounded-full"
          >
            <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-neon-green rounded-full shadow-lg shadow-neon-green/50" />
          </motion.div>

          {/* Orbit Ring 2 */}
          <motion.div
            variants={orbitVariants}
            animate="animate"
            className="absolute inset-0 border-2 border-neon-purple/20 rounded-full scale-125"
            style={{ animationDelay: '1s' }}
          >
            <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-neon-purple rounded-full shadow-lg shadow-neon-purple/50" />
          </motion.div>

          {/* Orbit Ring 3 */}
          <motion.div
            variants={orbitVariants}
            animate="animate"
            className="absolute inset-0 border border-gray-500/20 rounded-full scale-150"
            style={{ animationDelay: '2s' }}
          >
            <div className="absolute -top-0.5 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-gray-400 rounded-full" />
          </motion.div>
        </div>

        {/* Logo and Text */}
        <motion.div
          variants={floatVariants}
          animate="animate"
          className="text-center"
        >
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center">
              <span className="text-white font-bold text-xl">S</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">SkySentinal</h1>
              <p className="text-sm text-gray-400">Space Debris Monitoring</p>
            </div>
          </div>

          {/* Loading Text */}
          <motion.p
            className="text-gray-300 text-lg mb-6"
            animate={{
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          >
            Initializing Mission Control...
          </motion.p>

          {/* Progress Bar */}
          <div className="w-64 h-1 bg-dark-lighter rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-neon-blue to-neon-purple"
              animate={{
                x: ['-100%', '100%'],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            />
          </div>

          {/* Loading Steps */}
          <div className="mt-6 space-y-2">
            {[
              'Connecting to satellite network...',
              'Loading orbital data...',
              'Initializing tracking systems...',
              'Preparing mission dashboard...'
            ].map((step, index) => (
              <motion.p
                key={index}
                className="text-sm text-gray-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  delay: index * 0.5,
                  duration: 0.5
                }}
              >
                {step}
              </motion.p>
            ))}
          </div>
        </motion.div>

        {/* Floating Particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-neon-blue/50 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -100],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      </div>

      {/* Bottom Info */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center">
        <p className="text-xs text-gray-500">
          Powered by Advanced Space Tracking Technology
        </p>
        <p className="text-xs text-gray-600 mt-1">
          v2.1.0 • {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
};

export default LoadingScreen;